import { useState } from "react";

const API_URL = "http://localhost:5000";

function Login({ onLoginSuccess, onRegisterClick, onBackHome }) {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }
      localStorage.setItem("token", data.token);
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      setMessage("Login successful! 🎉");

      setTimeout(() => {
        if (onLoginSuccess) {
          onLoginSuccess();
        }
      }, 500);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-visual">
        <div className="auth-glow"></div>

        <div className="auth-visual-content">
          <div className="auth-logo-mark">R</div>

          <p className="eyebrow">WELCOME BACK</p>

          <h1>
            Your next
            <br />
            <span>stay awaits.</span>
          </h1>

          <p>
            Log in to manage your rentals, explore properties,
            and continue your Rental-Hub journey.
          </p>
        </div>
      </div>

      {}
      <div className="auth-form-area">
        <div className="auth-form-container">

          <button
            className="back-home"
            onClick={onBackHome}
          >
            ← Back to home
          </button>

          <div className="auth-heading">
            <p className="eyebrow">WELCOME BACK</p>

            <h2>Log in</h2>

            <p>
              Enter your details to continue to Rental-Hub.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">

            <label>
              Email

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
              />
            </label>

            <label>
              Password

              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
            </label>

            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Log in"}
            </button>
          </form>

          {message && (
            <div className="auth-message">
              {message}
            </div>
          )}

          <p className="auth-switch">
            Don't have an account?{" "}
            <button onClick={onRegisterClick}>
              Create one
            </button>
          </p>

        </div>
      </div>
    </div>
  );
}

export default Login;