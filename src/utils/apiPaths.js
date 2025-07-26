export const BASE_URL = "https://interview-prep-backend-pav7.onrender.com";

export const API_PATHS = {
  AUTH: {
    REGISTER: "/api/auth/register", //Signup
    LOGIN: "/api/auth/login", //Authenticate user and return JWT token
    GET_PROFILE: "/api/auth/profile", //Get logged-in user details
  },

  IMAGE: {
    UPLOAD_IMAGE: "/api/auth/upload-image", //Upload profile picture
  },

  AI: {
    GENERATE_QUESTIONS: "/api/ai/generate-questions", //Generate interview questions and answers using GEMINI
    GENERATE_EXPLANATION: "/api/ai/generate-explanation", //Generate concept explanation using GEMINI
  },

  SESSION: {
    CREATE: "/api/sessions/create", //Create a new interview session with questions
    GET_ALL: "/api/sessions/my-sessions", //Get all user sessions
    GET_ONE: (id) => `/api/sessions/${id}`, //Get session details with question
    DELETE: (id) => `/api/sessions/${id}`, //Delete a session
  },

  QUESTION: {
    ADD_TO_SESSION: "/api/questions/add", //Add more questions to a session
    PIN: (id) => `/api/questions/${id}/pin`, //Pin or unpin a question
    UPDATE_NOTE: (id) => `/api/questions/${id}/note`, //Update/Add a note to question
  },
};
