import api from "./api";

export const registerUser = async (data) => {
    const response = await api.post("/auth/register", data);
    return response.data;
};

export const loginUser = async (data) => {
    const response = await api.post("/auth/login", data);

    if (response.data.token) {
        localStorage.setItem("token", response.data.token);
    }

    return response.data;
};

export const logoutUser = () => {
    localStorage.removeItem("token");
};