import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaCheckCircle, FaSpinner, FaArrowRight, FaDownload } from 'react-icons/fa';
import { checkPaymentStatus } from '../services/stripeService';
import './PaymentSuccess.css';

const PaymentSuccess = () => {
  const [loading, setLoading] = useState(true);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Obtener el ID de la sesión de la URL
        const params = new URLSearchParams(location.search);
        const sessionId = params.get('session_id');
        
        if (!sessionId) {
          throw new Error('No se encontró el ID de la sesión');
        }
        
        // Verificar el estado del pago
        const paymentData = await checkPaymentStatus(sessionId);
        setPaymentInfo(paymentData);
      } catch (error) {
        console.error('Error al verificar el pago:', error);
        setError('No pudimos verificar tu pago. Por favor, contacta con soporte.');
      } finally {
        setLoading(false);
      }
    };
    
    verifyPayment();
  }, [location.search]);
  
  const handleGoToCourse = () => {
    if (paymentInfo && paymentInfo.courseId) {
      navigate(`/course/${paymentInfo.courseId}`);
    } else {
      navigate('/profile/courses');
    }
  };
  
  const handleGoToProfile = () => {
    navigate('/profile/courses');
  };
  
  if (loading) {
    return (
      <div className="payment-success-container loading">
        <FaSpinner className="spinner" />
        <h2>Verificando tu pago...</h2>
        <p>Esto puede tomar unos momentos. Por favor, no cierres esta página.</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="payment-success-container error">
        <div className="error-icon">❌</div>
        <h2>Hubo un problema</h2>
        <p>{error}</p>
        <button className="action-button" onClick={handleGoToProfile}>
          Ir a mi perfil
        </button>
      </div>
    );
  }
  
  return (
    <div className="payment-success-container">
      <div className="success-icon">
        <FaCheckCircle />
      </div>
      
      <h1>¡Pago completado con éxito!</h1>
      
      <div className="payment-details">
        <p className="thank-you">Gracias por tu compra</p>
        
        {paymentInfo && (
          <>
            <div className="detail-item">
              <span>Curso:</span>
              <span>{paymentInfo.courseName}</span>
            </div>
            
            <div className="detail-item">
              <span>Monto:</span>
              <span>{paymentInfo.amount} €</span>
            </div>
            
            <div className="detail-item">
              <span>Fecha:</span>
              <span>{new Date(paymentInfo.paymentDate).toLocaleDateString()}</span>
            </div>
            
            <div className="detail-item">
              <span>Número de orden:</span>
              <span>{paymentInfo.orderId}</span>
            </div>
          </>
        )}
      </div>
      
      <div className="receipt-section">
        <p>Hemos enviado un recibo a tu correo electrónico.</p>
        <button className="download-button">
          <FaDownload /> Descargar recibo
        </button>
      </div>
      
      <div className="next-steps">
        <h3>¿Qué sigue?</h3>
        <p>Ya puedes acceder a tu curso desde tu perfil o haciendo clic en el botón de abajo.</p>
        
        <div className="action-buttons">
          <button className="action-button primary" onClick={handleGoToCourse}>
            Ir al curso <FaArrowRight />
          </button>
          
          <button className="action-button secondary" onClick={handleGoToProfile}>
            Ver mis cursos
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
