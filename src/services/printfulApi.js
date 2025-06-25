const API_URL = "https://pw-productions.onrender.com/api/printful";

// const API_URL = 'http://localhost:3001/api/printful';

class PrintfulApi {
  constructor(accessToken) {
    this.accessToken = accessToken;
  }

  async getProducts() {
    try {
      const response = await fetch(`${API_URL}/products`);

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  }

  async getProductDetails(productId) {
    try {
      const response = await fetch(`${API_URL}/products/${productId}`);

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error(`Error fetching product ${productId}:`, error);
      throw error;
    }
  }

  async createOrder(orderData, confirm = false) {
    try {
      const url = `${API_URL}/orders${confirm ? "?confirm=true" : ""}`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();

        // Extract the most specific error message available
        let errorMessage = "Unknown error";
        if (errorData.details?.result) {
          errorMessage = errorData.details.result;
        } else if (errorData.details?.error?.message) {
          errorMessage = errorData.details.error.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  }
}

export default PrintfulApi;
