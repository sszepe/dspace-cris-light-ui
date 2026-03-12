import React from "react";
import type { LoginCredentials } from "../auth/client";
import "../styles/login.css";

type Props = {
  onLogin: (credentials: LoginCredentials) => Promise<void>;
};

export function LoginPage({ onLogin }: Props) {
  const [user, setUser]         = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError]       = React.useState<string | null>(null);
  const [loading, setLoading]   = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await onLogin({ user, password });
    } catch (err: any) {
      setError(err?.message ?? "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <div className="login-title">Sign in</div>
          <div className="login-subtitle">Use your DSpace CRIS account</div>
        </div>

        {error && (
            <div className="login-error" role="alert">
              {error}
            </div>
          )}

        <form onSubmit={handleSubmit} className="login-form" aria-label="login-form">
            <label className="login-label">
            Username
            <input
              className="login-input"
              type="text"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              autoComplete="username"
              placeholder="e.g. researcher"
              required
            />
          </label>

          <label className="login-label">
            Password
            <input
              className="login-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              placeholder="••••••••"
              required
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary" 
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}