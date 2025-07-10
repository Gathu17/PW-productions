import { useState, useEffect } from "react";
import PrintfulApi from "../services/printfulApi";
import { useCart } from "../context/CartContext";
import ClientStoreSelector from "./ClientStoreSelector";

function PrintfulProducts({ initialClient = "fire-conversation" }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productDetailsLoading, setProductDetailsLoading] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);
  const [viewMode, setViewMode] = useState("catalog"); // 'catalog' or 'store'
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [selectedClient, setSelectedClient] = useState(initialClient);
  const [currentStore, setCurrentStore] = useState(null);
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
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // 'success' or 'error'
  const [modalMessage, setModalMessage] = useState("");

  const { addToCart, setOnContinueShopping } = useCart();

  // Set up the continue shopping callback
  useEffect(() => {
    setOnContinueShopping(() => () => {
      // Close any open modals without triggering order success logic
      setShowModal(false);
      setModalType("");
      setModalMessage("");

      // Reset product selection state
      setSelectedProduct(null);
      setSelectedVariant(null);
      setQuantity(1);
      setShowOrderForm(false);

      // Reset order form
      setOrderForm({
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
    });
  }, [setOnContinueShopping]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const printfulApi = new PrintfulApi();
        const productsData = await printfulApi.getProducts(selectedClient);
        console.log("Products data:", productsData);

        // Extract products and store info from response
        if (productsData.result) {
          setProducts(productsData.result);
        } else {
          setProducts([]);
        }

        // Set current store info
        if (productsData.client) {
          setCurrentStore(productsData.client);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again later.");
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedClient]);

  const handleViewDetails = async (product) => {
    try {
      setProductDetailsLoading(true);
      setSelectedVariant(null);
      setQuantity(1);

      // Fetch detailed product information
      const printfulApi = new PrintfulApi();
      const detailedProductData = await printfulApi.getProductDetails(
        product.id,
        selectedClient
      );

      // Transform the API response to match the expected structure
      const transformedProduct = {
        id: detailedProductData.sync_product.id,
        title: detailedProductData.sync_product.name,
        image: detailedProductData.sync_product.thumbnail_url,
        type_name: product.type_name || "Custom Product",
        brand: product.brand || "",
        description: product.description || "Custom designed product",
        retail_price:
          detailedProductData.sync_variants[0]?.retail_price || "0.00",
        variant_count: detailedProductData.sync_variants.length,
        variants: detailedProductData.sync_variants.map((variant) => ({
          id: variant.id,
          name: `${variant.color} / ${variant.size}`,
          retail_price: variant.retail_price,
          image: variant.product.image,
          color: variant.color,
          size: variant.size,
          sku: variant.sku,
          availability_status: variant.availability_status,
        })),
      };

      setSelectedProduct(transformedProduct);
    } catch (err) {
      console.error("Error fetching product details:", err);
      setError("Failed to load product details. Please try again.");
    } finally {
      setProductDetailsLoading(false);
    }
  };

  const closeProductDetails = () => {
    setSelectedProduct(null);
    setSelectedVariant(null);
    setQuantity(1);
    setShowOrderForm(false);
    setError(null); // Clear any error when closing details
    // Reset order form
    setOrderForm({
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
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === "catalog" ? "store" : "catalog");
    setSelectedProduct(null);
    setSelectedVariant(null);
    setQuantity(1);
  };

  const handleShowOrderForm = () => {
    setShowOrderForm(true);
    console.log(showOrderForm);
  };

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
    if (!selectedProduct || !selectedVariant) {
      setError("Please select a product variant");
      return;
    }

    // Validate required fields
    const { recipient } = orderForm;
    if (
      !recipient.name ||
      !recipient.address1 ||
      !recipient.city ||
      !recipient.state_code ||
      !recipient.zip ||
      !recipient.phone ||
      !recipient.email
    ) {
      setError("Please fill in all required shipping information");
      return;
    }

    try {
      setOrderLoading(true);
      setError(null);

      const printfulApi = new PrintfulApi();

      // Prepare order data according to Printful API structure
      const orderData = {
        external_id: `order_${Date.now()}`, // Generate unique external ID
        shipping: orderForm.shipping,
        recipient: {
          name: recipient.name,
          company: recipient.company ? recipient.company : "",
          address1: recipient.address1,
          address2: recipient.address2 ? recipient.address2 : "",
          city: recipient.city,
          state_code: recipient.state_code.toUpperCase(),
          state_name: recipient.state_name,
          country_code: recipient.country_code,
          zip: recipient.zip,
          phone: recipient.phone,
          email: recipient.email,
          tax_number: recipient.tax_number,
        },
        items: [
          {
            sync_variant_id: selectedVariant.id,
            quantity: quantity,
            retail_price: selectedVariant.retail_price,
          },
        ],
      };

      // Create and confirm the order
      const order = await printfulApi.createOrder(
        orderData,
        true,
        selectedClient
      );

      // Show success modal
      alert(`Order placed successfully! Order ID: ${order.id}`);
      setModalType("success");
      setModalMessage(`Order placed successfully! Order ID: ${order.id}`);
      setShowModal(true);
      setShowOrderForm(false);
    } catch (err) {
      console.error("Error placing order:", err);

      // Show error modal with the detailed error message from API
      alert(err);
      setModalType("error");
      setModalMessage(err.message || "Failed to place order");
      setShowModal(true);
    } finally {
      setOrderLoading(false);
    }
  };

  const handleCloseModal = () => {
    const wasOrderSuccess =
      modalType === "success" &&
      modalMessage.includes("Order placed successfully");

    setShowModal(false);
    setModalType("");
    setModalMessage("");

    // Only reset everything if it was a successful order (not add to cart or continue shopping)
    if (wasOrderSuccess) {
      setSelectedProduct(null);
      setSelectedVariant(null);
      setQuantity(1);
      setOrderForm({
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
    }
    // For add to cart success or other modals, just close the modal but keep the product details open
  };

  const handleAddToCart = () => {
    if (selectedProduct && selectedVariant) {
      addToCart(selectedProduct, quantity, selectedVariant);

      // Show success message
      setModalType("success");
      setModalMessage(`Added ${quantity} ${selectedVariant.name} to cart!`);
      setShowModal(true);
    } else if (selectedProduct && selectedProduct.variants?.length === 0) {
      // Product has no variants
      addToCart(selectedProduct, quantity);

      // Show success message
      setModalType("success");
      setModalMessage(`Added ${quantity} ${selectedProduct.title} to cart!`);
      setShowModal(true);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-pulse-slow text-pw-green-500">
          <svg
            className="w-10 h-10"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg">
        {error}
      </div>
    );
  }

  // Show loader when fetching product details
  if (productDetailsLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-pulse-slow text-pw-green-500">
          <svg
            className="w-10 h-10"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </div>
        <span className="ml-3 text-white">Loading product details...</span>
      </div>
    );
  }

  // If a product is selected, show only the product details
  if (selectedProduct) {
    return (
      <div className="bg-pw-black-800 rounded-lg overflow-hidden shadow-lg">
        <div className="flex flex-col md:flex-row">
          {/* Product Image */}
          <div className="md:w-1/2 p-4">
            <div className="relative">
              <img
                src={selectedVariant?.image || selectedProduct.image}
                alt={selectedProduct.title}
                className="w-full h-auto rounded-lg"
              />
            </div>

            {/* Variant images if available */}
            {selectedProduct.variants &&
              selectedProduct.variants.length > 0 && (
                <div className="mt-4 grid grid-cols-4 gap-2">
                  {selectedProduct.variants.slice(0, 8).map((variant) => (
                    <div
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      className={`cursor-pointer rounded-md overflow-hidden border-2 ${
                        selectedVariant?.id === variant.id
                          ? "border-pw-green-500"
                          : "border-transparent"
                      }`}
                    >
                      {variant.image ? (
                        <img
                          src={variant.image}
                          alt={variant.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-12 bg-pw-black-900 flex items-center justify-center">
                          <span className="text-gray-500 text-xs">
                            No image
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
          </div>

          {/* Product Info */}
          <div className="md:w-1/2 p-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">
                  {selectedProduct.title}
                </h2>
                <p className="text-pw-green-500 mb-2">
                  {selectedProduct.type_name}
                </p>
              </div>
              {selectedProduct.brand && (
                <span className="bg-pw-black-900 text-white px-3 py-1 rounded-full text-sm">
                  {selectedProduct.brand}
                </span>
              )}
            </div>

            {/* Price */}
            <div className="mt-4">
              <span className="text-2xl font-bold text-white">
                $
                {selectedVariant?.retail_price ||
                  selectedProduct.retail_price ||
                  "0.00"}
              </span>
            </div>

            {/* Variant selector */}
            {selectedProduct.variants &&
              selectedProduct.variants.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-white font-medium mb-2">Variants</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedProduct.variants.map((variant) => (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedVariant(variant)}
                        className={`px-3 py-2 rounded text-sm ${
                          selectedVariant?.id === variant.id
                            ? "bg-pw-green-500 text-white"
                            : "bg-pw-black-900 text-gray-300 hover:bg-pw-black-700"
                        }`}
                      >
                        {variant.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

            <div className="mt-6 text-gray-300">
              <h3 className="text-white font-medium mb-2">Description</h3>
              <p className="whitespace-pre-line">
                {selectedProduct.description}
              </p>
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Product ID:</span>
                <span>{selectedProduct.id}</span>
              </div>
              {selectedProduct.model && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Model:</span>
                  <span>{selectedProduct.model}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-400">Variants:</span>
                <span>{selectedProduct.variant_count}</span>
              </div>
              {selectedVariant && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-400">SKU:</span>
                    <span>{selectedVariant.sku}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Availability:</span>
                    <span
                      className={`capitalize ${
                        selectedVariant.availability_status === "active"
                          ? "text-pw-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {selectedVariant.availability_status}
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Quantity selector */}
            <div className="mt-6">
              <h3 className="text-white font-medium mb-2">Quantity</h3>
              <div className="flex items-center border border-pw-black-700 rounded w-32">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1 text-gray-400 hover:text-white"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                  }
                  className="w-full text-center bg-transparent text-white border-0 focus:ring-0 pl-2"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1 text-gray-400 hover:text-white"
                >
                  +
                </button>
              </div>
            </div>

            {/* Order Instructions */}
            {selectedProduct?.variants?.length > 0 && !selectedVariant && (
              <div className="mt-6 p-3 bg-yellow-500/10 border border-yellow-500 rounded-lg">
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 text-yellow-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.232 15.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                  <p className="text-yellow-500 text-sm font-medium">
                    Please select a variant before placing your order
                  </p>
                </div>
              </div>
            )}

            <div className="mt-6 space-y-3">
              {!showOrderForm ? (
                <>
                  <button
                    onClick={handleAddToCart}
                    className="border border-pw-green-500 text-pw-green-500 hover:bg-pw-green-500/10 font-bold py-2 px-4 rounded transition-all duration-300 w-full disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={
                      !selectedProduct ||
                      (selectedProduct.variants?.length > 0 && !selectedVariant)
                    }
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={handleShowOrderForm}
                    className="bg-pw-green-500 hover:bg-pw-green-600 text-white font-bold py-2 px-4 rounded transition-all duration-300 w-full disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={
                      !selectedProduct ||
                      (selectedProduct.variants?.length > 0 && !selectedVariant)
                    }
                  >
                    Place Order
                  </button>
                </>
              ) : (
                <div className="space-y-4">
                  <h3 className="text-white font-medium">
                    Shipping Information
                  </h3>

                  <div className="grid grid-cols-1 gap-4">
                    <input
                      type="text"
                      placeholder="Full Name *"
                      value={orderForm.recipient.name}
                      onChange={(e) =>
                        handleOrderFormChange("recipient.name", e.target.value)
                      }
                      className="w-full px-3 py-2 bg-pw-black-900 border border-pw-black-700 rounded text-white placeholder-gray-400 focus:border-pw-green-500 focus:outline-none"
                      required
                    />

                    <input
                      type="text"
                      placeholder="Company (Optional)"
                      value={orderForm.recipient.company}
                      onChange={(e) =>
                        handleOrderFormChange(
                          "recipient.company",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 bg-pw-black-900 border border-pw-black-700 rounded text-white placeholder-gray-400 focus:border-pw-green-500 focus:outline-none"
                    />

                    <input
                      type="text"
                      placeholder="Address Line 1 *"
                      value={orderForm.recipient.address1}
                      onChange={(e) =>
                        handleOrderFormChange(
                          "recipient.address1",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 bg-pw-black-900 border border-pw-black-700 rounded text-white placeholder-gray-400 focus:border-pw-green-500 focus:outline-none"
                      required
                    />

                    <input
                      type="text"
                      placeholder="Address Line 2 (Optional)"
                      value={orderForm.recipient.address2}
                      onChange={(e) =>
                        handleOrderFormChange(
                          "recipient.address2",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 bg-pw-black-900 border border-pw-black-700 rounded text-white placeholder-gray-400 focus:border-pw-green-500 focus:outline-none"
                    />

                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="City *"
                        value={orderForm.recipient.city}
                        onChange={(e) =>
                          handleOrderFormChange(
                            "recipient.city",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 bg-pw-black-900 border border-pw-black-700 rounded text-white placeholder-gray-400 focus:border-pw-green-500 focus:outline-none"
                        required
                      />

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
                        className="w-full px-3 py-2 bg-pw-black-900 border border-pw-black-700 rounded text-white placeholder-gray-400 focus:border-pw-green-500 focus:outline-none"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="ZIP Code *"
                        value={orderForm.recipient.zip}
                        onChange={(e) =>
                          handleOrderFormChange("recipient.zip", e.target.value)
                        }
                        className="w-full px-3 py-2 bg-pw-black-900 border border-pw-black-700 rounded text-white placeholder-gray-400 focus:border-pw-green-500 focus:outline-none"
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
                        className="w-full px-3 py-2 bg-pw-black-900 border border-pw-black-700 rounded text-white focus:border-pw-green-500 focus:outline-none"
                      >
                        <option value="US" className="text-black bg-white">
                          United States
                        </option>
                        <option value="CA" className="text-black bg-white">
                          Canada
                        </option>
                        <option value="GB" className="text-black bg-white">
                          United Kingdom
                        </option>
                        <option value="AU" className="text-black bg-white">
                          Australia
                        </option>
                      </select>
                    </div>

                    <input
                      type="tel"
                      placeholder="Phone Number *"
                      value={orderForm.recipient.phone}
                      onChange={(e) =>
                        handleOrderFormChange("recipient.phone", e.target.value)
                      }
                      className="w-full px-3 py-2 bg-pw-black-900 border border-pw-black-700 rounded text-white placeholder-gray-400 focus:border-pw-green-500 focus:outline-none"
                      required
                    />

                    <input
                      type="email"
                      placeholder="Email Address *"
                      value={orderForm.recipient.email}
                      onChange={(e) =>
                        handleOrderFormChange("recipient.email", e.target.value)
                      }
                      className="w-full px-3 py-2 bg-pw-black-900 border border-pw-black-700 rounded text-white placeholder-gray-400 focus:border-pw-green-500 focus:outline-none"
                      required
                    />

                    <input
                      type="text"
                      placeholder="Tax Number (Optional)"
                      value={orderForm.recipient.tax_number}
                      onChange={(e) =>
                        handleOrderFormChange(
                          "recipient.tax_number",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 bg-pw-black-900 border border-pw-black-700 rounded text-white placeholder-gray-400 focus:border-pw-green-500 focus:outline-none"
                    />
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={handlePlaceOrder}
                      disabled={orderLoading}
                      className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {orderLoading ? "Placing Order..." : "Confirm Order"}
                    </button>

                    <button
                      onClick={() => setShowOrderForm(false)}
                      className="px-4 py-2 bg-pw-black-900 text-gray-300 rounded hover:bg-pw-black-700 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4">
              <button
                onClick={closeProductDetails}
                className="text-red-500 hover:text-pw-green-400 flex items-center justify-center w-full"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Otherwise, show the product grid with toggle option
  return (
    <div>
      {/* Client Store Selector */}
      {/* <ClientStoreSelector
        selectedClient={selectedClient}
        onClientChange={setSelectedClient}
      /> */}

      {/* Current Store Info */}
      {currentStore && (
        <div className="mb-6 p-4 bg-pw-green-500/10 border border-pw-green-500/20 rounded-lg">
          <h2 className="text-xl font-bold text-white mb-2">
            {currentStore.name}
          </h2>
          <p className="text-gray-300 text-sm">{currentStore.description}</p>
        </div>
      )}

      {/* <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-white">
          {viewMode === 'catalog' ? 'Printful Catalog' : 'My Store Products'}
        </h3>
        <button 
          onClick={toggleViewMode}
          className="bg-pw-black-900 text-white px-4 py-2 rounded-lg hover:bg-pw-black-800 transition-colors"
        >
          Switch to {viewMode === 'catalog' ? 'Store Products' : 'Catalog'}
        </button>
      </div> */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.length === 0 ? (
          <div className="col-span-full text-center py-10">
            <p className="text-gray-400 mb-4">
              {viewMode === "catalog"
                ? "No catalog products found."
                : "No store products found. You need to add products to your Printful store first."}
            </p>
            {viewMode === "store" && (
              <button onClick={toggleViewMode} className="btn-primary">
                Browse Catalog Instead
              </button>
            )}
          </div>
        ) : (
          products.map((product) => (
            <div
              key={product.id}
              className="bg-pw-black-800 rounded-lg overflow-hidden shadow-lg hover:shadow-pw-green-500/20 transition-all duration-300"
            >
              <div className="relative h-140 ">
                {product.thumbnail_url ? (
                  <img
                    src={product.thumbnail_url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-pw-black-900 flex items-center justify-center">
                    <span className="text-gray-500">No image</span>
                  </div>
                )}
                {product.brand && (
                  <div className="absolute top-2 right-2 bg-pw-green-500 text-white text-xs px-2 py-1 rounded">
                    {product.brand}
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-white font-bold text-lg">
                    {product.name}
                  </h3>
                </div>
                <p className="text-gray-400 text-sm mb-2">
                  {product.type_name}
                </p>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-pw-green-500 font-medium">
                    {product.variants} variants
                  </span>
                  {product.retail_price && (
                    <span className="text-white font-bold">
                      ${product.retail_price}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => handleViewDetails(product)}
                  className="btn-primary w-full"
                >
                  View Details
                </button>
              </div>
            </div>
          ))
        )}
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

export default PrintfulProducts;
