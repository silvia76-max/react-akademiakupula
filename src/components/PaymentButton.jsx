import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLock, FaSpinner } from 'react-icons/fa';
import { createCheckoutSession, redirectToCheckout } from '../services/stripeService';
import '../styles/PaymentButton.css';

/**
 * Botón de pago que inicia el proceso de checkout con Stripe
 * @param {Object} props - Propiedades del componente
 * @param {number} props.courseId - ID del curso a comprar
 * @param {number} props.price - Precio del curso
 * @param {string} props.buttonText - Texto del botón (opcional)
 * @param {string} props.className - Clases CSS adicionales (opcional)
 */
const PaymentButton = ({ courseId, price, buttonText = 'Comprar ahora', className = '' }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Verificar si el usuario está autenticado
  const isAuthenticated = !!localStorage.getItem('token');

  const handlePayment = async () => {
    // Si el usuario no está autenticado, redirigir al login
    if (!isAuthenticated) {
      // Guardar el curso que el usuario quería comprar para redirigir después del login
      localStorage.setItem('pendingPurchase', JSON.stringify({ courseId }));
      navigate('/login');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Crear sesión de checkout
      const { sessionId } = await createCheckoutSession(courseId);

      // Redirigir a la página de checkout de Stripe
      await redirectToCheckout(sessionId);
    } catch (error) {
      console.error('Error al procesar el pago:', error);
      setError('Hubo un problema al procesar tu pago. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-button-container">
      <button
        className={`payment-button ${className}`}
        onClick={handlePayment}
        disabled={loading}
      >
        {loading ? (
          <>
            <FaSpinner className="spinner" />
            <span>Procesando...</span>
          </>
        ) : (
          <>
            <FaLock className="lock-icon" />
            <span>{buttonText}</span>
          </>
        )}
      </button>

      {error && (
        <div className="payment-error">
          {error}
        </div>
      )}

      <div className="payment-security">
        <FaLock className="security-icon" />
        <span>Pago seguro con Stripe</span>
      </div>
    </div>
  );
};

export default PaymentButton;
