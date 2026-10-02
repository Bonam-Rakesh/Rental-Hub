import { useState } from "react";
const API_URL = "http://localhost:5000";
function Register({ onRegisterSuccess, onLoginClick }) {
  const [form, setForm] = useState({
    username: "",
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
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      setMessage("Account created successfully!");

      setForm({
        username: "",
        email: "",
        password: ""
      });

      if (onRegisterSuccess) {
        setTimeout(() => {
          onRegisterSuccess();
        }, 800);
      }
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

          <p className="eyebrow">WELCOME TO RENTAL-HUB</p>

          <h1>
            Find a place
            <br />
            <span>that feels like home.</span>
          </h1>

          <p>
            Create your account and start discovering comfortable
            places to stay.
          </p>
        </div>
      </div>

      <div className="auth-form-area">
        <div className="auth-form-container">
          <button
            className="back-home"
            onClick={onRegisterSuccess}
          >
            ← Back to home
          </button>

          <div className="auth-heading">
            <p className="eyebrow">GET STARTED</p>
            <h2>Create your account</h2>
            <p>
              Join Rental-Hub and discover your next stay.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <label>
              Username
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Enter your username"
                required
              />
            </label>

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
                placeholder="Create a password"
                minLength="6"
                required
              />
            </label>

            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          {message && (
            <div className="auth-message">
              {message}
            </div>
          )}

          <p className="auth-switch">
            Already have an account?{" "}
            <button onClick={onLoginClick}>
              Log in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;