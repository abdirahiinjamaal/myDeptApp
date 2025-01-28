import { Link } from "react-router-dom";
import { LoginForm } from "@/components/auth/LoginForm";

const Login = () => {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="space-y-2">
          <h2 className="auth-title">Welcome back</h2>
          <p className="auth-subtitle">
            Don't have an account?{" "}
            <Link to="/signup" className="auth-link">
              Sign up
            </Link>
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;