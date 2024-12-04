import React, { useState , useRef } from 'react';
import { useNavigate , useSearchParams} from 'react-router-dom';
import useApi from '../apis/UseApi';
import { ProgressSpinner } from "primereact/progressspinner";
import { Toast } from "primereact/toast";

function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams(); // Hook to read the query parameters

  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useRef(null);
  const {resetPassword } = useApi();

  const showToast = (severity, summary, detail) => {
    toast.current.show({ severity, summary, detail });
  };

  const handleResetPassword =  async (event) => {
    event.preventDefault();
    setIsSubmitting(true); // Start submitting

    // TODO: Implement the password reset logic
    if (password !== confirmPassword) {
      console.log('Passwords do not match.');
      // Show error to the user
      setIsSubmitting(false); // Stop submitting
      showToast("error", "Passwords do not match.");


      return;
    }

    const email = searchParams.get('email'); // Get email from URL
    const token = searchParams.get('token'); // Get token from URL

    try {
      await resetPassword(email, token, password);
      console.log('Password reset successfully.');
      navigate('/login');
    } catch (error) {
      console.error('Error:', error.message);
      showToast("error", "Error during reset:", error.message);

      // Show error to the user
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
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Reset Password</h2>
        <form onSubmit={handleResetPassword} className="space-y-6">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-2">
              <i className="pi pi-lock text-gray-400"></i>
            </span>
            <input
              className="pl-10 w-full p-2 border border-gray-300 rounded-md"
              type={isPasswordVisible ? 'text' : 'password'}
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span className="absolute inset-y-0 right-0 flex items-center pr-2 cursor-pointer" onClick={togglePasswordVisibility}>
              <i className={`pi ${isPasswordVisible ? 'pi-eye-slash' : 'pi-eye'} text-gray-400`}></i>
            </span>
          </div>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-2">
              <i className="pi pi-lock text-gray-400"></i>
            </span>
            <input
              className="pl-10 w-full p-2 border border-gray-300 rounded-md"
              type={isPasswordVisible ? 'text' : 'password'}
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <span className="absolute inset-y-0 right-0 flex items-center pr-2 cursor-pointer" onClick={togglePasswordVisibility}>
              <i className={`pi ${isPasswordVisible ? 'pi-eye-slash' : 'pi-eye'} text-gray-400`}></i>
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
              " Reset Password"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
