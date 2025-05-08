import { BrowserRouter, Routes, Route } from "react-router-dom"; // Importación correcta
import Header from "./components/Header.jsx";
import HeroSection from "./components/HeroSection.jsx";
import AboutSection from "./components/AboutSection.jsx";
import ErrorBoundary from "./components/ErrorBoundary";
import Courses from "./components/Courses.jsx";
import ContactSection from "./components/ContactSection.jsx";
import Footer from "./components/Footer.jsx";
import ReviewCarousel from "./components/ReviewCarrousel.jsx";
import Profile from './pages/Profile';
import PoliticaPrivacidad from "./components/PoliticaPrivacidad";
import AvisoLegal from "./components/AvisoLegal";
import CookiesPolicy from "./components/CookiesPolicy";
import CondicionesDeCompra from "./components/CondicionesDeCompra";
import PingTest from "./components/pingTest.jsx";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./index.css";

export function App() {
  return (
    <BrowserRouter> {/* Aquí utilizas correctamente BrowserRouter */}
      <div className="app-container">
        <PingTest />
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Header />
                <HeroSection />
                <AboutSection />
                <Courses />
                <ContactSection />
                <section id="opiniones">
                  <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>
                    Opiniones de nuestros alumnos
                  </h2>
                  <ErrorBoundary>
                    <ReviewCarousel />
                  </ErrorBoundary>
                </section>
              </>
            }
          />
          <Route path="/politica-privacidad" element={<PoliticaPrivacidad />} />
          <Route path="/aviso-legal" element={<AvisoLegal />} />
          <Route path="/cookies" element={<CookiesPolicy />} />
          <Route path="/condiciones-de-compra" element={<CondicionesDeCompra />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;