import axios from "axios";

export const nextApi = axios.create({
  baseURL: "/api",
});
