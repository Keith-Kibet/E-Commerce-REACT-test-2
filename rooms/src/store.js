// store.js
import create from 'zustand';

const useStore = create(set => ({
  cartTotals: { totalItems: 0, totalCost: 0 },
  updateCartTotals: (totals) => set({ cartTotals: totals }),
  // You can add more state and actions as needed
}));

export default useStore;
