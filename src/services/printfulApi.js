const API_URL = 'https://pw-productions.onrender.com/api/printful';

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
      console.error('Error fetching products:', error);
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
}

export default PrintfulApi;
