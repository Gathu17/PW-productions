import { createContext, useState, useContext, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [onContinueShopping, setOnContinueShopping] = useState(null);

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart from localStorage", e);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, quantity = 1, variant = null) => {
    setCart((prevCart) => {
      // Check if product is already in cart
      const existingItemIndex = prevCart.findIndex(
        (item) =>
          item.id === product.id &&
          (variant ? item.variant?.id === variant.id : !item.variant)
      );

      if (existingItemIndex >= 0) {
        // Update quantity if product already exists
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += quantity;
        return updatedCart;
      } else {
        // Add new product to cart
        return [
          ...prevCart,
          {
            ...product,
            quantity,
            variant,
            addedAt: new Date().toISOString(),
          },
        ];
      }
    });

    // Open cart when adding items
    setCartOpen(true);
  };

  const removeFromCart = (productId, variantId = null) => {
    setCart((prevCart) =>
      prevCart.filter(
        (item) =>
          !(
            item.id === productId &&
            (variantId ? item.variant?.id === variantId : !item.variant)
          )
      )
    );
  };

  const updateQuantity = (productId, quantity, variantId = null) => {
    if (quantity <= 0) {
      removeFromCart(productId, variantId);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId &&
        (variantId ? item.variant?.id === variantId : !item.variant)
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const price = item.variant?.retail_price || item.retail_price || 0;
      return total + price * item.quantity;
    }, 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const handleContinueShopping = () => {
    setCartOpen(false);
    if (onContinueShopping) {
      onContinueShopping();
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartOpen,
        setCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
        handleContinueShopping,
        setOnContinueShopping,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
