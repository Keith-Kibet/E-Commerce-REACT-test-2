import React, { useState, useRef } from "react";
import { ProgressSpinner } from "primereact/progressspinner";
import { Toast } from "primereact/toast";
import { useNavigate } from "react-router-dom";

import Navigation from "./Navigation";
import { jwtDecode } from "jwt-decode";

import useApi from "../apis/UseApi";


const EditProductModal = ({
  toggleModal,
  onProductUpdated, 
  id,
  initialProductName,
  initialProductDescription,
  initialPrice,
  initialStock,
  initialImage
}) => {
  const [productName, setProductName] = useState(initialProductName);
  const [productDescription, setProductDescription] = useState(initialProductDescription);
  const [price, setPrice] = useState(initialPrice);
  const [stock, setStock] = useState(initialStock);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(initialImage);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const token = localStorage.getItem("token");


  const toast = useRef(null);

  const { editProduct } = useApi();
const navigate = useNavigate();


const showToast = (severity, summary, detail) => {
    toast.current.show({ severity, summary, detail });
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };



 
const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
  
    const formData = new FormData();
    formData.append("ProductName", productName);
    formData.append("ProductDescription", productDescription);
    formData.append("Price", price);
    formData.append("UnitsAvailable", stock);
    if (selectedImage) {
      formData.append("ImageFile", selectedImage);
    }
  
    try {
      if (!token) {
        navigate("/login");
        return;
      }
  
      await editProduct(id, formData, token);
      showToast("success", "Success", "Product updated successfully.");
      // Additional logic to refresh products list or close modal
      if (onProductUpdated) {
        onProductUpdated(); // Call the callback function
      }

    } catch (error) {
      if (error.message === "401 Unauthorized") {
        navigate("/login");
      } else {
        showToast("error", "Error", error.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <Toast ref={toast} position="top-center" />
      <div className="relative top-20 mx-auto p-5 border w-full max-w-lg shadow-lg rounded-md bg-white">
        <form onSubmit={handleSubmit} className="mt-2 px-4 pb-4">
          {/* Product Name */}
          {imagePreview && (
              <img
                src={imagePreview}
                alt="Product Preview"
                className="w-32 h-32 rounded-md"
                />
            )}
          <input
            type="text"
            placeholder="Product Name"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="mt-2 px-4 py-2 bg-gray-100 w-full rounded-md"
          />
          {/* Product Description */}
          <textarea
            placeholder="Product Description"
            value={productDescription}
            maxLength="100"

            onChange={(e) => setProductDescription(e.target.value)}
            className="mt-2 px-4 py-2 bg-gray-100 w-full rounded-md"
          />
          {/* Price Input */}
          <input
            type="number"
            placeholder="Price (e.g., 19.99)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="mt-2 px-4 py-2 bg-gray-100 w-full rounded-md"
            step="0.01"
             min="0"
             pattern="^\d*(\.\d{0,2})?$"

          />
          {/* Stock Input */}
          <input
            type="number"
            placeholder="Number of Units in Stock"
            value={stock}
            min="0"
            step="1"
            onChange={(e) => setStock(e.target.value)}
            className="mt-2 px-4 py-2 bg-gray-100 w-full rounded-md"
          />
          {/* Image Upload */}
         
          <div className="flex items-center">
                  <label className="mr-2 text-gray-700 text-sm font-medium">
                    Add Product Thumbnail:
                  </label>
                  <input
                    type="file"
                    className="flex-1 text-sm text-gray-600"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </div>

          {/* Buttons */}
          <div className="flex justify-end mt-4">
            <button
              type="button"
              onClick={toggleModal}
              className="bg-gray-500 text-white py-2 px-4 rounded mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded"
            >
              {isSubmitting ? <ProgressSpinner style={{ width: "50px", height: "50px" }} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" /> : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;
