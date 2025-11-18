import axios from "axios";

export const publicApi = axios.create({
  baseURL: "http://localhost:3001",
});

export const adminApi = axios.create({
  baseURL: "http://localhost:3002",
});
