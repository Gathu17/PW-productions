import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./assets/main.css";
import HomePage from "./pages/HomePage";
import StorePage from "./pages/StorePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/store" element={<StorePage />} />
      </Routes>
    </Router>
  );
}

export default App;
