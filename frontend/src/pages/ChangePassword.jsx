import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";

function ChangePassword() {
    const navigate = useNavigate();

    const [currentPassword, setCurrentPassword] =
        useState("");

    const [newPassword, setNewPassword] =
        useState("");

    const [message, setMessage] = useState("");

    async function handleSubmit(event) {
        event.preventDefault();

        try {
            const token = localStorage.getItem("access");

            await api.patch(
                "/accounts/change-password/",
                {
                    current_password: currentPassword,
                    new_password: newPassword,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setMessage("Senha alterada com sucesso.");

            setCurrentPassword("");
            setNewPassword("");
        } catch (error) {
            setMessage(
                error.response?.data?.detail ||
                "Não foi possível alterar a senha."
            );
        }
    }

    return (
        <div className="page">
            <div className="container">
                <div
                    className="card"
                    style={{
                        maxWidth: "500px",
                        margin: "40px auto",
                    }}
                >
                    <h1>Alterar senha</h1>

                    <form onSubmit={handleSubmit}>
                        <input
                            type="password"
                            placeholder="Senha atual"
                            value={currentPassword}
                            onChange={(event) =>
                                setCurrentPassword(event.target.value)
                            }
                        />

                        <input
                            type="password"
                            placeholder="Nova senha"
                            value={newPassword}
                            onChange={(event) =>
                                setNewPassword(event.target.value)
                            }
                        />

                        <button
                            className="btn"
                            type="submit"
                        >
                            Alterar senha
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

export default ChangePassword;