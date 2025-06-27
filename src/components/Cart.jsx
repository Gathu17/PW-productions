import { useState } from "react";
import { useCart } from "../context/CartContext";
import PrintfulApi from "../services/printfulApi";

function Cart() {
  const {
    cart,
    cartOpen,
    setCartOpen,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    handleContinueShopping,
  } = useCart();

  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // 'success' or 'error'
  const [modalMessage, setModalMessage] = useState("");
  const [orderForm, setOrderForm] = useState({
    recipient: {
      name: "",
      company: "",
      address1: "",
      address2: "",
      city: "",
      state_code: "",
      state_name: "",
      country_code: "US",
      country_name: "United States",
      zip: "",
      phone: "",
      email: "",
      tax_number: "",
    },
    shipping: "STANDARD",
  });

  const handleOrderFormChange = (field, value) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");

      setOrderForm((prev) => {
        let updatedForm = {
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: value,
          },
        };

        // Auto-populate country_name when country_code changes
        if (field === "recipient.country_code") {
          const countryNames = {
            US: "United States",
            CA: "Canada",
            GB: "United Kingdom",
            AU: "Australia",
          };
          updatedForm[parent].country_name = countryNames[value] || "";
        }

        return updatedForm;
      });
    } else {
      setOrderForm((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handlePlaceOrder = async () => {
    // Validate required fields
    const { recipient } = orderForm;
    if (
      !recipient.name ||
      !recipient.address1 ||
      !recipient.city ||
      !recipient.state_code ||
      !recipient.state_name ||
      !recipient.zip ||
      !recipient.phone ||
      !recipient.email
    ) {
      setModalType("error");
      setModalMessage("Please fill in all required shipping information");
      setShowModal(true);
      return;
    }

    try {
      setOrderLoading(true);

      const printfulApi = new PrintfulApi();

      // Prepare order data for multiple items
      const orderData = {
        external_id: `cart_order_${Date.now()}`,
        shipping: orderForm.shipping,
        recipient: {
          name: recipient.name,
          company: recipient.company,
          address1: recipient.address1,
          address2: recipient.address2,
          city: recipient.city,
          state_code: recipient.state_code,
          state_name: recipient.state_name,
          country_code: recipient.country_code,
          country_name: recipient.country_name,
          zip: recipient.zip,
          phone: recipient.phone,
          email: recipient.email,
          tax_number: recipient.tax_number,
        },
        items: cart.map((item) => ({
          sync_variant_id: item.variant?.id,
          quantity: item.quantity,
          retail_price: item.variant?.retail_price || item.retail_price,
        })),
      };

      // Create and confirm the order
      const order = await printfulApi.createOrder(orderData, true);

      // Show success modal
      setModalType("success");
      setModalMessage(`Order placed successfully! Order ID: ${order.id}`);
      setShowModal(true);
      setShowCheckoutForm(false);

      // Clear cart after successful order
      clearCart();
    } catch (err) {
      console.error("Error placing order:", err);

      // Show error modal with the detailed error message from API
      setModalType("error");
      setModalMessage(err.message || "Failed to place order");
      setShowModal(true);
    } finally {
      setOrderLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalType("");
    setModalMessage("");

    // If it was a successful order, close the cart
    if (
      modalType === "success" &&
      modalMessage.includes("Order placed successfully")
    ) {
      setCartOpen(false);
    }
  };

  if (!cartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70"
        onClick={() => setCartOpen(false)}
      ></div>

      {/* Cart panel */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-black shadow-xl transform transition-transform duration-300">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-pw-black-700 flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">Your Cart</h2>
            <button
              onClick={() => setCartOpen(false)}
              className="text-gray-400 hover:text-white"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Cart items */}
          <div className="flex-1 overflow-y-auto p-4">
            {cart.length === 0 ? (
              <div className="text-center py-10">
                <svg
                  className="w-16 h-16 mx-auto text-gray-500 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                <p className="text-gray-400">Your cart is empty</p>
                <button
                  onClick={handleContinueShopping}
                  className="mt-4 text-pw-green-500 hover:text-pw-green-400"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div
                    key={`${item.id}-${item.variant?.id || "default"}`}
                    className="flex border-b border-pw-black-700 pb-4"
                  >
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
                          <span className="text-gray-500 text-xs">
                            No image
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Product details */}
                    <div className="ml-4 flex-1">
                      <div className="flex justify-between">
                        <h3 className="text-white font-medium">{item.title}</h3>
                        <button
                          onClick={() =>
                            removeFromCart(item.id, item.variant?.id)
                          }
                          className="text-gray-500 hover:text-red-500"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M6 18L18 6M6 6l12 12"
                            />
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
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                item.quantity - 1,
                                item.variant?.id
                              )
                            }
                            className="px-2 py-1 text-gray-400 hover:text-white"
                          >
                            -
                          </button>
                          <span className="px-2 py-1 text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                item.quantity + 1,
                                item.variant?.id
                              )
                            }
                            className="px-2 py-1 text-gray-400 hover:text-white"
                          >
                            +
                          </button>
                        </div>

                        <p className="text-pw-green-500 font-medium">
                          $
                          {(
                            (item.variant?.retail_price ||
                              item.retail_price ||
                              0) * item.quantity
                          ).toFixed(2)}
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
                <span className="text-white font-bold">
                  ${getCartTotal().toFixed(2)}
                </span>
              </div>

              {!showCheckoutForm ? (
                <button
                  onClick={() => setShowCheckoutForm(true)}
                  className="bg-pw-green-500 hover:bg-pw-green-600 text-white font-bold py-3 px-4 rounded transition-all duration-300 w-full"
                >
                  Proceed to Checkout
                </button>
              ) : (
                <div className="space-y-3">
                  <h3 className="text-white font-medium text-sm">
                    Shipping Information
                  </h3>

                  <div className="grid grid-cols-1 gap-2">
                    <input
                      type="text"
                      placeholder="Full Name *"
                      value={orderForm.recipient.name}
                      onChange={(e) =>
                        handleOrderFormChange("recipient.name", e.target.value)
                      }
                      className="w-full px-2 py-1 bg-pw-black-900 border border-pw-black-700 rounded text-white placeholder-gray-400 focus:border-pw-green-500 focus:outline-none text-xs"
                      required
                    />

                    <input
                      type="text"
                      placeholder="Address *"
                      value={orderForm.recipient.address1}
                      onChange={(e) =>
                        handleOrderFormChange(
                          "recipient.address1",
                          e.target.value
                        )
                      }
                      className="w-full px-2 py-1 bg-pw-black-900 border border-pw-black-700 rounded text-white placeholder-gray-400 focus:border-pw-green-500 focus:outline-none text-xs"
                      required
                    />

                    <input
                      type="text"
                      placeholder="City *"
                      value={orderForm.recipient.city}
                      onChange={(e) =>
                        handleOrderFormChange("recipient.city", e.target.value)
                      }
                      className="w-full px-2 py-1 bg-pw-black-900 border border-pw-black-700 rounded text-white placeholder-gray-400 focus:border-pw-green-500 focus:outline-none text-xs"
                      required
                    />

                    <div className="grid grid-cols-2 gap-1">
                      <input
                        type="text"
                        placeholder="State Code *"
                        value={orderForm.recipient.state_code}
                        onChange={(e) =>
                          handleOrderFormChange(
                            "recipient.state_code",
                            e.target.value
                          )
                        }
                        className="w-full px-2 py-1 bg-pw-black-900 border border-pw-black-700 rounded text-white placeholder-gray-400 focus:border-pw-green-500 focus:outline-none text-xs"
                        required
                      />

                      <input
                        type="text"
                        placeholder="State Name *"
                        value={orderForm.recipient.state_name}
                        onChange={(e) =>
                          handleOrderFormChange(
                            "recipient.state_name",
                            e.target.value
                          )
                        }
                        className="w-full px-2 py-1 bg-pw-black-900 border border-pw-black-700 rounded text-white placeholder-gray-400 focus:border-pw-green-500 focus:outline-none text-xs"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-1">
                      <input
                        type="text"
                        placeholder="ZIP *"
                        value={orderForm.recipient.zip}
                        onChange={(e) =>
                          handleOrderFormChange("recipient.zip", e.target.value)
                        }
                        className="w-full px-2 py-1 bg-pw-black-900 border border-pw-black-700 rounded text-white placeholder-gray-400 focus:border-pw-green-500 focus:outline-none text-xs"
                        required
                      />

                      <select
                        value={orderForm.recipient.country_code}
                        onChange={(e) =>
                          handleOrderFormChange(
                            "recipient.country_code",
                            e.target.value
                          )
                        }
                        className="w-full px-2 py-1 bg-pw-black-900 border border-pw-black-700 rounded text-white focus:border-pw-green-500 focus:outline-none text-xs"
                      >
                        <option value="US" className="text-black bg-white">
                          US
                        </option>
                        <option value="CA" className="text-black bg-white">
                          CA
                        </option>
                        <option value="GB" className="text-black bg-white">
                          GB
                        </option>
                        <option value="AU" className="text-black bg-white">
                          AU
                        </option>
                      </select>
                    </div>

                    <input
                      type="tel"
                      placeholder="Phone *"
                      value={orderForm.recipient.phone}
                      onChange={(e) =>
                        handleOrderFormChange("recipient.phone", e.target.value)
                      }
                      className="w-full px-2 py-1 bg-pw-black-900 border border-pw-black-700 rounded text-white placeholder-gray-400 focus:border-pw-green-500 focus:outline-none text-xs"
                      required
                    />

                    <input
                      type="email"
                      placeholder="Email *"
                      value={orderForm.recipient.email}
                      onChange={(e) =>
                        handleOrderFormChange("recipient.email", e.target.value)
                      }
                      className="w-full px-2 py-1 bg-pw-black-900 border border-pw-black-700 rounded text-white placeholder-gray-400 focus:border-pw-green-500 focus:outline-none text-xs"
                      required
                    />
                  </div>

                  <div className="flex space-x-1">
                    <button
                      onClick={handlePlaceOrder}
                      disabled={orderLoading}
                      className="bg-pw-green-500 hover:bg-pw-green-600 text-white font-bold py-2 px-2 rounded transition-all duration-300 flex-1 disabled:opacity-50 disabled:cursor-not-allowed text-xs"
                    >
                      {orderLoading ? "Placing..." : "Confirm"}
                    </button>

                    <button
                      onClick={() => setShowCheckoutForm(false)}
                      className="px-2 py-2 bg-pw-black-900 text-gray-300 rounded hover:bg-pw-black-700 transition-colors text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              <button
                onClick={handleContinueShopping}
                className="w-full text-center mt-2 text-gray-400 hover:text-white"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Order Status Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-pw-black-800 rounded-lg p-6 max-w-md w-full mx-4 border border-pw-black-700">
            <div className="flex items-center justify-between mb-4">
              <h3
                className={`text-xl font-bold ${
                  modalType === "success" ? "text-pw-green-500" : "text-red-500"
                }`}
              >
                {modalType === "success" ? "Order Successful!" : "Order Failed"}
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-white"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="mb-6">
              <div
                className={`flex items-center mb-3 ${
                  modalType === "success" ? "text-pw-green-500" : "text-red-500"
                }`}
              >
                {modalType === "success" ? (
                  <svg
                    className="w-8 h-8 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-8 h-8 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                )}
                <span className="text-lg font-medium">
                  {modalType === "success" ? "Success" : "Error"}
                </span>
              </div>

              <p className="text-gray-300 leading-relaxed">{modalMessage}</p>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCloseModal}
                className={`px-6 py-2 rounded font-medium transition-colors ${
                  modalType === "success"
                    ? "bg-pw-green-500 hover:bg-pw-green-600 text-white"
                    : "bg-red-500 hover:bg-red-600 text-white"
                }`}
              >
                {modalType === "success" ? "Continue Shopping" : "Try Again"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
