import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth";
import { useAuth } from "../utils/AuthProvider";

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        try {
            const data = await loginUser({ email, password });
            login(data.user);
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Login failed");
        }
    }

    return (
        <div className="max-w-md mx-auto mt-12 p-6 border rounded shadow">
            <h2 className="text-xl font-semibold mb-4">Login</h2>
            {error && <p className="text-red-600 mb-3">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="email"
                    placeholder="Email"
                    className="w-full border px-3 py-2 rounded"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="w-full border px-3 py-2 rounded"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                />
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                    Login
                </button>
            </form>
        </div>
    );
}
