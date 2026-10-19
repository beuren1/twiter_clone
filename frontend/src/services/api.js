import axios from "axios";

const api = axios.create({
    baseURL: "http://127.0.0.1:8000/api",
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
                    "http://127.0.0.1:8000/api/token/refresh/",
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