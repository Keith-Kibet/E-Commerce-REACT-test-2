import { useContext } from 'react';
import { useNavigate } from "react-router-dom";
import useCartItemApi from '../apis/useCartItemApi';




const useCartActions = (userId, token, setCartItems, setUpdatingItems,showToast) => {


    const navigate = useNavigate();

  const { getCartItemsByUserId, updateCartItemQuantity, updateCartItemQuantityDeduct, removeItemFromCart } = useCartItemApi();
  

  const handleApiError = (error) => {
    if (error.message === "401 Unauthorized") {
      navigate("/login");
    } else {
      console.error("API Error:", error.message);
      showToast("error", "Error", error.message);
    }
  };


  const updateCartItemInState = (updatedCartItem) => {
    console.log("New cart item received from SignalR:", updatedCartItem);

    setCartItems((prevItems) => {
      return prevItems.map((item) =>
        item.CartId === updatedCartItem.CartId ? updatedCartItem : item
      );
    });
  };


  
  const handleCartItemUpdate = (updatedCartItem) => {
    console.log("New cart item received from SignalR:", updatedCartItem);

    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) => item.CartId === updatedCartItem.CartId
      );
      if (existingIndex >= 0) {
        // Update existing item
        const updatedItems = [...prevItems];
        updatedItems[existingIndex] = updatedCartItem;
        return updatedItems;
      } else {
        // Add new item
        return [...prevItems, updatedCartItem];
      }
    });
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
        console.error("Error fetching cart items:", error.message);
        showToast("error", "Error", error.message);
      }
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
      updateCartItemInState(updatedCartItem);
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
      updateCartItemInState(updatedCartItem);
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
    } catch (error) {
      handleApiError(error);
    }
  };

  return { fetchCartItems, handleIncrementQuantity, handleDecrementQuantity, handleRemoveItem, handleCartItemUpdate, handleApiError, updateCartItemInState };
};

export default useCartActions;
