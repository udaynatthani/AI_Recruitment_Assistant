import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000/api",
});

api.interceptors.request.use((confog)=>{
    const token = localStorage.getItem("token");
    if(token){
        config.header.Authorization=`Bearer ${token}`;
    }
    return config;
}
);
export default api;