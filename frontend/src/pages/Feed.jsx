import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";

function Feed() {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState("");
    const [comments, setComments] = useState({});
    const [commentLists, setCommentLists] = useState({});

    function handleLogout() {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");

        navigate("/");
    }

    function getHeaders() {
        const token = localStorage.getItem("access");

        return {
            Authorization: `Bearer ${token}`,
        };
    }

    async function loadFeed() {
        try {
            const response = await api.get("/posts/feed/", {
                headers: getHeaders(),
            });

            setPosts(response.data);
            setError("");
        } catch {
            setError("Não foi possível carregar o feed.");
        }
    }

    async function loadComments(postId) {
        try {
            const response = await api.get(
                `/interactions/posts/${postId}/comments/`,
                {
                    headers: getHeaders(),
                }
            );

            setCommentLists((current) => ({
                ...current,
                [postId]: response.data,
            }));
        } catch {
            alert("Não foi possível carregar os comentários.");
        }
    }

    useEffect(() => {
        loadFeed();
    }, []);

    async function handleLike(post) {
        try {
            if (post.is_liked) {
                await api.delete(
                    `/interactions/posts/${post.id}/like/`,
                    {
                        headers: getHeaders(),
                    }
                );
            } else {
                await api.post(
                    `/interactions/posts/${post.id}/like/`,
                    {},
                    {
                        headers: getHeaders(),
                    }
                );
            }

            loadFeed();
        } catch (error) {
            alert(
                error.response?.data?.detail ||
                "Não foi possível alterar a curtida."
            );
        }
    }

    async function handleComment(postId) {
        const content = comments[postId];

        if (!content || !content.trim()) {
            return;
        }

        try {
            await api.post(
                `/interactions/posts/${postId}/comments/`,
                {
                    content,
                },
                {
                    headers: getHeaders(),
                }
            );

            setComments((current) => ({
                ...current,
                [postId]: "",
            }));

            await loadFeed();
            await loadComments(postId);
        } catch {
            alert("Não foi possível comentar.");
        }
    }

    return (
        <div className="page">
            <div className="container">
                <div className="card">
                    <h1>Feed</h1>

                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                        <button className="btn" onClick={() => navigate("/novo-post")}>
                            Novo post
                        </button>

                        <button className="btn btn-secondary" onClick={() => navigate("/perfil")}>
                            Meu perfil
                        </button>

                        <button className="btn btn-secondary" onClick={() => navigate("/usuarios")}>
                            Usuários
                        </button>

                        <button className="btn btn-secondary" onClick={() => navigate("/conexoes")}>
                            Conexões
                        </button>

                        <button className="btn btn-danger" onClick={handleLogout}>
                            Sair
                        </button>
                    </div>
                </div>

                {posts.map((post) => (
                    <div className="card" key={post.id}>
                        <h3>@{post.author}</h3>

                        <p>{post.content}</p>

                        <p>
                            Curtidas: {post.likes_count} · Comentários: {post.comments_count}
                        </p>

                        <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
                            <button
                                className="btn"
                                onClick={() => handleLike(post)}
                            >
                                {post.is_liked ? "Descurtir" : "Curtir"}
                            </button>

                            <button
                                className="btn btn-secondary"
                                onClick={() => loadComments(post.id)}
                            >
                                Ver comentários
                            </button>
                        </div>

                        <input
                            type="text"
                            placeholder="Escreva um comentário"
                            value={comments[post.id] || ""}
                            onChange={(event) =>
                                setComments((current) => ({
                                    ...current,
                                    [post.id]: event.target.value,
                                }))
                            }
                        />

                        <button
                            className="btn"
                            onClick={() => handleComment(post.id)}
                        >
                            Comentar
                        </button>

                        {commentLists[post.id] && (
                            <div style={{ marginTop: "16px" }}>
                                <h4>Comentários</h4>

                                {commentLists[post.id].map((comment) => (
                                    <p key={comment.id}>
                                        <strong>@{comment.user}</strong>{" "}
                                        {comment.content}
                                    </p>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Feed;