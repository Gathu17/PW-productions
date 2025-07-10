import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Store from "../components/Store";
import CartButton from "../components/CartButton";
import Cart from "../components/Cart";

// Smooth scroll function
const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
};

// Mobile menu scroll function
const scrollToSectionMobile = (sectionId, setIsMobileMenuOpen) => {
  scrollToSection(sectionId);
  setIsMobileMenuOpen(false); // Close mobile menu after navigation
};

function StorePage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const clientParam = searchParams.get("client") || "fire-conversation";

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && !event.target.closest(".mobile-menu-container")) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isMobileMenuOpen]);

  return (
    <div
      className={`min-h-screen bg-black ${
        isLoaded ? "opacity-100" : "opacity-0"
      } transition-opacity duration-500`}
    >
      {/* Header Navigation */}
      <header className="relative bg-black border-b border-gray-800">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center mobile-menu-container">
          <div className="text-2xl font-bold text-white">
            <a href="/" className="hover:text-green-500 transition-colors">
              <span className="text-green-500">PW</span>Productions
            </a>
          </div>

          <nav className="hidden md:flex space-x-8">
            <a
              href="/"
              className="text-white hover:text-green-500 transition-colors no-underline"
            >
              Home
            </a>
            <a
              href="/#services"
              className="text-white hover:text-green-500 transition-colors no-underline"
            >
              Services
            </a>
            <a
              href="/#portfolio"
              className="text-white hover:text-green-500 transition-colors no-underline"
            >
              Portfolio
            </a>
            <a
              href="/#about"
              className="text-white hover:text-green-500 transition-colors no-underline"
            >
              About
            </a>
            <a
              href="/#contact"
              className="text-white hover:text-green-500 transition-colors no-underline"
            >
              Contact
            </a>
          </nav>

          <div className="flex items-center space-x-4">
            <CartButton />
            <button
              className="md:hidden text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    isMobileMenuOpen
                      ? "M6 18L18 6M6 6l12 12"
                      : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div
            className="md:hidden absolute top-full left-0 w-full bg-black/95 backdrop-blur-sm z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <nav className="flex flex-col space-y-4 p-6">
              <a
                href="/"
                className="text-white hover:text-green-500 transition-colors text-left"
              >
                Home
              </a>
              <a
                href="/#services"
                className="text-white hover:text-green-500 transition-colors text-left"
              >
                Services
              </a>
              <a
                href="/#portfolio"
                className="text-white hover:text-green-500 transition-colors text-left"
              >
                Portfolio
              </a>
              <a
                href="/#about"
                className="text-white hover:text-green-500 transition-colors text-left"
              >
                About
              </a>
              <a
                href="/#contact"
                className="text-white hover:text-green-500 transition-colors text-left"
              >
                Contact
              </a>
            </nav>
          </div>
        )}
      </header>

      {/* Store Section */}
      <Store initialClient={clientParam} />

      {/* Cart Component */}
      <Cart />
    </div>
  );
}

export default StorePage;
