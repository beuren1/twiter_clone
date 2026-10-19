import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";

function CreatePost() {
    const navigate = useNavigate();
    const [content, setContent] = useState("");
    const [error, setError] = useState("");

    async function handleSubmit(event) {
        event.preventDefault();

        if (!content.trim()) {
            return;
        }

        try {
            const token = localStorage.getItem("access");

            await api.post(
                "/posts/",
                {
                    content,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            navigate("/feed");
        } catch {
            setError("Não foi possível criar o post.");
        }
    }

    return (
        <div className="page">
            <div className="container">
                <div
                    className="card"
                    style={{
                        maxWidth: "600px",
                        margin: "40px auto",
                    }}
                >
                    <h1>Novo post</h1>

                    <form onSubmit={handleSubmit}>
                        <textarea
                            maxLength="280"
                            placeholder="O que está acontecendo?"
                            value={content}
                            onChange={(event) =>
                                setContent(event.target.value)
                            }
                        />

                        <p>{content.length}/280</p>

                        <button
                            className="btn"
                            type="submit"
                        >
                            Publicar
                        </button>
                    </form>

                    {error && (
                        <p
                            style={{
                                color: "#ef4444",
                                marginTop: "12px",
                            }}
                        >
                            {error}
                        </p>
                    )}

                    <button
                        className="btn btn-secondary"
                        style={{ marginTop: "12px" }}
                        onClick={() => navigate("/feed")}
                    >
                        Voltar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CreatePost;