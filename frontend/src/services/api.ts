import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const getProducts = () => API.get("/products");
export const login = (email: string, password: string) =>
  API.post("/users/login", { email, password });

export default API;
