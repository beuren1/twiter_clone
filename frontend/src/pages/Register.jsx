import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";

function Register() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    async function handleSubmit(event) {
        event.preventDefault();

        try {
            await api.post("/accounts/register/", {
                username,
                email,
                password,
            });

            navigate("/");
        } catch (error) {
            if (error.response?.data) {
                setError("Não foi possível criar a conta.");
            } else {
                setError("Erro de conexão com o servidor.");
            }
        }
    }

    return (
        <div className="page">
            <div className="container">
                <div
                    className="card"
                    style={{
                        maxWidth: "420px",
                        margin: "60px auto",
                    }}
                >
                    <h1 style={{ textAlign: "center" }}>
                        Criar conta
                    </h1>

                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="Usuário"
                            value={username}
                            onChange={(event) =>
                                setUsername(event.target.value)
                            }
                        />

                        <input
                            type="email"
                            placeholder="E-mail"
                            value={email}
                            onChange={(event) =>
                                setEmail(event.target.value)
                            }
                        />

                        <input
                            type="password"
                            placeholder="Senha"
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                        />

                        <button
                            className="btn"
                            type="submit"
                            style={{ width: "100%" }}
                        >
                            Criar conta
                        </button>
                    </form>

                    {error && (
                        <p
                            style={{
                                marginTop: "12px",
                                textAlign: "center",
                                color: "#ef4444",
                            }}
                        >
                            {error}
                        </p>
                    )}

                    <button
                        className="btn btn-secondary"
                        type="button"
                        style={{
                            width: "100%",
                            marginTop: "12px",
                        }}
                        onClick={() => navigate("/")}
                    >
                        Já tenho uma conta
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Register;