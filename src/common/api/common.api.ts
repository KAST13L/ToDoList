import axios from "axios";

export const instance = axios.create({
  baseURL: "https://social-network.samuraijs.com/api/1.1/",
  withCredentials: true,
  headers: {
    "API-KEY": "bdde517a-46a7-467a-aaf3-bd81b358e84b",
  },
});
