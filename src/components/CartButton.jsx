import { useCart } from '../context/CartContext';

function CartButton() {
  const { setCartOpen, getCartCount } = useCart();
  const cartCount = getCartCount();

  return (
    <button 
      onClick={() => setCartOpen(true)}
      className="relative p-2 text-white hover:text-pw-green-500 transition-colors"
      aria-label="Open cart"
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
      
      {cartCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-pw-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {cartCount}
        </span>
      )}
    </button>
  );
}

export default CartButton;