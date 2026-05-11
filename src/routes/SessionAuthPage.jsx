import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import Card from "../ui/Card";
import Input from "../ui/Input";
import { loginUser, signupUser } from "../services/auth.api";

function SessionAuthPage({ onAuthSuccess }) {
  const [mode, setMode] = useState("login");
  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData.entries());
    Object.keys(payload).forEach((key) => {
      payload[key] = payload[key].trim();
    });
    setBanner(null);
    setLoading(true);

    try {
      if (mode === "login") {
        const data = await loginUser(payload);
        const token =
          data?.token ||
          data?.accessToken ||
          data?.data?.token ||
          data?.data?.accessToken;
        const user = data?.user || data?.data?.user || data?.profile || null;

        if (!token || !user) {
          throw new Error("Invalid login response from server.");
        }

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        onAuthSuccess?.(user);

        setBanner({ variant: "success", text: "Login successful." });
        navigate("/", { replace: true });
      } else {
        await signupUser(payload);
        setBanner({
          variant: "success",
          text: "Account created successfully.",
        });
      }
    } catch (err) {
      setBanner({
        variant: "error",
        text:
          err.response?.data?.message ||
          err.message ||
          "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-layout">
      <section className="auth-copy">
        <span className="eyebrow">Access</span>
        <h2>Step into Etherframe</h2>
        <p className="muted-copy">
          Sign in or create an account to continue to your dashboard.
        </p>
        <blockquote>
          Upload work, review feedback, and manage content in one place.
        </blockquote>
      </section>

      <Card className="auth-card">
        <div className="auth-toggle">
          <button
            type="button"
            className={mode === "login" ? "toggle-tab active" : "toggle-tab"}
            onClick={() => setMode("login")}
          >
            Login
          </button>

          <button
            type="button"
            className={mode === "signup" ? "toggle-tab active" : "toggle-tab"}
            onClick={() => setMode("signup")}
          >
            Signup
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <Input
            label="Email"
            type="email"
            name="email"
            placeholder="Enter email"
          />

          <Input
            label="Password"
            type="password"
            name="password"
            placeholder="Enter password"
          />

          {mode === "signup" && (
            <>
              <Input
                label="Username"
                name="username"
                placeholder="Enter username"
              />
              <label className="field">
                <span className="field-label">Role</span>
                <select
                  name="role"
                  defaultValue="creator"
                  className="field-input field-select"
                >
                  <option value="creator">Creator</option>
                  <option value="consumer">Consumer</option>
                </select>
              </label>
            </>
          )}

          {banner ? (
            <p
              className={
                banner.variant === "error" ? "error-banner" : "success-banner"
              }
            >
              {banner.text}
            </p>
          ) : null}

          <Button type="submit" disabled={loading}>
            {loading
              ? "Please wait..."
              : mode === "login"
                ? "Login"
                : "Create account"}
          </Button>
        </form>
      </Card>
    </div>
  );
}

export default SessionAuthPage;
