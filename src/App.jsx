/* eslint-disable no-undef */
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect, lazy, Suspense } from "react";
import Header from "./components/Header.jsx";
import HeroSection from "./components/HeroSection.jsx";
import ErrorBoundary from "./components/ErrorBoundary";

import ReviewCarousel from "./components/ReviewCarrousel.jsx";
import ChatBot from "./components/ChatBot.jsx";
import Footer from "./components/Footer.jsx";
import Profile from './pages/Profile';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import AdminLayout from './components/admin/AdminLayout';

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Importar estilos globales
import "./styles/index.css";
import "./styles/Interactions.css";
import "./styles/Animations.css";
// Importaciones con lazy loading para mejorar el rendimiento
const AboutSection = lazy(() => import("./components/AboutSection.jsx"));
const Courses = lazy(() => import("./components/Courses.jsx"));
const ContactSection = lazy(() => import("./components/ContactSection.jsx"));
// Profile ya está importado al principio del archivo
const CourseDetail = lazy(() => import('./pages/CourseDetail'));
const PoliticaPrivacidad = lazy(() => import("./components/PoliticaPrivacidad"));
const AvisoLegal = lazy(() => import("./components/AvisoLegal"));
const CookiesPolicy = lazy(() => import("./components/CookiesPolicy"));
const CondicionesDeCompra = lazy(() => import("./components/CondicionesDeCompra"));
// Admin components
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const UsersManagement = lazy(() => import('./pages/admin/UsersManagement'));
const CoursesManagement = lazy(() => import('./pages/admin/CoursesManagement'));
const ContactsManagement = lazy(() => import('./pages/admin/ContactsManagement'));
const OrdersManagement = lazy(() => import('./pages/admin/OrdersManagement'));
const SessionsManagement = lazy(() => import('./pages/admin/SessionsManagement'));
const UserForm = lazy(() => import('./pages/admin/UserForm'));

// Payment components
const PaymentSuccess = lazy(() => import('./pages/PaymentSuccess'));
const PaymentCancel = lazy(() => import('./pages/PaymentCancel'));


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
    <ErrorBoundary showDetails={process.env.NODE_ENV === 'development'} componentName="App">
      <AuthProvider>
         <BrowserRouter basename="/react-akademiakupula">
          <div className="app-container">
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
                <ErrorBoundary componentName="HomePage">
                  <main className="home-page">
                    <Header />
                    <HeroSection />
                    <Suspense fallback={<LoadingFallback />}>
                      <ErrorBoundary componentName="AboutSection">
                        <AboutSection />
                      </ErrorBoundary>
                      <ErrorBoundary componentName="Courses">
                        <Courses />
                      </ErrorBoundary>
                       <ErrorBoundary componentName="ReviewCarousel">
                        <ReviewCarousel />
                       </ErrorBoundary>
                      <ErrorBoundary componentName="ContactSection">
                        <ContactSection />
                      </ErrorBoundary>
                    </Suspense>
                    <ChatBot />
                  </main>
                </ErrorBoundary>
              }
            />
          <Route path="/politica-privacidad" element={<ErrorBoundary componentName="PoliticaPrivacidad"><PoliticaPrivacidad /></ErrorBoundary>} />
          <Route path="/aviso-legal" element={<ErrorBoundary componentName="AvisoLegal"><AvisoLegal /></ErrorBoundary>} />
          <Route path="/cookies" element={<ErrorBoundary componentName="CookiesPolicy"><CookiesPolicy /></ErrorBoundary>} />
          <Route path="/condiciones-de-compra" element={<ErrorBoundary componentName="CondicionesDeCompra"><CondicionesDeCompra /></ErrorBoundary>} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/curso/:courseId" element={
            <ErrorBoundary componentName="CourseDetail">
              <Suspense fallback={<LoadingFallback />}>
                <CourseDetail />
              </Suspense>
            </ErrorBoundary>
          } />
          <Route path="/payment/success" element={
            <ErrorBoundary componentName="PaymentSuccess">
              <Suspense fallback={<LoadingFallback />}>
                <PaymentSuccess />
              </Suspense>
            </ErrorBoundary>
          } />
          <Route path="/payment/cancel" element={
            <ErrorBoundary componentName="PaymentCancel">
              <Suspense fallback={<LoadingFallback />}>
                <PaymentCancel />
              </Suspense>
            </ErrorBoundary>
          } />

          {/* Rutas del panel de administración - Protegidas */}
          <Route path="/admin" element={
            <AdminProtectedRoute>
              <AdminLayout />
            </AdminProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<UsersManagement />} />
            <Route path="users/:userId" element={<UserForm />} />
            <Route path="cursos" element={<CoursesManagement />} />
            <Route path="contactos" element={<ContactsManagement />} />
            <Route path="orders" element={<OrdersManagement />} />
            <Route path="sessions" element={<SessionsManagement />} />
          </Route>
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
    </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;