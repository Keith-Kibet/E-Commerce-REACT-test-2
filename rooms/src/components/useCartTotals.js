// useCartTotals.js
import { useEffect, useRef } from 'react';
import useStore from '../store';
import useCartItemApi from '../apis/useCartItemApi';
import { Toast } from "primereact/toast";


const useCartTotals = () => {
    const updateCartTotals = useStore(state => state.updateCartTotals);
    const { getCartTotals } = useCartItemApi();
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    const toast = useRef(null);

    const showToast = (severity, summary, detail) => {
        if (toast.current) {
            toast.current.show({ severity, summary, detail });
        }
    };


    const fetchCartTotals = async () => {
        try {
            const totals = await getCartTotals(userId, token);
            updateCartTotals({
                totalItems: totals.TotalItems,
                totalCost: totals.TotalCost,
            });
        } catch (error) {
            console.error("Error fetching cart totals: ", error);
            // handle error (e.g., show toast notification)
            showToast("error", "Error", error.message);

        }
    };

    return fetchCartTotals; 
};

export default useCartTotals;
