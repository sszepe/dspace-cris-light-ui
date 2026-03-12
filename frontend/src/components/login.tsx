import React, { useState } from "react";

export default function Login({
  onLogin,
}: {
  onLogin: (u: string, p: string) => Promise<void>;
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    try {
      await onLogin(username, password);
      window.location.hash = "#/dashboard";
    } catch (e: any) {
      setError(e.message || "Login failed");
    }
  }

  return (
    <div className="login-wrapper">
      <form className="login-box" onSubmit={submit}>
        <h2>DSpace Console</h2>

        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <div className="login-error">{error}</div>}

        <button type="submit">Sign in</button>
      </form>
    </div>
  );
}
