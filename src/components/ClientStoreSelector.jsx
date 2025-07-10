import { useState, useEffect } from "react";
import PrintfulApi from "../services/printfulApi";

function ClientStoreSelector({ selectedClient, onClientChange }) {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        setLoading(true);
        const printfulApi = new PrintfulApi();
        const storesData = await printfulApi.getStores();
        setStores(storesData);
        setError(null);
      } catch (err) {
        console.error("Error fetching stores:", err);
        setError("Failed to load client stores");
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  if (loading) {
    return (
      <div className="mb-6 p-4 bg-pw-black-800 rounded-lg border border-pw-black-700">
        <div className="animate-pulse">
          <div className="h-4 bg-pw-black-700 rounded w-32 mb-2"></div>
          <div className="h-10 bg-pw-black-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
        <p className="text-red-400 text-sm">{error}</p>
      </div>
    );
  }

  if (stores.length === 0) {
    return (
      <div className="mb-6 p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
        <p className="text-yellow-400 text-sm">No client stores available</p>
      </div>
    );
  }

  return (
    <div className="mb-6 p-4 bg-pw-black-800 rounded-lg border border-pw-black-700">
      <label className="block text-white font-medium mb-2">
        Select Client Collection
      </label>
      <select
        value={selectedClient}
        onChange={(e) => onClientChange(e.target.value)}
        className="w-full px-3 py-2 bg-pw-black-900 border border-pw-black-600 rounded text-white focus:border-pw-green-500 focus:outline-none"
      >
        {stores.map((store) => (
          <option key={store.key} value={store.key} className="text-black bg-white">
            {store.name}
          </option>
        ))}
      </select>
      
      {/* Display current store info */}
      {stores.find(store => store.key === selectedClient) && (
        <div className="mt-3 p-3 bg-pw-green-500/10 border border-pw-green-500/20 rounded">
          <div className="flex items-center mb-2">
            <div className="w-2 h-2 bg-pw-green-500 rounded-full mr-2"></div>
            <span className="text-pw-green-400 font-medium">
              {stores.find(store => store.key === selectedClient)?.name}
            </span>
          </div>
          <p className="text-gray-300 text-sm">
            {stores.find(store => store.key === selectedClient)?.description}
          </p>
        </div>
      )}
    </div>
  );
}

export default ClientStoreSelector;
