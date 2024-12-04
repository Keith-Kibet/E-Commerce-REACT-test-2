import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShoppingCartIcon,
  PlusIcon,
  MinusIcon,
  TrashIcon,
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

function Cart() {
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

  const handleApiError = (error) => {
    if (error.message === "401 Unauthorized") {
      navigate("/login");
    } else {
      console.error("API Error:", error.message);
      showToast("error", "Error", error.message);
    }
  };




  const handleIncrementQuantity = async (productId, currentQuantity) => {
    setUpdatingItems((prev) => ({ ...prev, [productId]: true }));

    try {
      const updatedCartItem = await updateCartItemQuantity(
        productId,
        userId,
        currentQuantity,
        token
      );
      await fetchCartItems(); // Refresh the cart items
      await fetchCartTotals();
    } catch (error) {
      handleApiError(error);
    } finally {
      setUpdatingItems((prev) => ({ ...prev, [productId]: false }));
    }
  };

  const handleDecrementQuantity = async (productId, currentQuantity) => {
    setUpdatingItems((prev) => ({ ...prev, [productId]: true }));

    try {
      const updatedCartItem = await updateCartItemQuantityDeduct(
        productId,
        userId,
        currentQuantity,
        token
      );
    
      await fetchCartItems(); // Refresh the cart items
      await fetchCartTotals();
    } catch (error) {
      handleApiError(error);
    } finally {
      setUpdatingItems((prev) => ({ ...prev, [productId]: false }));
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      await removeItemFromCart(productId, userId, token);
      await fetchCartItems(); // Refresh the cart items
      await fetchCartTotals();

    } catch (error) {
      handleApiError(error);
    }
  };

  const fetchCartItems = async () => {
    try {
      const items = await getCartItemsByUserId(userId, token);
      setCartItems(items);
    } catch (error) {
      if (error.message === "401 Unauthorized") {
        // Redirect to the login page if unauthorized
        navigate("/login");
      } else {
        setCartItems([]);

        console.error("Error fetching cart items:", error.message);
        // showToast("error", "Error", error.message);
      }
    }
  };

  const fetchCartTotals = async () => {
    try {
      const totals = await getCartTotals(userId, token);
      updateCartTotals({
        totalItems: totals.TotalItems,
        totalCost: totals.TotalCost,
      });
      console.log("Fetched Totals:", totals); // Debugging
    } catch (error) {
      console.error("Error fetching cart totals: ", error);
      // showToast("error", "Error", error.message);
    }
  };

  const onCartTotalsUpdate = (cartTotals) => {
    updateCartTotals({
      totalItems: cartTotals.TotalItems,
      totalCost: cartTotals.TotalCost,
    });
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };


  useEffect(() => {
    fetchCartItems();
    fetchCartTotals();

  }, []);

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
  }, []);

  useEffect(() => {
    return () => {
      setUpdatingItems({}); // Reset updating state when component unmounts
    };
  }, []);

  return (
    <div className="relative ">
      {" "}
      {/* Apply full height here */}
      <Toast ref={toast} position="top-center" />
      <Navigation
        activeLink={activeLink}
        setActiveLink={setActiveLink}
        isWriter={isWriter}
      />
      <div className="flex mt-4">
        <div className="flex-grow overflow-auto">
          {cartItems.length > 0 ? (
            <div className="mt-4 mb-6 p-4 shadow-lg bg-white">
              {cartItems.map((item, index) => (
                <div
                  key={item.CartId}
                  className={`flex items-start ${
                    index < cartItems.length - 1
                      ? "border-b border-gray-200 pb-4 mb-4"
                      : ""
                  }`}
                >
                  <div className="flex-shrink-0">
                    <img
                      src={item.ImageUrl}
                      alt={item.ProductName}
                      className="w-20 h-20 object-cover"
                    />
                    <TrashIcon
                      className="h-6 w-6 text-orange-500 mt-2 cursor-pointer"
                      onClick={() => handleRemoveItem(item.ProductId)}
                    />
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="font-bold">{item.ProductName}</h3>
                    <p className="text-sm text-gray-600 break-words">
                      {item.ProductDescription}
                    </p>
                  </div>
                  <div className="ml-4">
                    <span className="font-bold">${item.UnitPrice}</span>
                  </div>
                  <div className="flex items-center ml-4">
                    {updatingItems[item.ProductId] ? (
                      <ProgressSpinner /> // Show spinner when updating
                    ) : (
                      <>
                        <MinusIcon
                          className="h-6 w-6 text-orange-500 cursor-pointer"
                          onClick={() =>
                            handleDecrementQuantity(
                              item.ProductId,
                              item.Quantity
                            )
                          }
                        />
                        <span className="mx-2">{item.Quantity}</span>

                        <PlusIcon
                          className="h-6 w-6 text-orange-500 cursor-pointer"
                          onClick={() =>
                            handleIncrementQuantity(
                              item.ProductId,
                              item.Quantity
                            )
                          }
                        />
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center mt-4  ml-auto w-4/5 h-full">
              <ShoppingCartIcon className="h-20 w-20 text-gray-700" />
              <p className="text-lg font-bold mt-4">Your cart is empty</p>
              <button
                onClick={handleStartShopping}
                className="bg-blue-500 text-white py-2 px-4 rounded mt-4 uppercase"
              >
                START SHOPPING
              </button>
            </div>
          )}
        </div>

        {cartTotals.totalItems > 0 && cartTotals.totalCost > 0 && (
          <div className="bg-white shadow-md p-6 w-72 h-64 ml-4 mr-2">
            <h3 className="text-lg font-semibold mb-4">Cart Items</h3>
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
              onClick={handleCheckout}
              >
              CHECKOUT (KSH {cartTotals.totalCost})
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
export default Cart;