import api from "./api";

export const getProperties = async (params = {}) => {
    const response = await api.get("/properties", {
        params,
    });

    return response.data;
};

export const getProperty = async (id) => {
    const response = await api.get(`/properties/${id}`);
    return response.data;
};

export const createProperty = async (data) => {
    const response = await api.post("/properties", data);

    return response.data;
};

export const updateProperty = async (id, data) => {
    const response = await api.put(`/properties/${id}`, data);

    return response.data;
};

export const deleteProperty = async (id) => {
    const response = await api.delete(`/properties/${id}`);

    return response.data;
};