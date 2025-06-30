const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for your frontend
app.use(
  cors({
    origin: ["http://localhost:5173", "https://pw-productions.vercel.app", "https://khaki-porcupine-818847.hostingersite.com", "https://pwproductions.live"],
  })
);

app.use(express.json());

// Proxy endpoint for Printful API
app.get("/api/printful/products", async (req, res) => {
  try {
    const response = await axios.get(
      "https://api.printful.com/store/products",
      {
        headers: {
          Authorization: `Bearer ${process.env.PRINTFUL_TOKEN}`,
          "Content-Type": "application/json",
          "X-PF-Store-Id": 16236391,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Error proxying to Printful:", error.message);
    res.status(error.response?.status || 500).json({
      error: "Failed to fetch from Printful API",
      details: error.response?.data || error.message,
    });
  }
});

app.get("/api/printful/products/:id", async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.printful.com/store/products/${req.params.id}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PRINTFUL_TOKEN}`,
          "Content-Type": "application/json",
          "X-PF-Store-Id": 16236391,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Error proxying to Printful:", error.message);
    res.status(error.response?.status || 500).json({
      error: "Failed to fetch from Printful API",
      details: error.response?.data || error.message,
    });
  }
});

// Alternatively, you can use the catalog API which doesn't require a store ID
app.get("/api/printful/catalog", async (req, res) => {
  try {
    const response = await axios.get("https://api.printful.com/products", {
      headers: {
        Authorization: `Bearer ${process.env.PRINTFUL_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error("Error proxying to Printful:", error.message);
    res.status(error.response?.status || 500).json({
      error: "Failed to fetch from Printful API",
      details: error.response?.data || error.message,
    });
  }
});

app.get("/api/printful/catalog/:id", async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.printful.com/products/${req.params.id}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PRINTFUL_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Error proxying to Printful:", error.message);
    res.status(error.response?.status || 500).json({
      error: "Failed to fetch from Printful API",
      details: error.response?.data || error.message,
    });
  }
});

// Create order endpoint
app.post("/api/printful/orders", async (req, res) => {
  try {
    const { confirm } = req.query;
    const orderData = req.body;

    // Validate required fields
    if (
      !orderData.recipient ||
      !orderData.items ||
      !Array.isArray(orderData.items) ||
      orderData.items.length === 0
    ) {
      return res.status(400).json({
        error: "Invalid order data",
        details:
          "Order must include recipient information and at least one item",
      });
    }

    // Prepare the request URL with optional confirm parameter
    const url = `https://api.printful.com/orders`;

    console.log(
      "Creating order with data:",
      JSON.stringify(orderData, null, 2)
    );

    const response = await axios.post(url, orderData, {
      headers: {
        Authorization: `Bearer ${process.env.PRINTFUL_TOKEN}`,
        "Content-Type": "application/json",
        "X-PF-Store-Id": 16236391,
      },
    });

    console.log("Order created successfully:", response.data);
    res.json(response.data);
  } catch (error) {
    console.error("Error creating order:", error.message);
    console.error("Error details:", error.response?.data);

    res.status(error.response?.status || 500).json({
      error: "Failed to create order",
      details: error.response?.data || error.message,
    });
  }
});

// Get order details endpoint
app.get("/api/printful/orders/:id", async (req, res) => {
  try {
    const orderId = req.params.id;

    const response = await axios.get(
      `https://api.printful.com/orders/${orderId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PRINTFUL_TOKEN}`,
          "Content-Type": "application/json",
          "X-PF-Store-Id": 16236391,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching order:", error.message);
    res.status(error.response?.status || 500).json({
      error: "Failed to fetch order",
      details: error.response?.data || error.message,
    });
  }
});

// Get all orders endpoint
app.get("/api/printful/orders", async (req, res) => {
  try {
    const { status, limit, offset } = req.query;

    let url = "https://api.printful.com/orders";
    const params = new URLSearchParams();

    if (status) params.append("status", status);
    if (limit) params.append("limit", limit);
    if (offset) params.append("offset", offset);

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${process.env.PRINTFUL_TOKEN}`,
        "Content-Type": "application/json",
        "X-PF-Store-Id": 16236391,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching orders:", error.message);
    res.status(error.response?.status || 500).json({
      error: "Failed to fetch orders",
      details: error.response?.data || error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});
