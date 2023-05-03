import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3333",
  // May need to use your local or external IP Address
});
