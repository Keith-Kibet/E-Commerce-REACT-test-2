const useApi = () => {

    const baseUrl = 'https://localhost:7240/api'; 

    const login = async (email, password) => {
      const response = await fetch(`${baseUrl}/Auth/Login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Username: email, Password: password }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Invalid login credentials.");
      }
  
      return await response.json();
    };

    const register = async (email, password) => {
        const response = await fetch(`${baseUrl}/Auth/Register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ Username: email, Password: password }),
        });
    
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Registration failed.");
        }
    
        return await response.json();
      };

      const forgotPassword = async (email) => {
        const response = await fetch(`${baseUrl}/Auth/ForgotPassword`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ Email: email }),
        });
    
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to send reset link.");
        }
    
        return await response.json();
      };

      const resetPassword = async (email, token, newPassword) => {
        const response = await fetch(`${baseUrl}/Auth/ResetPassword`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ Email: email, Token: token, NewPassword: newPassword }),
        });
    
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Password reset failed.");
        }
    
        return await response.json();
      };

      const createProduct = async (formData, token) => {
        const response = await fetch(`${baseUrl}/Products`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
        });

        if (response.status === 401) {
          throw new Error("401 Unauthorized"); // Directly throw for 401 status
      }

      if (!response.ok) {
        let errorData;
        try {
            errorData = await response.json();
        } catch {
            throw new Error("An error occurred");
        }
        throw new Error(errorData.message || "Failed to create product.");
    }
        return await response.json();
    };

    
    const getAllProducts = async (token) => {
      const response = await fetch(`${baseUrl}/Products`, {
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
              throw new Error("An error occurred while fetching products");
          }
          throw new Error(errorData.message || "Failed to fetch products.");
      }

      return await response.json();
  };
    

  const deleteProduct = async (id, token) => {
    const response = await fetch(`${baseUrl}/Products/${id}`, {
        method: 'DELETE',
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
            throw new Error("An error occurred while deleting the product");
        }
        throw new Error(errorData.message || "Failed to delete the product.");
    }

    return await response.json();
};

const editProduct = async (id, formData, token) => {
  const response = await fetch(`${baseUrl}/Products/${id}`, {
    method: 'PUT',
    headers: { 
      'Authorization': `Bearer ${token}`
      // Note: Don't set 'Content-Type' for FormData
    },
    body: formData
  });

  if (response.status === 401) {
    throw new Error("401 Unauthorized");
  }

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      throw new Error("An error occurred while updating the product");
    }
    throw new Error(errorData.message || "Failed to update the product.");
  }

  return await response.json();
};
  
    return { login , register,forgotPassword, resetPassword, createProduct, getAllProducts,deleteProduct, editProduct };
  };
  
  export default useApi;
  