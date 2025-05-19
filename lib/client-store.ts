import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type CartItem = {
  name: string
  image: string
  id: number
  quantity: number
  price: number
  stock: number
}

export type CartState = {
  cart: CartItem[]
  checkoutProgress: "cart-page" | "payment-page" | "confirmation-page"
  setCheckoutProgress: (val: "cart-page" | "payment-page" | "confirmation-page") => void
  addToCart: (item: CartItem) => void
  removeFromCart: (item: CartItem) => void
  clearCart: () => void
  cartOpen: boolean
  setCartOpen: (val: boolean) => void
}

export const useCartStore = create<CartState>()(
    persist(
        (set) => ({
        cart: [],
        cartOpen: false,
        setCartOpen: (val) =>
            set((state) => {
              const updates: Partial<CartState> = { cartOpen: val };
              
              // reset checkoutProgress if closing cart from confirmation page
              if (!val && state.checkoutProgress === "confirmation-page") {
                updates.checkoutProgress = "cart-page";
              }
          
              return updates;
            }),
        clearCart: () => set({cart: []}),
        checkoutProgress: "cart-page",
        setCheckoutProgress: (val) => set((state) => ({ checkoutProgress: val })),
        addToCart: (item) =>
            set((state) => {
              const existingItem = state.cart.find((cartItem) => cartItem.id === item.id);
          
              if (existingItem) {
                const newQuantity = existingItem.quantity + item.quantity;
          
                // Prevent exceeding stock
                if (newQuantity > item.stock) {
                  return { cart: state.cart }; // no changes
                }
          
                const updatedCart = state.cart.map((cartItem) =>
                  cartItem.id === item.id
                    ? { ...cartItem, quantity: newQuantity }
                    : cartItem
                );
          
                return { cart: updatedCart };
              }
          
              // If new item, only add if quantity is not above stock
              if (item.quantity > item.stock) {
                return { cart: state.cart }; // no changes
              }
          
              return { cart: [...state.cart, { ...item }] };
            }),

        removeFromCart: (item) => 
        set((state) => {
            const updatedCart = state.cart.map((cartItem) => 
                cartItem.id === item.id
                ? {
                    ...cartItem,
                    quantity: cartItem.quantity - 1,
                    }
                : cartItem
            );
            return { cart: updatedCart.filter((item) => item.quantity > 0) }
        })
        }), { name: 'cart-storage' }
    )
)
