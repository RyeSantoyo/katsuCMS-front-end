import axios from "axios";

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5058/api",
    headers: {
        "Content-Type": "application/json" 
    },
});

api.interceptors.response.use(
    (response) =>response, (error)=>{
        console.error("API ERROR", error);
        return Promise.reject(error);
    }
);