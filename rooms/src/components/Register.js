import React, { useState, useRef } from "react";

import { useNavigate } from "react-router-dom";

import { ProgressSpinner } from "primereact/progressspinner";
import { Toast } from "primereact/toast";
import useApi from "../apis/UseApi";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toast = useRef(null);

  const navigate = useNavigate();
  const { register } = useApi();

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const showToast = (severity, summary, detail) => {
    toast.current.show({ severity, summary, detail });
  };

  const isValidEmail = (email) => {
    // Simple regex for basic email validation
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return re.test(email);
  };

  const isValidPassword = (password) => {
    // Password should have 1 uppercase, 1 lowercase, 1 digit, 1 symbol, and be at least 6 characters long
    const re =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    return re.test(password);
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    // TODO: Implement registration logic

    setIsSubmitting(true); // Start submitting

    if (!isValidEmail(email)) {
      console.error("Please enter a valid email address.");

      showToast("error", "Error", "Please enter a valid email address.");

      // Inform the user or show some error message
      setIsSubmitting(false); // Stop submitting

      return;
    }

    if (!isValidPassword(password)) {
      console.error(
        "Password must be at least 6 characters long, include uppercase and lowercase letters, a digit, and a symbol."
      );

      showToast(
        "error",
        "Error",
        "Password must be at least 6 characters long, include uppercase and lowercase letters, a digit, and a symbol."
      );

      // Display this message on the UI to inform the user
      setIsSubmitting(false); // Stop submitting

      return;
    }

    if (password !== confirmPassword) {
      console.error("Passwords do not match.");
      setIsSubmitting(false); // Stop submitting
      showToast("error", "Error", "Passwords do not match.");

      return;
    }

    try {
      const data = await register(email, password);

      console.log("User registered:", data.Message);

      showToast("success", "Success", data.Message);

      setTimeout(() => {
        navigate("/login");
      }, 2000); // 2000 milliseconds = 2 seconds

      // Optionally, navigate to a "Verify Email" page or inform the user to check their email
    } catch (error) {
      console.error("Error during registration:", error.message);
      showToast("error", "Error during registration:", error.message);
    }

    setIsSubmitting(false); // Stop submitting
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-400 to-blue-600">
      <Toast ref={toast} position="top-center" />

      <div className="bg-white rounded-lg shadow-lg p-8 text-center w-11/12 sm:w-3/4 md:w-1/2 lg:w-2/5">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">
          Create Account
        </h2>
        <form onSubmit={handleRegister} className="space-y-6">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-2">
              <i className="pi pi-envelope text-gray-400"></i>
            </span>
            <input
              className="pl-10 w-full p-2 border border-gray-300 rounded-md"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-2">
              <i className="pi pi-lock text-gray-400"></i>
            </span>
            <input
              className="pl-10 w-full p-2 border border-gray-300 rounded-md"
              type={isPasswordVisible ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="absolute inset-y-0 right-0 flex items-center pr-2 cursor-pointer"
              onClick={togglePasswordVisibility}
            >
              <i
                className={`pi ${
                  isPasswordVisible ? "pi-eye-slash" : "pi-eye"
                } text-gray-400`}
              ></i>
            </span>
          </div>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-2">
              <i className="pi pi-lock text-gray-400"></i>
            </span>
            <input
              className="pl-10 w-full p-2 border border-gray-300 rounded-md"
              type={isPasswordVisible ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <span
              className="absolute inset-y-0 right-0 flex items-center pr-2 cursor-pointer"
              onClick={togglePasswordVisibility}
            >
              <i
                className={`pi ${
                  isPasswordVisible ? "pi-eye-slash" : "pi-eye"
                } text-gray-400`}
              ></i>
            </span>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600"
          >
            {isSubmitting ? (
              <ProgressSpinner
                style={{ width: "50px", height: "50px" }}
                strokeWidth="8"
                fill="var(--surface-ground)"
                animationDuration=".5s"
              />
            ) : (
              "Register"
            )}
          </button>

          <div className="text-sm mt-4">
            <a
              href="#login"
              className="text-blue-600 hover:underline"
              onClick={() => navigate("/login")}
            >
              Already have an account? Log in
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
