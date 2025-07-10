const API_URL = "https://pw-productions.onrender.com/api/printful";

// const API_URL = 'http://localhost:3001/api/printful';

class PrintfulApi {
  constructor(accessToken, client = "fire-conversation") {
    this.accessToken = accessToken;
    this.client = client;
  }

  async getStores() {
    try {
      const response = await fetch(`${API_URL}/stores`);

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error("Error fetching stores:", error);
      throw error;
    }
  }

  async getProducts(client = this.client) {
    try {
      const response = await fetch(`${API_URL}/products?client=${client}`);

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  }

  async getProductDetails(productId, client = this.client) {
    try {
      const response = await fetch(
        `${API_URL}/products/${productId}?client=${client}`
      );

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

  async createOrder(orderData, confirm = false, client = this.client) {
    try {
      const params = new URLSearchParams();
      if (confirm) params.append("confirm", "true");
      if (client) params.append("client", client);

      const url = `${API_URL}/orders${
        params.toString() ? "?" + params.toString() : ""
      }`;

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
