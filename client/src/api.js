import axios from "axios";

export const protocol = "http";
export const host = "localhost:3001";
export const base = `${protocol}://${host}`;


export const loginUser = (data) => {
    return axios
      .post(`${base}/api/user/login`, data);
}

export const registerUser = (data) => {
    return axios
      .post(`${base}/api/user/register`, data)
}

export const searchUser = (query) => {
    return axios
      .get(`${base}/api/user/search?q=${query}`);
}

