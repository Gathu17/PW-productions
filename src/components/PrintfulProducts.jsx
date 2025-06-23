import { useState, useEffect } from 'react';
import PrintfulApi from '../services/printfulApi';
import { useCart } from '../context/CartContext';

function PrintfulProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [viewMode, setViewMode] = useState('catalog'); // 'catalog' or 'store'
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const printfulApi = new PrintfulApi();
        const productsData = await printfulApi.getProducts();
        console.log(productsData)
        setProducts(productsData);
        setLoading(false);
      } catch (err) {
        setError('Failed to load products. Please try again later.');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setSelectedVariant(null);
    setQuantity(1);
    
    
  };

  const closeProductDetails = () => {
    setSelectedProduct(null);
    setSelectedVariant(null);
    setQuantity(1);
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === 'catalog' ? 'store' : 'catalog');
    setSelectedProduct(null);
    setSelectedVariant(null);
    setQuantity(1);
  };
  
  const handleAddToCart = () => {
    if (selectedProduct) {
      addToCart(selectedProduct, quantity, selectedVariant);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-pulse-slow text-pw-green-500">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
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
            {selectedProduct.variants && selectedProduct.variants.length > 0 && (
              <div className="mt-4 grid grid-cols-4 gap-2">
                {selectedProduct.variants.slice(0, 8).map((variant) => (
                  <div 
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant)}
                    className={`cursor-pointer rounded-md overflow-hidden border-2 ${
                      selectedVariant?.id === variant.id 
                        ? 'border-pw-green-500' 
                        : 'border-transparent'
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
                        <span className="text-gray-500 text-xs">No image</span>
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
                <h2 className="text-2xl font-bold text-white mb-1">{selectedProduct.title}</h2>
                <p className="text-pw-green-500 mb-2">{selectedProduct.type_name}</p>
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
                ${selectedVariant?.retail_price || selectedProduct.retail_price || '0.00'}
              </span>
            </div>
            
            {/* Variant selector */}
            {selectedProduct.variants && selectedProduct.variants.length > 0 && (
              <div className="mt-6">
                <h3 className="text-white font-medium mb-2">Variants</h3>
                <div className="grid grid-cols-2 gap-2">
                  {selectedProduct.variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      className={`px-3 py-2 rounded text-sm ${
                        selectedVariant?.id === variant.id
                          ? 'bg-pw-green-500 text-white'
                          : 'bg-pw-black-900 text-gray-300 hover:bg-pw-black-700'
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
              <p className="whitespace-pre-line">{selectedProduct.description}</p>
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
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full text-center bg-transparent text-white border-0 focus:ring-0"
                />
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1 text-gray-400 hover:text-white"
                >
                  +
                </button>
              </div>
            </div>
            
            <div className="mt-6">
              <button 
                onClick={handleAddToCart}
                className="btn-primary w-full"
                disabled={!selectedProduct || (selectedProduct.variants?.length > 0 && !selectedVariant)}
              >
                Add to Cart
              </button>
            </div>
            
            <div className="mt-4">
              <button 
                onClick={closeProductDetails}
                className="text-red-500 hover:text-pw-green-400 flex items-center justify-center w-full"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
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
              {viewMode === 'catalog' 
                ? 'No catalog products found.' 
                : 'No store products found. You need to add products to your Printful store first.'}
            </p>
            {viewMode === 'store' && (
              <button 
                onClick={toggleViewMode}
                className="btn-primary"
              >
                Browse Catalog Instead
              </button>
            )}
          </div>
        ) : (
          products.map((product) => (
            <div key={product.id} className="bg-pw-black-800 rounded-lg overflow-hidden shadow-lg hover:shadow-pw-green-500/20 transition-all duration-300">
              <div className="relative h-48">
                {product.image ? (
                  <img 
                    src={product.image} 
                    alt={product.title} 
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
                  <h3 className="text-white font-bold text-lg">{product.title}</h3>
                </div>
                <p className="text-gray-400 text-sm mb-2">{product.type_name}</p>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-pw-green-500 font-medium">
                    {product.variant_count} variants
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
    </div>
  );
}

export default PrintfulProducts;


