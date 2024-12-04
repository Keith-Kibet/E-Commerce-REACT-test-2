import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { ProgressSpinner } from "primereact/progressspinner";
import { Toast } from "primereact/toast";
import useApi from '../apis/UseApi';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useRef(null);
  const {login} = useApi();

  const showToast = (severity, summary, detail) => {
    toast.current.show({ severity, summary, detail });
  };


  const handleLogin = async (event) => {
    event.preventDefault();
    // TODO: Implement login logic
    setIsSubmitting(true); // Start submitting



    try {

      const data = await login(email,password);
      console.log('Logged in:', data);
      // Here you can store the received JWT token and user information as needed
      // For example, in local storage, context, or state management library
      localStorage.setItem('token', data.JwtToken);
      localStorage.setItem('userId', data.UserId);

      // Redirect to the home page or another page after successful login
      navigate('/'); // Adjust the path as per your route setup
    } catch (error) {
      console.error('Error during login:', error.message);
      showToast("error", "Error", error.message);
      // Handle login errors here (e.g., user not found, wrong password
         // You can also show an error message to the user
    }
    setIsSubmitting(false); // Stop submitting

  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-400 to-blue-600">
            <Toast ref={toast} position="top-center" />

      <div className="bg-white rounded-lg shadow-lg p-8 text-center w-11/12 sm:w-3/4 md:w-1/2 lg:w-2/5">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Welcome</h2>
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-2">
              <i className="pi pi-user text-gray-400"></i>
            </span>
            <input
              className="pl-10 w-full p-2 border border-gray-300 rounded-md"
              type="text"
              placeholder="Email Address"
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
            <span className="absolute inset-y-0 right-0 flex items-center pr-2 cursor-pointer" onClick={togglePasswordVisibility}>
              <i className={`pi ${isPasswordVisible ? "pi-eye-slash" : "pi-eye"} text-gray-400`}></i>
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
              "Login"
            )}
 
          </button>

          <div className="text-sm">
            <a href="#forgot" className="text-blue-600 hover:underline"  onClick={() => navigate('/forgotPassword')}>
              Forgot password?
            </a>
          </div>
        </form>
        <div className="text-sm mt-4">
          <a href="#signup" className="text-blue-600 hover:underline" onClick={() => navigate('/register')}>
            Sign up
          </a>
        </div>
      </div>
    </div>
  );
}

export default Login;
