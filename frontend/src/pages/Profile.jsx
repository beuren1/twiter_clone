import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";

function Profile() {
    const navigate = useNavigate();

    const [profile, setProfile] = useState(null);
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState("");

    function getHeaders() {
        const token = localStorage.getItem("access");

        return {
            Authorization: `Bearer ${token}`,
        };
    }

    async function loadProfile() {
        try {
            const response = await api.get(
                "/accounts/profile/",
                {
                    headers: getHeaders(),
                }
            );

            setProfile(response.data);
        } catch {
            setError("Não foi possível carregar o perfil.");
        }
    }

    async function loadPosts() {
        try {
            const response = await api.get(
                "/posts/",
                {
                    headers: getHeaders(),
                }
            );

            const usernameResponse = await api.get(
                "/accounts/profile/",
                {
                    headers: getHeaders(),
                }
            );

            const username = usernameResponse.data.username;

            const myPosts = response.data.filter(
                (post) => post.author === username
            );

            setPosts(myPosts);
        } catch {
            setError("Não foi possível carregar seus posts.");
        }
    }

    async function deletePost(postId) {
        const confirmDelete = window.confirm(
            "Deseja realmente excluir este post?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            await api.delete(
                `/posts/${postId}/`,
                {
                    headers: getHeaders(),
                }
            );

            loadPosts();
        } catch {
            alert("Não foi possível excluir o post.");
        }
    }

    useEffect(() => {
        loadProfile();
        loadPosts();
    }, []);

    return (
        <div className="page">
            <div className="container">
                {error && (
                    <div className="card">
                        <p style={{ color: "#ef4444" }}>
                            {error}
                        </p>
                    </div>
                )}

                {profile && (
                    <div className="card">
                        <h1>Meu perfil</h1>

                        <h2>@{profile.username}</h2>

                        <p>
                            <strong>Nome:</strong>{" "}
                            {profile.name || "Não informado"}
                        </p>

                        <p>
                            <strong>Bio:</strong>{" "}
                            {profile.bio || "Não informada"}
                        </p>

                        <div
                            style={{
                                display: "flex",
                                gap: "8px",
                                flexWrap: "wrap",
                            }}
                        >
                            <button
                                className="btn"
                                onClick={() =>
                                    navigate("/editar-perfil")
                                }
                            >
                                Editar perfil
                            </button>

                            <button
                                className="btn btn-secondary"
                                onClick={() =>
                                    navigate("/alterar-senha")
                                }
                            >
                                Alterar senha
                            </button>

                            <button
                                className="btn btn-secondary"
                                onClick={() => navigate("/feed")}
                            >
                                Voltar ao feed
                            </button>
                        </div>
                    </div>
                )}

                <div className="card">
                    <h2>Meus posts</h2>

                    {posts.length === 0 && (
                        <p>Você ainda não possui posts.</p>
                    )}
                </div>

                {posts.map((post) => (
                    <div className="card" key={post.id}>
                        <p>{post.content}</p>

                        <p>
                            Curtidas: {post.likes_count} · Comentários:{" "}
                            {post.comments_count}
                        </p>

                        <div
                            style={{
                                display: "flex",
                                gap: "8px",
                            }}
                        >
                            <button
                                className="btn"
                                onClick={() =>
                                    navigate(`/editar-post/${post.id}`)
                                }
                            >
                                Editar
                            </button>

                            <button
                                className="btn btn-danger"
                                onClick={() =>
                                    deletePost(post.id)
                                }
                            >
                                Excluir
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Profile;