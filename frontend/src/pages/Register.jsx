import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/auth";
import { useAuth } from "../utils/AuthProvider";

export default function Register() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        try {
            const data = await registerUser({ name, email, password });
            login(data.user);
            navigate("/");
        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <div className="max-w-md mx-auto mt-12 p-6 border rounded shadow">
            <h2 className="text-xl font-semibold mb-4">Register</h2>
            {error && <p className="text-red-600 mb-3">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    placeholder="Name"
                    className="w-full border px-3 py-2 rounded"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                />
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
                    className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
                >
                    Register
                </button>
            </form>
        </div>
    );
}
