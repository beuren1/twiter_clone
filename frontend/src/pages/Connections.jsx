import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";

function Connections() {
    const navigate = useNavigate();

    const [following, setFollowing] = useState([]);
    const [followers, setFollowers] = useState([]);
    const [error, setError] = useState("");

    function getHeaders() {
        const token = localStorage.getItem("access");

        return {
            Authorization: `Bearer ${token}`,
        };
    }

    async function loadConnections() {
        try {
            const followingResponse = await api.get(
                "/accounts/following/",
                {
                    headers: getHeaders(),
                }
            );

            const followersResponse = await api.get(
                "/accounts/followers/",
                {
                    headers: getHeaders(),
                }
            );

            setFollowing(followingResponse.data);
            setFollowers(followersResponse.data);
            setError("");
        } catch {
            setError("Não foi possível carregar as conexões.");
        }
    }

    useEffect(() => {
        loadConnections();
    }, []);

    return (
        <div className="page">
            <div className="container">
                <div className="card">
                    <h1>Conexões</h1>

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

                <div className="card">
                    <h2>Seguindo</h2>

                    {following.length === 0 ? (
                        <p>Você ainda não segue ninguém.</p>
                    ) : (
                        following.map((user) => (
                            <div
                                key={user.id}
                                style={{
                                    padding: "12px 0",
                                    borderBottom: "1px solid #e5e7eb",
                                }}
                            >
                                <strong>@{user.username}</strong>

                                <p>
                                    {user.name || "Nome não informado"}
                                </p>
                            </div>
                        ))
                    )}
                </div>

                <div className="card">
                    <h2>Seguidores</h2>

                    {followers.length === 0 ? (
                        <p>Você ainda não possui seguidores.</p>
                    ) : (
                        followers.map((user) => (
                            <div
                                key={user.id}
                                style={{
                                    padding: "12px 0",
                                    borderBottom: "1px solid #e5e7eb",
                                }}
                            >
                                <strong>@{user.username}</strong>

                                <p>
                                    {user.name || "Nome não informado"}
                                </p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default Connections;
