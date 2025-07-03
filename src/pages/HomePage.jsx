import { useState, useEffect } from "react";
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

function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Portfolio projects array
  const projects = [
    {
      title: "Rob Duran Podcast",
      client: "Client Name",
      imageURL: "/files/rdp.png",
      link: "https://youtube.com/@robduranpodcast?si=auwTWRFRthDCuP5K",
    },
    {
      title: "Maverick Etching",
      client: "Client Name",
      imageURL: "/files/Maverick.png",
      link: null,
    },
    {
      title: "The FireConversation Podcast",
      client: "Client Name",
      imageURL: "/files/talkin.png",
      link: "https://youtube.com/@thefireconversationpodcast?si=_c21kNBa86kBeZhK",
    },
    {
      title: "Limitless Inspiration",
      client: "Client Name",
      imageURL: "/files/Inspiration.png",
      link: "https://www.instagram.com/limitless.motivation.24?igsh=MWx2azRvMHR1dHZwbA==",
    },
    {
      title: "Sophisticated Savages Podcast",
      client: "Client Name",
      imageURL: "/files/savages.png",
      link: "https://youtube.com/@sophisticatedsavagespodcast?si=vxkIG-DSvfyFepL5",
    },
    {
      title: "XO Eden Cosmetics",
      client: "Client Name",
      imageURL: "/files/XOEden.png",
      link: "https://www.instagram.com/xo_edencosmetics?igsh=dmo2MndlcWJkOHUx",
    },
  ];

  // Carousel services array
  const services = [
    {
      title: "Premium Video Editing",
      description:
        "Seamlessly blending timeline layouts, color grading, sound mixing, and motion graphics to create polished, refined video content.",
      imageURL: "",
    },
    {
      title: "Cinematic Storytelling",
      description:
        "Collaborating with ad agencies, businesses, and especially with content creators to produce content for social media, broadcast, web and print campaigns.",
      imageURL: "",
    },
    {
      title: "Monetize Your Brand Like Never Before!",
      description:
        "We transform your brand into a revenue-generating powerhouse through multiple platforms—custom apparel, accessories, exclusive artwork, and more.",
      imageURL: "",
    },
    {
      title: "Real Estate Videography & Photography",
      description:
        "Showcasing properties with high-quality visuals that engage and inspire, tailored for commercial, corporate, and advertising needs.",
      imageURL: "",
    },
  ];
  const [currentService, setCurrentService] = useState(0);
  const handlePrev = () =>
    setCurrentService((prev) => (prev === 0 ? services.length - 1 : prev - 1));
  const handleNext = () =>
    setCurrentService((prev) => (prev === services.length - 1 ? 0 : prev + 1));

  // Auto-scroll carousel every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentService((prev) =>
        prev === services.length - 1 ? 0 : prev + 1
      );
    }, 4000);
    return () => clearInterval(interval);
  }, [services.length]);

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
      className={`min-h-screen ${
        isLoaded ? "opacity-100" : "opacity-0"
      } transition-opacity duration-500`}
    >
      {/* Hero Section with Animation */}
      <header className="relative h-screen flex items-center px-4 overflow-hidden">
        <video
          autoPlay
          muted
          loop
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/files/hero.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-black-900/50"></div>

        <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-10 mobile-menu-container">
          <div className="text-2xl font-bold text-white">
            <span className="text-green-500">PW</span>Productions
          </div>
          <nav className="hidden md:flex space-x-8">
            <button
              onClick={() => scrollToSection("services")}
              className="text-white hover:text-green-500 transition-colors no-underline !bg-transparent border-none cursor-pointer"
            >
              Services
            </button>
            <button
              onClick={() => scrollToSection("portfolio")}
              className="text-white hover:text-green-500 transition-colors !bg-transparent border-none cursor-pointer"
            >
              Portfolio
            </button>
            <button
              onClick={() => scrollToSection("about")}
              className="text-white hover:text-green-500 transition-colors !bg-transparent border-none cursor-pointer"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="text-white hover:text-green-500 transition-colors !bg-transparent border-none cursor-pointer"
            >
              Contact
            </button>
            <a
              href="/store"
              className="m-auto text-white hover:text-green-500 hover:border  transition-colors !bg-transparent cursor-pointer"
            >
              Store
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
              <button
                onClick={() =>
                  scrollToSectionMobile("services", setIsMobileMenuOpen)
                }
                className="text-white hover:text-green-500 transition-colors text-left bg-transparent border-none cursor-pointer"
              >
                Services
              </button>
              <button
                onClick={() =>
                  scrollToSectionMobile("portfolio", setIsMobileMenuOpen)
                }
                className="text-white hover:text-green-500 transition-colors text-left bg-transparent border-none cursor-pointer"
              >
                Portfolio
              </button>
              <button
                onClick={() =>
                  scrollToSectionMobile("about", setIsMobileMenuOpen)
                }
                className="text-white hover:text-green-500 transition-colors text-left bg-transparent border-none cursor-pointer"
              >
                About
              </button>
              <button
                onClick={() =>
                  scrollToSectionMobile("contact", setIsMobileMenuOpen)
                }
                className="text-white hover:text-green-500 transition-colors text-left bg-transparent border-none cursor-pointer"
              >
                Contact
              </button>
              <a
                href="/store"
                className="text-white hover:text-green-500 transition-colors text-left"
              >
                Store
              </a>
            </nav>
          </div>
        )}

        <div className="container px-6 relative z-10 py-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm rounded-xl pointer-events-none"
            aria-hidden="true"
          ></div>
          <div className="relative animate-fade-in delay-300">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
              Bringing <span className="text-green-500">Stories</span> to Life
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl">
              Professional video editing and production services that transform
              your vision into compelling visual narratives.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => scrollToSection("portfolio")}
                className="bg-pw-green-500 hover:bg-pw-green-600 text-white font-bold py-2 px-4 rounded transition-all duration-300 animate-pulse-slow"
              >
                View Our Work
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="border border-green-500 text-green-500 hover:bg-green-500/10 font-bold py-2 px-4 rounded transition-all duration-300"
              >
                Get in Touch
              </button>
            </div>
          </div>
        </div>

        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden z-0">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-green-500/20 rounded-full blur-3xl animate-pulse-slow"
              style={{
                width: `${Math.random() * 30 + 10}vw`,
                height: `${Math.random() * 30 + 10}vw`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.5}s`,
                opacity: 0.1 + Math.random() * 0.2,
              }}
            />
          ))}
        </div>
      </header>

      {/* About Section */}
      <section id="about" className="py-20 bg-black-900">
        <div className="container mx-auto px-6">
          <h2 className="section-title text-white text-4xl font-bold mb-12 text-center">
            About PWProductions
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <p className="text-gray-300 text-lg leading-relaxed">
                At PW Productions, we're a small business with a big passion for
                helping brands—whether you're a first-time YouTuber, a growing
                entrepreneur, or an established company—monetize and showcase
                their vision.
              </p>
              <p className="text-gray-300 text-lg leading-relaxed">
                From bold branding to high-energy visuals, our cinematic
                approach ensures that every frame tells a compelling story. We
                blend technical expertise with artistic creativity to create
                stunning visuals for advertising, social media, e-commerce, and
                more. Whether it's a merch drop, a product launch, or a
                full-scale digital campaign, we bring your brand to life in ways
                that captivate and empower.
              </p>
              <div className="grid grid-cols-2 gap-6 mt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-500 mb-2">
                    50+
                  </div>
                  <div className="text-gray-400">Projects Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-500 mb-2">
                    5+
                  </div>
                  <div className="text-gray-400">Years Experience</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-video bg-gradient-to-br from-green-500/20 to-black-800 rounded-lg overflow-hidden">
                <img
                  src="/files/about-image.jpg"
                  alt="PWProductions Team"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
                <div
                  className="w-full h-full bg-gradient-to-br from-green-500/20 to-black-800 flex items-center justify-center"
                  style={{ display: "none" }}
                >
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="w-8 h-8 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <p className="text-gray-400">
                      Professional Video Production
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="bg-black">
        <div
          className="relative bg-black py-0"
          style={{
            backgroundImage: "url('/files/wall.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundAttachment: "fixed",
          }}
        >
          <div className="w-screen px-8 py-20 bg-black/30 rounded-lg">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-white text-4xl font-bold mb-8 text-center section-title animate-slide-up">
                Our Services
              </h2>
              <div className="relative flex items-center justify-center">
                {/* Left Arrow */}
                <button
                  onClick={handlePrev}
                  className="absolute left-0 z-20 p-2 bg-black/50 rounded-full hover:bg-green-500/80 transition-colors text-white"
                  aria-label="Previous Service"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                {/* Service Slide */}
                <div className="w-full h-80 md:h-96 rounded-lg flex flex-col items-center justify-center relative overflow-hidden shadow-lg">
                  <div className="absolute inset-0 bg-black/70"></div>
                  <div className="relative z-10 p-8 text-center">
                    <h3 className="text-3xl md:text-4xl font-extrabold uppercase tracking-widest text-white mb-4 drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)] font-sans">
                      {services[currentService].title}
                    </h3>
                    <p className="text-lg md:text-xl text-gray-100 font-light italic tracking-wide drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)] font-sans">
                      {services[currentService].description}
                    </p>
                  </div>
                </div>
                {/* Right Arrow */}
                <button
                  onClick={handleNext}
                  className="absolute right-0 z-20 p-2 bg-black/50 rounded-full hover:bg-green-500/80 transition-colors text-white"
                  aria-label="Next Service"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
              {/* Dots for navigation */}
              <div className="flex justify-center mt-4 space-x-2">
                {services.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentService(idx)}
                    className={`w-3 h-3 rounded-full ${
                      idx === currentService ? "bg-green-500" : "bg-gray-500/50"
                    }`}
                    aria-label={`Go to service ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Preview */}
      <section id="portfolio" className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="section-title text-white text-4xl font-bold mb-4 text-center">
            Featured Work
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, i) => {
              const ProjectCard = ({ children }) => {
                if (project.link) {
                  return (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      {children}
                    </a>
                  );
                }
                return <div>{children}</div>;
              };

              return (
                <ProjectCard key={i}>
                  <div
                    className="group relative overflow-hidden rounded-lg aspect-video bg-black cursor-pointer hover:scale-105 transition-transform duration-300"
                    style={{
                      backgroundImage: `url(${project.imageURL})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black-900 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                    <div className="absolute bottom-0 left-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20">
                      <h3 className="text-white font-bold">{project.title}</h3>
                      {/* <p className="text-green-500">{project.client}</p> */}
                      {project.link && (
                        <div className="flex items-center mt-2 text-green-400 text-sm">
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                          Visit{" "}
                          {project.link.includes("youtube")
                            ? "YouTube"
                            : "Instagram"}
                        </div>
                      )}
                    </div>
                  </div>
                </ProjectCard>
              );
            })}
          </div>

          {/* Store CTA Section */}
          <div className="mt-16 bg-gradient-to-r from-pw-green-500/10 to-pw-green-600/10 rounded-2xl p-8 border border-pw-green-500/20">
            <div className="text-center">
              <h3 className="text-3xl font-bold text-white mb-4">
                Ready to Rock Your Brand?
              </h3>
              <p className="text-gray-300 text-lg mb-6 max-w-2xl mx-auto">
                Transform your vision into reality with our exclusive
                merchandise collection. From custom apparel to branded
                accessories - we've got everything you need to make your mark!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a
                  href="/store"
                  className="bg-pw-green-500 hover:bg-pw-green-600 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-pw-green-500/25 no-underline"
                >
                  🛍️ Explore Our Store
                </a>
                {/* <button
                  onClick={() => scrollToSection("contact")}
                  className="border border-pw-green-500 text-pw-green-500 hover:bg-pw-green-500/10 font-bold py-3 px-8 rounded-lg transition-all duration-300"
                >
                  Get Custom Quote
                </button> */}
              </div>
              <div className="mt-4 flex justify-center items-center space-x-6 text-sm text-gray-400">
                <div className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-1 text-pw-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Premium Quality
                </div>
                <div className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-1 text-pw-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Fast Shipping
                </div>
                <div className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-1 text-pw-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Custom Designs
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="bg-black-800">
        <div
          className="relative"
          style={{
            backgroundImage: "url('/files/wall.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundAttachment: "fixed",
          }}
        >
          <div className="w-screen bg-black/60 px-6 py-4 text-xl text-white">
            <h2 className="section-title">Get In Touch</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <p className="text-gray-300 mb-6">
                  Ready to bring your project to life? Contact us today to
                  discuss how we can help you create stunning video content.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center mr-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-green-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <span className="text-gray-300">
                      PoiisonWaterProductions@gmail.com
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center mr-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-green-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                    </div>
                    <span className="text-gray-300">+1 (646) 509-5984</span>
                  </div>
                </div>
              </div>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Name"
                    className="bg-black-900 border-3 border-gray-800/90 rounded-lg p-3 text-white placeholder-white font-semibold text-lg focus:border-green-500/60 focus:ring-2 focus:ring-green-500/60 focus:outline-none"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    className="bg-black-900 border-3 border-gray-800/90 rounded-lg p-3 text-white placeholder-white font-semibold text-lg focus:border-green-500/60 focus:ring-2 focus:ring-green-500/60 focus:outline-none"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Subject"
                  className="w-full bg-black-900 border-3 border-gray-800/90 rounded-lg p-3 text-white placeholder-white font-semibold text-lg focus:border-green-500/60 focus:ring-2 focus:ring-green-500/60 focus:outline-none"
                />
                <textarea
                  rows="5"
                  placeholder="Message"
                  className="w-full bg-black-900 border-3 border-gray-800/90 rounded-lg p-3 text-white placeholder-white font-semibold text-lg focus:border-green-500/60 focus:ring-2 focus:ring-green-500/60 focus:outline-none"
                ></textarea>
                <button
                  type="submit"
                  className="bg-pw-green-500 hover:bg-pw-green-600 text-white font-bold py-2 px-4 rounded transition-all duration-300 w-full"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8  border-t border-gray-800">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-xl font-bold text-white mb-4 md:mb-0">
              <span className="text-green-500">PW</span>
              Productions
            </div>
            <div className="flex space-x-6">
              <a
                href="#"
                className="text-gray-400 hover:text-green-500 transition-colors no-underline"
              >
                <svg
                  className="w-6 h-6"
                  fill="gray"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-green-500 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="gray"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-green-500 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="gray"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
            </div>
          </div>
          <div className="text-center mt-8 text-gray-500 text-sm">
            © {new Date().getFullYear()} PWProductions. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Cart Component */}
      <Cart />
    </div>
  );
}

export default HomePage;
