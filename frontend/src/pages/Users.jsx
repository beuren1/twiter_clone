import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";

function Users() {
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [error, setError] = useState("");

    function getHeaders() {
        const token = localStorage.getItem("access");

        return {
            Authorization: `Bearer ${token}`,
        };
    }

    async function loadData() {
        try {
            const usersResponse = await api.get(
                "/accounts/users/",
                {
                    headers: getHeaders(),
                }
            );

            const followingResponse = await api.get(
                "/accounts/following/",
                {
                    headers: getHeaders(),
                }
            );

            setUsers(usersResponse.data);
            setFollowing(followingResponse.data);
            setError("");
        } catch {
            setError("Não foi possível carregar os usuários.");
        }
    }

    useEffect(() => {
        loadData();
    }, []);

    function isFollowing(userId) {
        return following.some(
            (user) => user.id === userId
        );
    }

    async function handleFollow(userId) {
        try {
            if (isFollowing(userId)) {
                await api.delete(
                    `/accounts/users/${userId}/follow/`,
                    {
                        headers: getHeaders(),
                    }
                );
            } else {
                await api.post(
                    `/accounts/users/${userId}/follow/`,
                    {},
                    {
                        headers: getHeaders(),
                    }
                );
            }

            loadData();
        } catch (error) {
            alert(
                error.response?.data?.detail ||
                "Não foi possível alterar esse follow."
            );
        }
    }

    return (
        <div className="page">
            <div className="container">
                <div className="card">
                    <h1>Usuários</h1>

                    <button
                        className="btn btn-secondary"
                        onClick={() => navigate("/feed")}
                    >
                        Voltar ao feed
                    </button>
                </div>

                {error && (
                    <div className="card">
                        <p style={{ color: "#ef4444" }}>
                            {error}
                        </p>
                    </div>
                )}

                {users.map((user) => (
                    <div className="card" key={user.id}>
                        <h3>@{user.username}</h3>

                        <p>
                            {user.name || "Nome não informado"}
                        </p>

                        <button
                            className={
                                isFollowing(user.id)
                                    ? "btn btn-secondary"
                                    : "btn"
                            }
                            onClick={() => handleFollow(user.id)}
                        >
                            {isFollowing(user.id)
                                ? "Deixar de seguir"
                                : "Seguir"}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Users;