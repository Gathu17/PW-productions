const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for your frontend
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://pw-productions.vercel.app",
      "https://khaki-porcupine-818847.hostingersite.com",
      "https://pwproductions.live",
      "https://www.pwproductions.net",
    ],
  })
);

app.use(express.json());

// Client store configurations
const CLIENT_STORES = {
  "fire-conversation": {
    id: 16236391,
    name: "The Fire Conversation Podcast",
    description: "Official merchandise for The Fire Conversation Podcast",
  },
  "rob-duran": {
    id: null, // Add Rob Duran's store ID when available
    name: "Rob Duran Podcast",
    description: "Official merchandise for Rob Duran Podcast",
  },
  "sophisticated-savages": {
    id: null, // Add Sophisticated Savages store ID when available
    name: "Sophisticated Savages Podcast",
    description: "Official merchandise for Sophisticated Savages Podcast",
  },
  "pw-productions": {
    id: null, // Add PWProductions store ID when available
    name: "PWProductions",
    description: "Official PWProductions merchandise",
  },
};

// Get all available client stores
app.get("/api/printful/stores", async (req, res) => {
  try {
    const availableStores = Object.entries(CLIENT_STORES)
      .filter(([key, store]) => store.id !== null)
      .map(([key, store]) => ({
        key,
        ...store,
      }));

    res.json({
      code: 200,
      result: availableStores,
    });
  } catch (error) {
    console.error("Error fetching stores:", error.message);
    res.status(500).json({
      error: "Failed to fetch stores",
      details: error.message,
    });
  }
});

// Proxy endpoint for Printful API with client support
app.get("/api/printful/products", async (req, res) => {
  try {
    const { client } = req.query;
    const clientKey = client || "fire-conversation"; // Default to fire-conversation
    const clientStore = CLIENT_STORES[clientKey];

    if (!clientStore || !clientStore.id) {
      return res.status(400).json({
        error: "Invalid or unavailable client store",
        details: `Client '${clientKey}' not found or store not configured`,
        availableClients: Object.keys(CLIENT_STORES).filter(
          (key) => CLIENT_STORES[key].id !== null
        ),
      });
    }

    const response = await axios.get(
      "https://api.printful.com/store/products",
      {
        headers: {
          Authorization: `Bearer ${process.env.PRINTFUL_TOKEN}`,
          "Content-Type": "application/json",
          "X-PF-Store-Id": clientStore.id,
        },
      }
    );

    // Add client info to response
    const responseData = {
      ...response.data,
      result: response.data?.result?.slice(0,3),
      client: {
        key: clientKey,
        name: clientStore.name,
        description: clientStore.description,
      },
    };

    res.json(responseData);
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
    const { client } = req.query;
    const clientKey = client || "fire-conversation"; // Default to fire-conversation
    const clientStore = CLIENT_STORES[clientKey];

    if (!clientStore || !clientStore.id) {
      return res.status(400).json({
        error: "Invalid or unavailable client store",
        details: `Client '${clientKey}' not found or store not configured`,
        availableClients: Object.keys(CLIENT_STORES).filter(
          (key) => CLIENT_STORES[key].id !== null
        ),
      });
    }

    const response = await axios.get(
      `https://api.printful.com/store/products/${req.params.id}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PRINTFUL_TOKEN}`,
          "Content-Type": "application/json",
          "X-PF-Store-Id": clientStore.id,
        },
      }
    );

    // Add client info to response
    const responseData = {
      ...response.data,
      client: {
        key: clientKey,
        name: clientStore.name,
        description: clientStore.description,
      },
    };

    res.json(responseData);
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
    const { confirm, client } = req.query;
    const orderData = req.body;
    const clientKey = client || "fire-conversation"; // Default to fire-conversation
    const clientStore = CLIENT_STORES[clientKey];

    if (!clientStore || !clientStore.id) {
      return res.status(400).json({
        error: "Invalid or unavailable client store",
        details: `Client '${clientKey}' not found or store not configured`,
        availableClients: Object.keys(CLIENT_STORES).filter(
          (key) => CLIENT_STORES[key].id !== null
        ),
      });
    }

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
        "X-PF-Store-Id": clientStore.id,
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
    const { client } = req.query;
    const clientKey = client || "fire-conversation"; // Default to fire-conversation
    const clientStore = CLIENT_STORES[clientKey];

    if (!clientStore || !clientStore.id) {
      return res.status(400).json({
        error: "Invalid or unavailable client store",
        details: `Client '${clientKey}' not found or store not configured`,
        availableClients: Object.keys(CLIENT_STORES).filter(
          (key) => CLIENT_STORES[key].id !== null
        ),
      });
    }

    const response = await axios.get(
      `https://api.printful.com/orders/${orderId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PRINTFUL_TOKEN}`,
          "Content-Type": "application/json",
          "X-PF-Store-Id": clientStore.id,
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
    const { status, limit, offset, client } = req.query;
    const clientKey = client || "fire-conversation"; // Default to fire-conversation
    const clientStore = CLIENT_STORES[clientKey];

    if (!clientStore || !clientStore.id) {
      return res.status(400).json({
        error: "Invalid or unavailable client store",
        details: `Client '${clientKey}' not found or store not configured`,
        availableClients: Object.keys(CLIENT_STORES).filter(
          (key) => CLIENT_STORES[key].id !== null
        ),
      });
    }

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
        "X-PF-Store-Id": clientStore.id,
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
