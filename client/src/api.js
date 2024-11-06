import axios from "axios";

export const protocol = "http";
export const host = "localhost:3001";
export const base = `${protocol}://${host}`;

const instance = axios.create({
  baseURL: base,
  withCredentials: true
})

export const loginUser = (data) => {
  return instance
    .post(`/api/user/login`, data);
}

export const registerUser = (data) => {
  return instance
    .post(`/api/user/register`, data)
}

export const getChatSessions = () => {
  return instance
    .get(`/api/session`);
}

export const getMessagesByChatSession = (chatSessionId, data = {}) => {
  return instance
    .post(`/api/session/messages/${chatSessionId}`, data);
}

export const checkPrivChatExists = (data) => {
  return instance
    .post(`/api/session/exists/`, data);
}

export const createPrivChatSession = (data) => {
  return instance
    .post(`/api/session/create/`, data);
}


export const searchUser = (query) => {
  return instance
    .get(`/api/user/search?q=${query}`);
}

