import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    async function handleSubmit(event) {
        event.preventDefault();

        try {
            const response = await api.post("/token/", {
                username,
                password,
            });

            localStorage.setItem("access", response.data.access);
            localStorage.setItem("refresh", response.data.refresh);

            navigate("/feed");
        } catch {
            setError("Usuário ou senha incorretos.");
        }
    }

    return (
        <div className="page">
            <div className="container">
                <div className="card" style={{ maxWidth: "420px", margin: "80px auto" }}>
                    <h1 style={{ textAlign: "center" }}>
                        Twitter Clone
                    </h1>

                    <h2 style={{ textAlign: "center" }}>
                        Entrar
                    </h2>

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
                            Entrar
                        </button>

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
                    </form>

                    <button
                        className="btn btn-secondary"
                        type="button"
                        style={{
                            width: "100%",
                            marginTop: "12px",
                        }}
                        onClick={() => navigate("/cadastro")}
                    >
                        Criar conta
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Login;