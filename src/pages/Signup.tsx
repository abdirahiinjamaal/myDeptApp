import { Link } from "react-router-dom";
import { SignupForm } from "@/components/auth/SignupForm";

const Signup = () => {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="space-y-2">
          <h2 className="auth-title">Create your account</h2>
          <p className="auth-subtitle">
            Already have an account?{" "}
            <Link to="/login" className="auth-link">
              Login
            </Link>
          </p>
        </div>
        <SignupForm />
      </div>
    </div>
  );
};

export default Signup;