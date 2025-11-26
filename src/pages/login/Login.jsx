import React, { useState, useEffect } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { setToken, getToken } from "../../utils/Auth";
import { toast } from "react-toastify";
import Button from "../../components/Button/Button";
import { EMAIL_REGEX } from "../../utils/regex";

export default function Login() {
  const navigate = useNavigate();

  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (getToken()) navigate("/dashboard");
  }, [navigate]);

  //  Custom validation on submit button
  const validateForm = () => {
    let tempErrors = {};

    // Email checks
    if (!values.email.trim()) {
      tempErrors.email = "Email is required";
    } else if (!EMAIL_REGEX.test(values.email)) {
      tempErrors.email = "Enter a valid email address";
    }

    // Password checks
    if (!values.password.trim()) {
      tempErrors.password = "Password is required";
    } else if (values.password.length < 6) {
      tempErrors.password = "Password must be at least 6 characters";
    }

    return tempErrors;
  };


  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSubmitting) return;
    setIsSubmitting(true);
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    setErrors({});

    //Mock data for Login
    const validEmail = "test@example.com";
    const validPassword = "123456";

    if (
      values.email.trim().toLowerCase() === validEmail &&
      values.password === validPassword
    ) {
      setToken("mockToken123");
      toast.success("Login successfully!");
      navigate("/dashboard");
    } else {
      toast.error("Invalid email or password");
    }

    setIsSubmitting(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <section className="login-left">
          <h1>Welcome back</h1>
        </section>

        <div className="login-form-right">
          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <div className="form-header">
              <h2>Login</h2>
            </div>

            <div className={`form-control ${errors.email ? "validate-error" : ""}`}>
              <label>Email address</label>
              <input
                name="email"
                type="email"
                placeholder="Enter email"
                value={values.email}
                onChange={handleChange}
                className="input-field"
              />
              {errors.email && (
                <span className="input-error">{errors.email}</span>
              )}
            </div>

            <div
              className={`form-control ${errors.password ? "validate-error" : ""
                }`}
            >
              <label>Password</label>
              <input
                name="password"
                type="password"
                placeholder="Enter password"
                value={values.password}
                onChange={handleChange}
                className="input-field"
              />
              {errors.password && (
                <span className="input-error">{errors.password}</span>
              )}
            </div>

            <div className="btn-wrapper">
              <Button
                text={isSubmitting ? "Authenticating..." : "Login"}
                type="primary"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
