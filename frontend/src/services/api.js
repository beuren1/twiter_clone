import axios from "axios";

const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://127.0.0.1:8000/api";

const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.response.use(
    (response) => response,

    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;

            const refresh = localStorage.getItem("refresh");

            if (!refresh) {
                localStorage.removeItem("access");
                localStorage.removeItem("refresh");

                window.location.href = "/";
                return Promise.reject(error);
            }

            try {
                const response = await axios.post(
                    `${API_URL}/token/refresh/`,
                    {
                        refresh,
                    }
                );

                const newAccess = response.data.access;

                localStorage.setItem(
                    "access",
                    newAccess
                );

                originalRequest.headers.Authorization =
                    `Bearer ${newAccess}`;

                return api(originalRequest);
            } catch {
                localStorage.removeItem("access");
                localStorage.removeItem("refresh");

                window.location.href = "/";

                return Promise.reject(error);
            }
        }

        return Promise.reject(error);
    }
);

export default api;