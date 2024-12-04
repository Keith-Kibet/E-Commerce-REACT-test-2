import React, { useState, useRef } from "react";
import "primereact/resources/themes/saga-blue/theme.css"; // theme
import "primereact/resources/primereact.min.css"; // core css
import "primeicons/primeicons.css"; // icons
import { Editor } from "primereact/editor";
import { ProgressSpinner } from "primereact/progressspinner";
import { Toast } from "primereact/toast";

function BillingAddress({ handleCloseModal }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [issueTitle, setIssueTitle] = useState("");
  const [titleError, setTitleError] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);
  const [fileUploadError, setFileUploadError] = useState("");

  const [lastPhase, setLastPhase] = useState(null);
  const [issueDescription, setIssueDescription] = useState("");

  const [titleErrorMessage, setTitleErrorMessage] = useState("");
  const [descriptionErrorMessage, setDescriptionErrorMessage] = useState("");
  const [priority, setPriority] = useState("");
  const [selectedPhase, setSelectedPhase] = useState("");
  const [selectedPhaseActivity, setSelectedPhaseActivity] = useState("");

  const toast = useRef(null);
  // Additional state for tracking validation errors

  const validateForm = () => {
    let isValid = true;

    if (!issueTitle.trim()) {
      setTitleError(true);
      setTitleErrorMessage("Issue title is required");
      isValid = false;
    } else {
      setTitleError(false);
      setTitleErrorMessage("");
    }

    if (!issueDescription.trim()) {
      setDescriptionError(true);
      setDescriptionErrorMessage("Issue description is required");
      isValid = false;
    } else {
      setDescriptionError(false);
      setDescriptionErrorMessage("");
    }

    return isValid;
  };

  const handleSubmit = () => {
    console.log("Handle Submit clicked");
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    // Check for validation errors
    if (titleError) {
      if (toast.current) {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: titleErrorMessage,
        });
      }
      setIsSubmitting(false);

      return; // Prevent form submission
    }

    if (descriptionError) {
      if (toast.current) {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: descriptionErrorMessage,
        });
      }
      setIsSubmitting(false);

      return; // Prevent form submission
    }

    // Call custom validation function
    if (!validateForm()) {
      if (toast.current) {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Please fill in all required fields.",
        });
      }
      setIsSubmitting(false);

      return; // Prevent form submission
    }

    try {
      await handleSubmit(event); // Wait for the handleSubmit process to complete
    } catch (error) {
      // Handle any errors that might occur during submission
      if (toast.current) {
        toast.current.show({
          severity: "error",
          summary: "Submission Error",
          detail: "An error occurred during issue submission.",
        });
      }
    } finally {
      setIsSubmitting(false); // Re-enable the submit button
      setTitleError(false);
      setDescriptionError(false);
      setTitleErrorMessage("");
      setDescriptionErrorMessage("");
    }
  };

  // Define a custom toolbar for the editor
  const headerTemplate = (
    <span className="ql-formats">
      <select className="ql-header" defaultValue="">
        <option value="1">Heading</option>
        <option value="2">Subheading</option>
        <option value="">Normal</option>
      </select>
    </span>
  );

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const validFileTypes = ["image/jpeg", "image/png", "image/jpg"];
    const maxFileSize = 5 * 1024 * 1024; // 5 MB

    const validFiles = files.filter(
      (file) => validFileTypes.includes(file.type) && file.size <= maxFileSize
    );

    if (validFiles.length > 4) {
      setFileUploadError("You can only upload up to 4 images.");
      return;
    }

    if (validFiles.length !== files.length) {
      setFileUploadError(
        "Only JPG, PNG, and JPEG files are allowed, and each must be less than 5MB."
      );
      return;
    }
  };

  const onTextChanged = (e) => {
    const htmlContent = e.htmlValue || ""; // Get HTML content from the editor
    const plainTextContent = htmlContent.replace(/<[^>]*>/g, ""); // Strip HTML tags to get plain text
    // Enforce max length of 50
    setIssueTitle(plainTextContent);
  };

  const onTextChangedDescription = (e) => {
    const htmlContent = e.htmlValue || ""; // Get HTML content from the editor
    const plainTextContent = htmlContent.replace(/<[^>]*>/g, ""); // Strip HTML tags to get plain text
    // Enforce max length of 50
    setIssueDescription(plainTextContent);
  };

  const onBlur = () => {
    if (issueTitle.length > 50) {
      setTitleError(true);
      setTitleErrorMessage("Issue title length cannot exceed 50 characters");
    } else {
      setTitleError(false);
      setTitleErrorMessage("");
    }
  };

  const onBlurDescription = () => {
    if (issueDescription.length > 500) {
      setDescriptionError(true);
      setDescriptionErrorMessage(
        "Issue description length cannot exceed 500 characters"
      );
      // existing toast code...
    } else {
      setDescriptionError(false);
      setDescriptionErrorMessage("");
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <Toast ref={toast} />

      <div className="bg-white rounded-lg shadow-lg w-4/5 h-4/5 md:w-3/4 lg:w-3/4 xl:w-3/4 overflow-auto mb-12">
        <div className="flex justify-between relative items-center border-b p-3">
          <span className="font-bold text-lg">Customer Address</span>

          {/* Close Icon Button */}
          <button
            onClick={handleCloseModal}
            className="absolute top-4 right-4 bg-black text-white p-2 rounded-full"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>
        <form onSubmit={handleFormSubmit} className="space-y-4 mt-4 px-5 mb-4">
          {/* Row for Phase and Module */}
          {/* First Name and Last Name */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                id="firstName"
                name="firstName"
                placeholder="First Name"
                required
                className="mt-1 block w-full shadow-sm  border-gray-300 rounded-md"
              />
            </div>
            <div>
              <input
                type="text"
                id="lastName"
                name="lastName"
                placeholder="Last Name"
                required
                className="mt-1 block w-full shadow-sm  border-gray-300 rounded-md"
              />
            </div>
          </div>

          {/* Phone Number and Additional Phone Number */}
          <div className="grid md:grid-cols-3 gap-4 items-end">
            <div className="md:col-span-1">
              <label className="block text-lg font-bold text-black">
                Prefix
              </label>
              <div className="mt-1 bg-gray-200 rounded-md px-2 py-1">+254</div>
            </div>
            <div className="md:col-span-1">
              <input
                type="number"
                id="phoneNumber"
                name="phoneNumber"
                placeholder="Phone Number"
                required
                className="mt-1 block w-full shadow-sm  border-gray-300 rounded-md"
              />
            </div>
            <div className="md:col-span-1">
              <input
                type="number"
                id="additionalPhoneNumber"
                name="additionalPhoneNumber"
                placeholder="Additional Phone Number"
                className="mt-1 block w-full shadow-sm  border-gray-300 rounded-md"
              />
            </div>
          </div>

          {/* Address Input */}
          <div>
            <input
              type="text"
              id="address"
              name="address"
              placeholder="Address"
              required
              className="mt-1 block w-11/12 shadow-sm  border-gray-300 rounded-md"
            />
          </div>

          {/* County and City Dropdowns */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
            <label htmlFor="city" className="block text-lg font-bold text-black">County</label>

              <select
                id="county"
                name="county"
                required
                className="mt-1 block w-full shadow-sm  border-gray-300 rounded-md"
                // onChange logic to update city dropdown based on selected county
              >
                {/* Options for counties */}
              </select>
            </div>
            <div>
            <label htmlFor="city" className="block text-lg font-bold text-black">City</label>

              <select
                id="city"
                name="city"
                required
                className="mt-1 block w-full shadow-sm  border-gray-300 rounded-md"
                // Options are dependent on the selected county
              >
                {/* Options for cities */}
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center mt-20 mb-2">
            {isSubmitting ? (
              <ProgressSpinner />
            ) : (
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white
rounded hover:bg-blue-700"
                disabled={isSubmitting} // Disable the button while submitting
              >
                Submit
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default BillingAddress;
