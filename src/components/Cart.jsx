import { useCart } from '../context/CartContext';

function Cart() {
  const { 
    cart, 
    cartOpen, 
    setCartOpen, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    getCartTotal 
  } = useCart();

  if (!cartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70" 
        onClick={() => setCartOpen(false)}
      ></div>
      
      {/* Cart panel */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-pw-black-800 shadow-xl transform transition-transform duration-300">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-pw-black-700 flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">Your Cart</h2>
            <button 
              onClick={() => setCartOpen(false)}
              className="text-gray-400 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Cart items */}
          <div className="flex-1 overflow-y-auto p-4">
            {cart.length === 0 ? (
              <div className="text-center py-10">
                <svg className="w-16 h-16 mx-auto text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <p className="text-gray-400">Your cart is empty</p>
                <button 
                  onClick={() => setCartOpen(false)}
                  className="mt-4 text-pw-green-500 hover:text-pw-green-400"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={`${item.id}-${item.variant?.id || 'default'}`} className="flex border-b border-pw-black-700 pb-4">
                    {/* Product image */}
                    <div className="w-20 h-20 flex-shrink-0 bg-pw-black-900 rounded overflow-hidden">
                      {item.image ? (
                        <img 
                          src={item.image} 
                          alt={item.title} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-gray-500 text-xs">No image</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Product details */}
                    <div className="ml-4 flex-1">
                      <div className="flex justify-between">
                        <h3 className="text-white font-medium">{item.title}</h3>
                        <button 
                          onClick={() => removeFromCart(item.id, item.variant?.id)}
                          className="text-gray-500 hover:text-red-500"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      
                      {item.variant && (
                        <p className="text-gray-400 text-sm">
                          {item.variant.name}
                        </p>
                      )}
                      
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center border border-pw-black-700 rounded">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1, item.variant?.id)}
                            className="px-2 py-1 text-gray-400 hover:text-white"
                          >
                            -
                          </button>
                          <span className="px-2 py-1 text-white">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1, item.variant?.id)}
                            className="px-2 py-1 text-gray-400 hover:text-white"
                          >
                            +
                          </button>
                        </div>
                        
                        <p className="text-pw-green-500 font-medium">
                          ${((item.variant?.retail_price || item.retail_price || 0) * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="text-right">
                  <button 
                    onClick={clearCart}
                    className="text-sm text-gray-400 hover:text-red-500"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Footer with total and checkout */}
          {cart.length > 0 && (
            <div className="p-4 border-t border-pw-black-700">
              <div className="flex justify-between mb-4">
                <span className="text-gray-300">Subtotal</span>
                <span className="text-white font-bold">${getCartTotal().toFixed(2)}</span>
              </div>
              
              <button 
                onClick={() => {
                  // Handle checkout logic
                  alert('Proceeding to checkout...');
                  // You would typically redirect to a checkout page here
                }}
                className="btn-primary w-full py-3"
              >
                Proceed to Checkout
              </button>
              
              <button 
                onClick={() => setCartOpen(false)}
                className="w-full text-center mt-2 text-gray-400 hover:text-white"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Cart;