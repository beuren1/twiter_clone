import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";

function EditProfile() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [bio, setBio] = useState("");
    const [message, setMessage] = useState("");

    function getHeaders() {
        const token = localStorage.getItem("access");

        return {
            Authorization: `Bearer ${token}`,
        };
    }

    useEffect(() => {
        async function loadProfile() {
            try {
                const response = await api.get(
                    "/accounts/profile/",
                    {
                        headers: getHeaders(),
                    }
                );

                setName(response.data.name || "");
                setBio(response.data.bio || "");
            } catch {
                setMessage("Não foi possível carregar o perfil.");
            }
        }

        loadProfile();
    }, []);

    async function handleSubmit(event) {
        event.preventDefault();

        try {
            await api.patch(
                "/accounts/profile/",
                {
                    name,
                    bio,
                },
                {
                    headers: getHeaders(),
                }
            );

            setMessage("Perfil atualizado com sucesso.");
        } catch {
            setMessage("Não foi possível atualizar o perfil.");
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
                    <h1>Editar perfil</h1>

                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="Nome"
                            value={name}
                            onChange={(event) =>
                                setName(event.target.value)
                            }
                        />

                        <textarea
                            placeholder="Bio"
                            value={bio}
                            onChange={(event) =>
                                setBio(event.target.value)
                            }
                        />

                        <button
                            className="btn"
                            type="submit"
                        >
                            Salvar perfil
                        </button>
                    </form>

                    {message && (
                        <p style={{ marginTop: "12px" }}>
                            {message}
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

export default EditProfile;