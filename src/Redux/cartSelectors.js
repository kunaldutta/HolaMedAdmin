export const getTotalQuantity = (state) => {
  return state.cart.cartItems.reduce((total, item) => {
    return total + parseInt(item.quantity, 10); // Ensure quantity is treated as number
  }, 0);
};