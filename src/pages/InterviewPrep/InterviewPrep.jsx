import React, { Suspense, lazy, useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import moment from "moment";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import { LuCircle, LuCircleAlert, LuListCollapse } from "react-icons/lu";
import SpinnerLoader from "../../Components/Loader/SpinnerLoader";
import { toast } from "react-hot-toast";
import DashboardLayout from "../../Components/layouts/DashboardLayout";
import RoleInfoHeader from "./components/RoleInfoHeader";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import QuestionCard from "../../Components/Cards/QuestionCard";
import Drawer from "../../Components/Loader/Drawer";
import SkeletonLoader from "../../Components/Loader/SkeletonLoader";

const MotionDiv = motion.div;
const AIResponsePreview = lazy(() => import("./components/AIResponsePreview"));

const InterviewPrep = () => {
  const { sessionId } = useParams();

  const [sessionData, setSessionData] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const [openLearnMoreDrawer, setOpenLearnMoreDrawer] = useState(false);
  const [explanation, setExplanation] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isUpdateLoader, setIsUpdateLoader] = useState(false);

  //Fetch session data by session id
  const fetchSessionDetailsById = useCallback(async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.SESSION.GET_ONE(sessionId)
      );
      if (response.data && response.data.session) {
        console.log("Fetched Session:", response.data.session);
        setSessionData(response.data.session);
      }
    } catch (error) {
      console.error("Error", error);
    }
  }, [sessionId]);

  //generate concept explanation
  const generateConceptExplanation = async (question) => {
    try {
      setErrorMsg("");
      setExplanation(null);

      setIsLoading(true);
      setOpenLearnMoreDrawer(true);

      const response = await axiosInstance.post(
        API_PATHS.AI.GENERATE_EXPLANATION,
        {
          question,
        }
      );

      if (response.data) {
        setExplanation(response.data);
      } else {
        setErrorMsg("No data received from server");
      }
    } catch (error) {
      setExplanation(null);
      let errorMessage = error.response?.data?.error || error.response?.data?.message || error.message || "Failed to generate explanation, Try again later";
      
      // If it's a quota error, add retry information
      if (error.response?.status === 429 || errorMessage.includes("quota")) {
        const retryAfter = error.response?.data?.retryAfter;
        if (retryAfter) {
          errorMessage += ` Please try again in ${retryAfter} seconds.`;
        } else {
          errorMessage += " Please wait a moment and try again.";
        }
      }
      
      setErrorMsg(errorMessage);
      console.error("Error generating explanation: ", error);
      console.error("Error response: ", error.response?.data);
    } finally {
      setIsLoading(false);
    }
  };

  //Pin question
  const toggleQuestionPinStatus = async (questionId) => {
    try {
      const response = await axiosInstance.post(
        API_PATHS.QUESTION.PIN(questionId)
      );
      console.log(response);

      if (response.data && response.data.question) {
        //toast.success('Question Pinned Successfully);
        fetchSessionDetailsById();
      }
    } catch (error) {
      console.error("Error", error);
    }
  };

  //Add more questions to a session
  const uploadMoreQuestions = async () => {
    try {
      setIsUpdateLoader(true);      

      //Call AI API to generate more questions
      const aiResponse=await axiosInstance.post(API_PATHS.AI.GENERATE_QUESTIONS,{
        role:sessionData?.role,
        experience:sessionData?.experience,
        topicsToFocus:sessionData?.topicsToFocus,
        numberOfQuestions:10,
      });

      //Should be an array like [{question:answer},...]
      const generatedQuestions=aiResponse.data;
      const response=await axiosInstance.post(API_PATHS.QUESTION.ADD_TO_SESSION,{
        sessionId,
        questions:generatedQuestions,
      });
      if(response.data)
      {
        toast.success("Added more Q&A!");
        fetchSessionDetailsById();
        console.log("Fetched Session:", response.data.session);

      }
    }catch(error) {
      if(error.response && error.response.data.message)
      {
        setErrorMsg(error.response.data.message);
      }
      else{
        setErrorMsg("Something went wrong. Please try again");
      }
    } finally
    {
      setIsUpdateLoader(false);
    }
  };

  useEffect(() => {
    if (sessionId) {
      fetchSessionDetailsById();
    }
    return () => {};
  }, [fetchSessionDetailsById, sessionId]);
  return (
    <DashboardLayout>
      <RoleInfoHeader
        role={sessionData?.role || ""}
        topicsToFocus={sessionData?.topicsToFocus || ""}
        experience={sessionData?.experience || "-"}
        questions={sessionData?.questions?.length || "-"}
        description={sessionData?.description || ""}
        lastUpdated={
          sessionData?.updatedAt
            ? moment(sessionData.updatedAt).format("Do MMM YYYY")
            : ""
        }
      />

      <div className="container mx-auto pt-4 pb-4 px-4 md:px-0">
        <h2 className="text-lg font-semibold color-black">Interview Q & A</h2>

        <div className="grid grid-cols-12 gap-4  mt-5 mb-10">
          <div
            className={`col-span-12 ${
              openLearnMoreDrawer ? "md:col-span-7" : "md:col-span-8"
            } `}
          >
            <AnimatePresence>
              {sessionData?.questions?.map((data, index) => {
                return (
                  <MotionDiv
                    key={data._id || index}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{
                      duration: 0.4,
                      type: "spring",
                      stiffness: 100,
                      delay: index * 0.1,
                      damping: 15,
                    }}
                    layout //This is the key prop that animates position changes
                    layoutId={`question-${data._id || index}`} //helps framer track specifc items
                  >
                    <>
                      <QuestionCard
                        question={data?.question}
                        answer={data?.answer}
                        onLearnMore={() =>
                          generateConceptExplanation(data.question)
                        }
                        isPinned={data?.isPinned}
                        onTogglePin={() => toggleQuestionPinStatus(data._id)}
                      />

                      {!isLoading &&
                        sessionData?.questions?.length === index + 1 && (
                          <div className="flex items-center justify-center mt-5">
                            <button
                              className="flex items-center gap-3 text-sm text-white font-medium bg-black px-5 py-2 mr-2 rounded text-nowrap cursor-pointer"
                              disabled={isLoading || isUpdateLoader}
                              onClick={uploadMoreQuestions}
                            >
                              {isUpdateLoader ? (
                                <SpinnerLoader />
                              ) : (
                                <LuListCollapse className="text-lg" />
                              )}{" "}
                              Load More
                            </button>
                          </div>
                        )}
                    </>
                  </MotionDiv>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        <div>
          <Drawer
            isOpen={openLearnMoreDrawer}
            onClose={() => setOpenLearnMoreDrawer(false)}
            title={!isLoading && explanation?.title}
          >
            {errorMsg && (
              <p className="flex gap-2 text-sm text-amber-600 font-medium">
                <LuCircleAlert className="mt-1" /> {errorMsg}
              </p>
            )}
            {isLoading && <SkeletonLoader />}
            {!isLoading && explanation && (
              <Suspense fallback={<SkeletonLoader />}>
                <AIResponsePreview content={explanation?.explanation} />
              </Suspense>
            )}
          </Drawer>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default InterviewPrep;
