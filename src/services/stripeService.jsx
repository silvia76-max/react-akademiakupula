import { loadStripe } from '@stripe/stripe-js';

// Clave pública de Stripe
const stripePromise = loadStripe('pk_test_51RM5IkCDxUStkLAzsN4ebNdDXs2mmUvhTsXJIclBm8hUqNehUX9w8JnmbESlEvtXCmNyertrSgfwYEwMramrzCAI00USsREDNn');

/**
 * Crea una sesión de checkout de Stripe para un curso
 * @param {number} courseId - ID del curso a comprar
 * @returns {Promise<Object>} - Objeto con el ID de la sesión de Stripe
 */
export const createCheckoutSession = async (courseId) => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('Usuario no autenticado');
    }

    const response = await fetch('http://localhost:5000/api/payments/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ courseId })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al crear la sesión de checkout');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error en el servicio de Stripe:', error);
    throw error;
  }
};

/**
 * Redirige al usuario a la página de checkout de Stripe
 * @param {string} sessionId - ID de la sesión de checkout
 * @returns {Promise<void>}
 */
export const redirectToCheckout = async (sessionId) => {
  try {
    const stripe = await stripePromise;
    const { error } = await stripe.redirectToCheckout({
      sessionId
    });

    if (error) {
      throw new Error(error.message);
    }
  } catch (error) {
    console.error('Error al redirigir al checkout:', error);
    throw error;
  }
};

/**
 * Verifica el estado de un pago
 * @param {string} sessionId - ID de la sesión de checkout
 * @returns {Promise<Object>} - Objeto con el estado del pago
 */
export const checkPaymentStatus = async (sessionId) => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('Usuario no autenticado');
    }

    const response = await fetch(`http://localhost:5000/api/payments/check-payment-status/${sessionId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al verificar el estado del pago');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al verificar el estado del pago:', error);
    throw error;
  }
};

/**
 * Obtiene el historial de pagos del usuario
 * @returns {Promise<Array>} - Array con el historial de pagos
 */
export const getPaymentHistory = async () => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('Usuario no autenticado');
    }

    const response = await fetch('http://localhost:5000/api/payments/history', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al obtener el historial de pagos');
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error al obtener el historial de pagos:', error);
    throw error;
  }
};

export default {
  createCheckoutSession,
  redirectToCheckout,
  checkPaymentStatus,
  getPaymentHistory
};
