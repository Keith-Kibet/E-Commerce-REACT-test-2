const useCartItemApi = () => {
    const baseUrl = 'https://localhost:7240/api/CreateCartItems';
  
    const addItemToCart = async (createCartDto, token) => {
        const response = await fetch(`${baseUrl}/AddItemToCart`, {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify(createCartDto), // Change here
        });
    
        if (!response.ok) {
            const errorData = await response.json();
            if (response.status === 401) {
                throw new Error("401 Unauthorized");
            } else if (response.status === 409) {
                throw new Error(errorData.message || "Item already exists in the cart.");
            } else {
                throw new Error(errorData.message || "Failed to add item to cart.");
            }
        }
    
        return await response.json();
    };


    const getCartItemsByUserId = async (userId, token) => {
        const response = await fetch(`${baseUrl}/GetCartItemsByUser/${userId}`, {
          method: 'GET',
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
    
        if (response.status === 401) {
          throw new Error("401 Unauthorized");
        }
    
        if (!response.ok) {
          let errorData;
          try {
            errorData = await response.json();
          } catch {
            throw new Error("An error occurred while fetching cart items");
          }
          throw new Error(errorData.message || "Failed to fetch cart items.");
        }
    
        return await response.json();
      };
  
    // Add other methods related to CartItems here
    // Inside your useApi hook or a similar service file
    const updateCartItemQuantity = async (productId, userId, newQuantity, token) => {
  const response = await fetch(`${baseUrl}/UpdateCartItemQuantity/${productId}/${userId}?newQuantity=${newQuantity}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
   //body: JSON.stringify({ connectionId })
  });

  if (response.status === 401) {
    throw new Error("401 Unauthorized");
  }


  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message);
  }

  return await response.json();
};


const updateCartItemQuantityDeduct = async (productId, userId, newQuantity, token) => {
  const response = await fetch(`${baseUrl}/DecreaseCartItemQuantity/${productId}/${userId}?newQuantity=${newQuantity}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    // body: JSON.stringify({ connectionId })
  });

  if (response.status === 401) {
    throw new Error("401 Unauthorized");
  }


  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message);
  }

  return await response.json();
};


const removeItemFromCart = async (productId, userId, token) => {
  const response = await fetch(`${baseUrl}/RemoveItemFromCart/${productId}/${userId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (response.status === 401) {
    throw new Error("401 Unauthorized");
  }


  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to remove item from cart.");
  }

  return await response.json();
};

const getCartTotals = async (userId, token) => {
  const response = await fetch(`${baseUrl}/GetCartItemsTotal/${userId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) {
    if (response.status === 401) {
        throw new Error("401 Unauthorized");
    }
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch cart totals.");
}

return await response.json();


};



  
    return { addItemToCart,getCartItemsByUserId , updateCartItemQuantity, updateCartItemQuantityDeduct,removeItemFromCart,getCartTotals };
  };
  
  export default useCartItemApi;
  