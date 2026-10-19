import { useEffect, useState } from "react";
import {
    useNavigate,
    useParams,
} from "react-router-dom";

import api from "../services/api";

function EditPost() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [content, setContent] = useState("");
    const [error, setError] = useState("");

    function getHeaders() {
        const token = localStorage.getItem("access");

        return {
            Authorization: `Bearer ${token}`,
        };
    }

    useEffect(() => {
        async function loadPost() {
            try {
                const response = await api.get(
                    `/posts/${id}/`,
                    {
                        headers: getHeaders(),
                    }
                );

                setContent(response.data.content);
            } catch {
                setError("Não foi possível carregar o post.");
            }
        }

        loadPost();
    }, [id]);

    async function handleSubmit(event) {
        event.preventDefault();

        try {
            await api.patch(
                `/posts/${id}/`,
                {
                    content,
                },
                {
                    headers: getHeaders(),
                }
            );

            navigate("/perfil");
        } catch {
            setError("Não foi possível editar o post.");
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
                    <h1>Editar post</h1>

                    <form onSubmit={handleSubmit}>
                        <textarea
                            maxLength="280"
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
                            Salvar alterações
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
                        onClick={() => navigate("/perfil")}
                    >
                        Voltar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default EditPost;