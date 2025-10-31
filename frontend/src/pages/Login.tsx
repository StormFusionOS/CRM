import React, { useState } from "react";

export interface LoginProps {
  onLogin: (token: string) => Promise<void> | void;
  authenticate: (email: string, password: string) => Promise<string>;
}

const Login: React.FC<LoginProps> = ({ onLogin, authenticate }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const token = await authenticate(email, password);
      setError(null);
      await onLogin(token);
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
    <form onSubmit={handleSubmit} aria-label="login-form">
      <label>
        Email
        <input
          name="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </label>
      <label>
        Password
        <input
          name="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </label>
      <button type="submit">Log in</button>
      {error && <p role="alert">{error}</p>}
    </form>
  );
};

export default Login;
