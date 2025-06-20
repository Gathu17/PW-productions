import { useState, useEffect } from "react";
import "./assets/main.css";

function App() {
    const [isLoaded, setIsLoaded] = useState(false);

    // Portfolio projects array
    const projects = [
        {
            title: "Rob Duran Podcast",
            client: "Client Name",
            imageURL: "/files/rdp.png",
        },
        {
            title: "Maverick Etching",
            client: "Client Name",
            imageURL: "/files/Maverick.png",
        },
        {
            title: "The FireConversation Podcast",
            client: "Client Name",
            imageURL: "/files/talkin.png",
        },
        {
            title: "Limitless Inspiration",
            client: "Client Name",
            imageURL: "/files/Inspiration.png",
        },
        {
            title: "Sophisticated Savages Podcast",
            client: "Client Name",
            imageURL: "/files/portfolio5.jpg",
        },
        {
            title: "Eden Cosmetics",
            client: "Client Name",
            imageURL: "/files/portfolio6.jpg",
        },
    ];

    // Carousel services array
    const services = [
        {
            title: "Premium Video Editing",
            description:
                "Seamlessly blending timeline layouts, color grading, sound mixing, and motion graphics to create polished, refined video content.",
            imageURL: "/files/service1.jpg", // replace with your image
        },
        {
            title: "Cinematic Storytelling",
            description:
                "Collaborating with ad agencies, businesses, and especially with content creators to produce content for social media, broadcast, web and print campaigns.",
            imageURL: "/files/service2.jpg", // replace with your image
        },
        {
            title: "Monetize Your Brand Like Never Before!",
            description:
                "We transform your brand into a revenue-generating powerhouse through multiple platforms—custom apparel, accessories, exclusive artwork, and more.",
            imageURL: "/files/service3.jpg", // replace with your image
        },
        {
            title: "Real Estate Videography & Photography",
            description:
                "Showcasing properties with high-quality visuals that engage and inspire, tailored for commercial, corporate, and advertising needs.",
            imageURL: "/files/service4.jpg", // replace with your image
        },
    ];
    const [currentService, setCurrentService] = useState(0);
    const handlePrev = () =>
        setCurrentService((prev) =>
            prev === 0 ? services.length - 1 : prev - 1
        );
    const handleNext = () =>
        setCurrentService((prev) =>
            prev === services.length - 1 ? 0 : prev + 1
        );

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

                <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-10">
                    <div className="text-2xl font-bold text-white">
                        <span className="text-green-500">PW</span>Productions
                    </div>
                    <nav className="hidden md:flex space-x-8">
                        <a
                            href="#services"
                            className="text-white hover:text-green-500 transition-colors no-underline "
                        >
                            Services
                        </a>
                        <a
                            href="#portfolio"
                            className="text-white hover:text-green-500 transition-colors"
                        >
                            Portfolio
                        </a>
                        <a
                            href="#about"
                            className="text-white hover:text-green-500 transition-colors"
                        >
                            About
                        </a>
                        <a
                            href="#contact"
                            className="text-white hover:text-green-500 transition-colors"
                        >
                            Contact
                        </a>
                    </nav>
                    <button className="md:hidden text-white">
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
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>
                    </button>
                </div>

                <div className="container px-6 relative z-10 py-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm rounded-xl pointer-events-none" aria-hidden="true"></div>
                    <div className="relative animate-fade-in delay-300">
                        <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
                            Bringing{" "}
                            <span className="text-green-500">Stories</span> to
                            Life
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl">
                            Professional video editing and production services
                            that transform your vision into compelling visual
                            narratives.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button className="btn-primary animate-pulse-slow">
                                View Our Work
                            </button>
                            <button className="border border-green-500 text-green-500 hover:bg-green-500/10 font-bold py-2 px-4 rounded transition-all duration-300">
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
                                <div
                                    className="w-full h-80 md:h-96 rounded-lg flex flex-col items-center justify-center relative overflow-hidden shadow-lg"
                                    style={{
                                        backgroundImage: `url(${services[currentService].imageURL})`,
                                        backgroundSize: "cover",
                                        backgroundPosition: "center",
                                    }}
                                >
                                    <div className="absolute inset-0 bg-black/70"></div>
                                    <div className="relative z-10 p-8 text-center">
                                        <h3 className="text-3xl md:text-4xl font-extrabold uppercase tracking-widest text-white mb-4 drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)] font-sans">
                                            {services[currentService].title}
                                        </h3>
                                        <p className="text-lg md:text-xl text-gray-100 font-light italic tracking-wide drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)] font-sans">
                                            {
                                                services[currentService]
                                                    .description
                                            }
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
                                            idx === currentService
                                                ? "bg-green-500"
                                                : "bg-gray-500/50"
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
                        {projects.map((project, i) => (
                            <div
                                key={i}
                                className="group relative overflow-hidden rounded-lg aspect-video bg-black cursor-pointer"
                                style={{
                                    backgroundImage: `url(${project.imageURL})`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-t from-black-900 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                                <div className="absolute bottom-0 left-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20">
                                    <h3 className="text-white font-bold">
                                        {project.title}
                                    </h3>
                                    <p className="text-green-500">
                                        {project.client}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="text-center mt-12">
                        <button className="btn-primary">
                            View All Projects
                        </button>
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
                                    Ready to bring your project to life? Contact
                                    us today to discuss how we can help you
                                    create stunning video content.
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
                                            contact@pwproductions.net
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
                                        <span className="text-gray-300">
                                            (555) 123-4567
                                        </span>
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
                                    className="btn-primary w-full"
                                >
                                    Send Message
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 bg-green-900 border-t border-gray-800">
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
                        © {new Date().getFullYear()} PWProductions. All rights
                        reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default App;
