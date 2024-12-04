import React, { useState, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { ProgressSpinner } from "primereact/progressspinner";
import { Toast } from "primereact/toast";
import useApi from '../apis/UseApi';

function ForgotPassword() {
  const [email, setEmail] = useState("");
  
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useRef(null);

  const {forgotPassword} = useApi();

  const isValidEmail = (email) => {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return re.test(email);
  };

  const showToast = (severity, summary, detail) => {
    toast.current.show({ severity, summary, detail });
  };

  const handleForgotPassword = async (event) => {
    event.preventDefault();

    setIsSubmitting(true); // Start submitting

    if (!isValidEmail(email)) {
      console.error("Invalid email format.");
      showToast("error", "Error", "Please enter a valid email address.");
      setIsSubmitting(false); // Stop submitting

      // Show an error message to the user
      return;
    }

    try {


      await forgotPassword(email);
            console.log("Password reset email sent.");

      showToast("success", "Success", "Password reset email has been sent.");
      // Show a confirmation message
      setTimeout(() => {
        navigate("/login");
      }, 5000);
    } catch (error) {
      console.error("Error:", error.message);
      // Handle other errors and show messages to the user
      showToast("error", "Error during reset:", error.message);
    }
    setIsSubmitting(false); // Stop submitting
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-400 to-blue-600">
      <Toast ref={toast} position="top-center" />

      <div className="bg-white rounded-lg shadow-lg p-8 text-center w-11/12 sm:w-3/4 md:w-1/2 lg:w-2/5">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">
          Reset Password
        </h2>
        <form onSubmit={handleForgotPassword} className="space-y-6">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-2">
              <i className="pi pi-envelope text-gray-400"></i>
            </span>
            <input
              className="pl-10 w-full p-2 border border-gray-300 rounded-md"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
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
              "Send Reset Link"
            )}
          </button>
          <div className="text-sm mt-4">
            <a
              href="#login"
              className="text-blue-600 hover:underline"
              onClick={() => navigate("/login")}
            >
              Back to Login
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
