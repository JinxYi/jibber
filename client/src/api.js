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

export const searchUser = (query) => {
  return instance
    .get(`/api/user/search?q=${query}`);
}

