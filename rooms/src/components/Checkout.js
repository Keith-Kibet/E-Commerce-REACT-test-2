import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShoppingCartIcon,
  PlusIcon,
  MinusIcon,
  TrashIcon,
  ArrowRightIcon,
} from "@heroicons/react/outline";

import {
  setupSignalRConnection,
  disconnectSignalRConnection,
} from "../apis/SignalIR";

import { NavLink } from "react-router-dom";
import Navigation from "./Navigation";
import { jwtDecode } from "jwt-decode";

import { ProgressSpinner } from "primereact/progressspinner";
import { Toast } from "primereact/toast";
import useApi from "../apis/UseApi";
import useCartItemApi from "../apis/useCartItemApi";
import useStore from "../store";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faEdit } from "@fortawesome/free-solid-svg-icons";
import EditProductModal from "./EditRoomsModal";
import BillingAddress from "./BillingAddress";

function Checkout() {
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

  const token = localStorage.getItem("token");
  const [isUpdating, setIsUpdating] = useState({});
  const [showBillingAddressModal, setShowBillingAddressModal] = useState(false);

  const { addItemToCart } = useCartItemApi(); // Use your custom hook
  const userId = localStorage.getItem("userId");
  const {
    getCartItemsByUserId,
    updateCartItemQuantity,
    updateCartItemQuantityDeduct,
    removeItemFromCart,
    getCartTotals,
  } = useCartItemApi();
  const [cartItems, setCartItems] = useState([]);
  const { cartTotals, updateCartTotals } = useStore();

  const [updatingItems, setUpdatingItems] = useState({});

  const toast = useRef(null);
  const { createProduct, getAllProducts, deleteProduct } = useApi();

  const showToast = (severity, summary, detail) => {
    if (toast.current) {
      toast.current.show({ severity, summary, detail });
    }
  };

  const handleStartShopping = () => {
    navigate("/");
  };

  const handleChangeClick = () => {
    console.log("Change clicked");
    setShowBillingAddressModal(true); // Show the BillingAddress modal

    // Logic for "Change" click
  };

  const handleCloseModal = () => {
    setShowBillingAddressModal(false); // Show the BillingAddress modal
  };

  const handleApiError = (error) => {
    if (error.message === "401 Unauthorized") {
      navigate("/login");
    } else {
      console.error("API Error:", error.message);
      showToast("error", "Error", error.message);
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
    if (isWriter()) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="relative">
      <Toast ref={toast} position="top-center" />
      <Navigation
        activeLink={activeLink}
        setActiveLink={setActiveLink}
        isWriter={isWriter}
      />
      <div className="flex flex-col mt-4 items-center">
        <div className="w-full flex justify-between items-start px-4">
          <div className="w-3/5 border-b pb-2">
            <div className="flex justify-between items-center">
              <span>Customer Address</span>
              <span
                className="text-blue-500 hover:underline cursor-pointer flex items-center"
                onClick={handleChangeClick}
              >
                Change <ArrowRightIcon className="ml-1 h-4 w-4" />
              </span>
            </div>
          </div>
          {cartTotals.totalItems > 0 && cartTotals.totalCost > 0 && (
            <div className="bg-white shadow-md p-6 w-72 h-64">
              <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
              {/* ... Order Summary contents ... */}
              <div className="flex justify-between mb-2">
                <span>Total Items:</span>
                <span>{cartTotals.totalItems}</span>
              </div>
              <div className="flex justify-between mb-6">
                <span>Total Amount:</span>
                <span>${cartTotals.totalCost}</span>
              </div>

              <button
                className="w-4/5 bg-orange-500 text-white py-2 rounded text-center mx-auto block"
                //   onClick={handleCheckout}
              >
                PROCEED TO PAYMENT
              </button>
            </div>
          )}
        </div>
      </div>

      {showBillingAddressModal && (
        <BillingAddress handleCloseModal={handleCloseModal} />
      )}
    </div>
  );
}
export default Checkout;
