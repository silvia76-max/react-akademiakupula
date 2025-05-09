import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect, lazy, Suspense } from "react";
import { FaArrowUp } from "react-icons/fa";
import Header from "./components/Header.jsx";
import HeroSection from "./components/HeroSection.jsx";
import ErrorBoundary from "./components/ErrorBoundary";
import ChatBot from "./components/ChatBot.jsx";
import ParticlesBackground from "./components/ParticlesBackground.jsx";
import SettingsPanel from "./components/SettingsPanel.jsx";
import Footer from "./components/Footer.jsx";
import "./styles/Interactions.css";
// Importaciones con lazy loading para mejorar el rendimiento
const AboutSection = lazy(() => import("./components/AboutSection.jsx"));
const Courses = lazy(() => import("./components/Courses.jsx"));
const ContactSection = lazy(() => import("./components/ContactSection.jsx"));
const ReviewCarousel = lazy(() => import("./components/ReviewCarrousel.jsx"));
const Profile = lazy(() => import('./pages/Profile'));
const PoliticaPrivacidad = lazy(() => import("./components/PoliticaPrivacidad"));
const AvisoLegal = lazy(() => import("./components/AvisoLegal"));
const CookiesPolicy = lazy(() => import("./components/CookiesPolicy"));
const CondicionesDeCompra = lazy(() => import("./components/CondicionesDeCompra"));
// Import for development debugging only
import PingTest from "./components/pingTest.jsx";
import TestForm from "./components/TestForm.jsx";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./index.css";

// Componente para el botón de volver arriba
const BackToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Mostrar el botón cuando se desplaza hacia abajo
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  // Función para volver arriba suavemente
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <button
      className={`back-to-top ${isVisible ? 'visible' : ''}`}
      onClick={scrollToTop}
      aria-label="Volver arriba"
      title="Volver arriba"
    >
      <FaArrowUp />
    </button>
  );
};

// Componente de carga para Suspense
const LoadingFallback = () => (
  <div className="loading-container">
    <div className="loading-spinner"></div>
    <p>Cargando...</p>
  </div>
);

// Componente de notificación
const Notification = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`notification ${type}`}>
      <p>{message}</p>
      <button className="notification-close" onClick={onClose}>×</button>
    </div>
  );
};

export function App() {
  const [notification, setNotification] = useState(null);

  // Función para mostrar notificaciones
  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
  };

  // Cerrar notificación
  const closeNotification = () => {
    setNotification(null);
  };

  // Efecto para mostrar notificación de bienvenida
  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisited');

    if (!hasVisited) {
      setTimeout(() => {
        showNotification('¡Bienvenido/a a Akademia La Kúpula! Explora nuestros cursos y descubre tu potencial.', 'success');
        localStorage.setItem('hasVisited', 'true');
      }, 2000);
    }
  }, []);

  return (
    <BrowserRouter>
      <div className="app-container">
        {/* Development test component */}
        <PingTest />

        {/* Sistema de notificaciones */}
        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={closeNotification}
          />
        )}

        <Routes>
          <Route
            path="/"
            element={
              <main className="home-page">
                <Header />
                <HeroSection />
                <Suspense fallback={<LoadingFallback />}>
                  <AboutSection />
                  <Courses />
                  <ContactSection />
                  <ErrorBoundary>
                    <ReviewCarousel />
                  </ErrorBoundary>
                </Suspense>
                <BackToTopButton />
                <ChatBot />
                <SettingsPanel />
                <ParticlesBackground />
              </main>
            }
          />
          <Route path="/politica-privacidad" element={<PoliticaPrivacidad />} />
          <Route path="/aviso-legal" element={<AvisoLegal />} />
          <Route path="/cookies" element={<CookiesPolicy />} />
          <Route path="/condiciones-de-compra" element={<CondicionesDeCompra />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/test" element={<TestForm />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;