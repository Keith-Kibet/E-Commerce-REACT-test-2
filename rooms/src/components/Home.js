import React, { useState, useRef, useEffect } from "react";
import { HomeIcon } from "@heroicons/react/outline";
import { useNavigate } from "react-router-dom";

import { NavLink } from "react-router-dom";
import Navigation from "./Navigation";
import { jwtDecode } from "jwt-decode";

import { ProgressSpinner } from "primereact/progressspinner";
import { Toast } from "primereact/toast";
import useApi from "../apis/UseApi";

import useCartItemApi from "../apis/useCartItemApi";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faEdit } from "@fortawesome/free-solid-svg-icons";
import EditProductModal from "./EditRoomsModal";
import useCartTotals from "./useCartTotals";

function Home() {
  const [isNavOpen, setIsNavOpen] = useState(false);

  const [activeLink, setActiveLink] = useState("Home");
  const [showCreateRoomModal, setShowCreateRoomModal] = useState(false); // State to control modal visibility
  const [imagePreview, setImagePreview] = useState(null); //  State for image preview URL
  const [roomTitle, setRoomTitle] = useState("");
  const [roomDescription, setRoomDescription] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [price, setPrice] = useState(""); // State for the price
  const [stock, setStock] = useState(""); // State for the stock
  const navigate = useNavigate();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [submittingStates, setSubmittingStates] = useState(new Map());


  const token = localStorage.getItem("token");

  const fetchCartTotals = useCartTotals();


  const { addItemToCart } = useCartItemApi(); // Use your custom hook
    const userId = localStorage.getItem("userId");

  const toast = useRef(null);
  const { createProduct, getAllProducts, deleteProduct } = useApi();

  const showToast = (severity, summary, detail) => {
    toast.current.show({ severity, summary, detail });
  };

  const handleProductUpdated = () => {
    toggleEditModal(); // Close the modal
    fetchProducts(); // Refresh the products list
  };

  const handleDeleteIconClick = (productId) => {
    setSelectedProductId(productId);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      if (!token) {
        navigate("/login");
        return;
      }

      await deleteProduct(selectedProductId, token);
      showToast("success", "Success", "Product deleted successfully.");
      setShowDeleteModal(false);
      setSelectedProductId(null);
      fetchProducts(); // Refresh the products list
    } catch (error) {
      // Check if the error is a 401 Unauthorized
      if (error.message === "401 Unauthorized") {
        navigate("/login");
      } else {
        showToast("error", "Error", error.message);
      }
      setShowDeleteModal(false);
      setSelectedProductId(null);
    }
  };

  const isWriter = () => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log(decoded);

        // Use the specific claim type URL to get the roles
        const rolesClaim =
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";
        const roles = decoded[rolesClaim];

        // Depending on whether the roles are a single string or an array, you might need to adjust this
        if (Array.isArray(roles)) {
          // If roles are an array, check if any of the roles is 'writer'
          return roles.some((role) => role.toLowerCase() === "writer");
        } else {
          // If roles is a single string, perform a direct comparison
          return roles.toLowerCase() === "writer";
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        return false;
      }
    }
    return false;
  };

  useEffect(() => {
    isWriter();
    fetchProducts();
    fetchCartTotals();
  }, []);

  //  Function to toggle 'Create Room' modal
  const toggleCreateRoomModal = () => {
    setShowCreateRoomModal(!showCreateRoomModal);
    setImagePreview(null);
  };

  const fetchProducts = async () => {
    try {
      if (!token) {
        navigate("/login");
      }
      const products = await getAllProducts(token);
      setRooms(products);
      // Handle the list of products
    } catch (error) {
      if (error.message === "401 Unauthorized") {
        navigate("/login");
        return;
      }
      console.error(error.message);
      showToast("error", "Error", error.message);

      // Handle errors
    }
  };

  // Function to handle 'Create Room' button click
  const handleCreateRoom = () => {
    // Logic to open modal goes here
    toggleCreateRoomModal();
  };

  const handleImageChange = (event) => {
    if (event.target.files[0]) {
      const imageFile = event.target.files[0];
      setSelectedImage(imageFile);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(imageFile);
    }
  };

  const validateImage = (image) => {
    if (!image) {
      return "Image file is required.";
    }

    const validTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!validTypes.includes(image.type)) {
      return "Invalid file type. Only JPG, PNG, JPEG are allowed.";
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (image.size > maxSize) {
      return "File size should not exceed 5MB.";
    }

    return null; // No errors
  };

  const handleEditIconClick = (product) => {
    setSelectedProduct(product);
    setShowEditModal(true);
  };

  const toggleEditModal = () => {
    setShowEditModal(!showEditModal);
    setSelectedProduct(null); // Clear selected product when closing the modal
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    if (!roomTitle || !roomDescription || !price || !stock || !selectedImage) {
      showToast("error", "Error", "All fields are required.");
      setIsSubmitting(false);
      return;
    }

    const imageError = validateImage(selectedImage);
    if (imageError) {
      showToast("error", "Error", imageError);
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append("ProductName", roomTitle);
    formData.append("ProductDescription", roomDescription);
    formData.append("Price", price);
    formData.append("UnitsAvailable", stock);
    formData.append("ImageFile", selectedImage);

    try {
      if (!token) {
        navigate("/login");
      }

      const productResponse = await createProduct(formData, token);
      showToast("success", "Success", "Product created successfully.");
      // Clear input fields and close the modal
      setRoomTitle("");
      setRoomDescription("");
      setPrice("");
      setStock("");
      setSelectedImage(null);
      setImagePreview(null);
      setShowCreateRoomModal(false);
      fetchProducts();
    } catch (error) {
      showToast("error", "Error", error.message);
      if (error.message === "401 Unauthorized") {
        navigate("/login");
        return;
      }
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleAddToCart = async (productId, unitPrice) => {
    setSubmittingStates(new Map(submittingStates).set(productId, true));

    try {
        const createCartDto = {
            UserId: userId,
            ProductId: productId,
            UnitPrice: unitPrice
        };

        await addItemToCart(createCartDto, token);
        await fetchCartTotals();

        showToast("success", "Success", "Item added to cart successfully.");
    } catch (error) {
        if (error.message === "401 Unauthorized") {
            navigate("/login");
        } else {
            showToast("error", "Error", error.message || "Failed to add item to cart.");
        }
    } finally {
        setSubmittingStates(new Map(submittingStates).set(productId, false));
    }
};


  

  return (
    <div className="relative bg-white h-screen">
      <div>
        {" "}
        <Toast ref={toast} position="top-center" />
        <Navigation activeLink={activeLink} setActiveLink={setActiveLink}  isWriter={isWriter}/>
        {isWriter() && (
          <button
            onClick={handleCreateRoom}
            className="fixed md:top-20 top-20 right-12 bg-blue-500 text-white py-2 px-4 rounded-md z-10"
          >
            Create Product
          </button>
        )}
        <div className="p-4 mt-12 md:mt-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {rooms.map((room) => (
              <div
                key={room.Id}
                className="bg-gray-100 rounded-lg shadow-md p-4 mb-4 hover:relative group"
              >
                {/* Conditional rendering of icons for writers */}
                {isWriter() && (
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100">
                    <FontAwesomeIcon
                      icon={faEdit}
                      className="mr-2 hover:text-blue-500 cursor-pointer"
                      onClick={() => handleEditIconClick(room)}
                    />
                    <FontAwesomeIcon
                      icon={faTrashAlt}
                      className="hover:text-red-500 cursor-pointer"
                      onClick={() => handleDeleteIconClick(room.Id)}
                    />
                  </div>
                )}

                <h3 className="text-lg font-bold">{room.ProductName}</h3>
                {room.ImageUrl ? (
                  <img
                    src={room.ImageUrl}
                    alt="Product Thumbnail"
                    className="w-full h-64 rounded-md my-2 object-cover"
                  />
                ) : (
                  <HomeIcon className="w-full h-64 text-gray-400 mx-auto" />
                )}
                <p className="break-words">{room.ProductDescription}</p>

                <div className="flex justify-between items-center mt-2">
                  <span>Price: ${room.Price.toFixed(2)}</span>

                  {isWriter() ? (
                    room.UnitsAvailable <= 20 ? (
                      <span className="flex items-center">
                        <span className="bg-red-500 text-white font-bold py-1 px-3 rounded-full border border-red-700 mr-2">
                          {room.UnitsAvailable}
                        </span>
                        Minimum Stock Reached
                      </span>
                    ) : (
                      <span>In Stock: {room.UnitsAvailable}</span>
                    )
                  ) : (
                    <span>In Stock: {room.UnitsAvailable}</span>
                  )}
                </div>

                 {/* Add to Cart Button */}
                 {!isWriter() && (
        <button
            className="w-4/5 bg-yellow-400 text-white py-2 mt-4 mx-auto block hover:scale-105 transform transition duration-300 rounded"
            onClick={() => handleAddToCart(room.Id, room.Price.toFixed(2))}
            disabled={submittingStates.get(room.Id)}
        >
            {submittingStates.get(room.Id) ? (
                <ProgressSpinner
                    style={{ width: "20px", height: "20px" }}
                    strokeWidth="8"
                    fill="var(--surface-ground)"
                    animationDuration=".5s"
                />
            ) : (
                "Add to Cart"
            )}
        </button>
    )}



              </div>
            ))}
          </div>
        </div>
        {/* Create Room Modal */}
        {showCreateRoomModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-5 rounded-lg shadow-lg w-3/4 md:w-1/2">
              <h2 className="text-lg font-bold mb-4">Create Product</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                {imagePreview && (
                  <div className="flex justify-center">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-32 h-32 rounded-md"
                    />
                  </div>
                )}
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  placeholder="Product Name"
                  value={roomTitle}
                  onChange={(e) => setRoomTitle(e.target.value)}
                  required
                />
                <textarea
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  placeholder="Description"
                  required
                  maxLength="100"
                  value={roomDescription}
                  onChange={(e) => setRoomDescription(e.target.value)}
                />

                {/* Price Input */}
                <input
                  type="number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  placeholder="Price (e.g., 19.99)"
                  step="0.01"
                  min="0"
                  pattern="^\d*(\.\d{0,2})?$"
                  value={price} // Replace with your state variable for price
                  onChange={(e) => setPrice(e.target.value)} // Replace with your state handler for price
                  required
                />

                {/* Stock Input */}
                <input
                  type="number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  placeholder="Number of Units in Stock"
                  min="0"
                  step="1"
                  value={stock} // Replace with your state variable for stock
                  onChange={(e) => setStock(e.target.value)} // Replace with your state handler for stock
                  required
                />

                <div className="flex items-center">
                  <label className="mr-2 text-gray-700 text-sm font-medium">
                    Add Product Thumbnail:
                  </label>
                  <input
                    type="file"
                    className="flex-1 text-sm text-gray-600"
                    accept="image/*"
                    onChange={handleImageChange}
                    required
                  />
                </div>
                <div className="flex justify-end mt-4">
                  <button
                    type="button"
                    className="bg-gray-500 text-white py-2 px-4 rounded mr-2"
                    onClick={toggleCreateRoomModal}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white py-2 px-4 rounded"
                  >
                    {isSubmitting ? (
                      <ProgressSpinner
                        style={{ width: "50px", height: "50px" }}
                        strokeWidth="8"
                        fill="var(--surface-ground)"
                        animationDuration=".5s"
                      />
                    ) : (
                      " Create"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-5 rounded-lg shadow-lg w-1/2 h-1/2 flex flex-col justify-center items-center">
              <h2 className="text-lg font-bold mb-4">
                Are you sure you want to delete this product?
              </h2>
              <div className="flex justify-center mt-4">
                <button
                  className="bg-red-500 text-white py-2 px-4 rounded mr-2"
                  onClick={handleDeleteConfirm}
                >
                  Yes, Delete
                </button>
                <button
                  className="bg-gray-500 text-white py-2 px-4 rounded"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Edit Product Modal */}
        {showEditModal && selectedProduct && (
          <EditProductModal
            toggleModal={toggleEditModal}
            id={selectedProduct.Id}
            onProductUpdated={handleProductUpdated} // Pass the callback
            initialProductName={selectedProduct.ProductName}
            initialProductDescription={selectedProduct.ProductDescription}
            initialPrice={selectedProduct.Price}
            initialStock={selectedProduct.UnitsAvailable}
            initialImage={selectedProduct.ImageUrl}
          />
        )}
      </div>
    </div>
  );
}

export default Home;
