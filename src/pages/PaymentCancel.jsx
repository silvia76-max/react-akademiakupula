import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTimesCircle, FaArrowLeft, FaShoppingCart } from 'react-icons/fa';
import './PaymentCancel.css';

const PaymentCancel = () => {
  const navigate = useNavigate();
  
  const handleGoBack = () => {
    // Intentar obtener el ID del curso que el usuario estaba tratando de comprar
    const pendingPurchase = localStorage.getItem('pendingPurchase');
    
    if (pendingPurchase) {
      try {
        const { courseId } = JSON.parse(pendingPurchase);
        navigate(`/course/${courseId}`);
        return;
      } catch (error) {
        console.error('Error al parsear pendingPurchase:', error);
      }
    }
    
    // Si no hay información sobre el curso, volver a la página de cursos
    navigate('/courses');
  };
  
  const handleGoToCart = () => {
    navigate('/profile/cart');
  };
  
  return (
    <div className="payment-cancel-container">
      <div className="cancel-icon">
        <FaTimesCircle />
      </div>
      
      <h1>Pago cancelado</h1>
      
      <p className="cancel-message">
        Has cancelado el proceso de pago. No te preocupes, no se ha realizado ningún cargo.
      </p>
      
      <div className="cancel-options">
        <h3>¿Qué deseas hacer ahora?</h3>
        
        <div className="option-cards">
          <div className="option-card">
            <h4>¿Tienes dudas sobre el curso?</h4>
            <p>Si tienes preguntas sobre el curso o el proceso de pago, no dudes en contactarnos.</p>
            <button className="contact-button" onClick={() => navigate('/contact')}>
              Contactar con soporte
            </button>
          </div>
          
          <div className="option-card">
            <h4>¿Quieres guardar el curso para más tarde?</h4>
            <p>Puedes añadir el curso a tu lista de deseos o al carrito para comprarlo más tarde.</p>
            <button className="wishlist-button" onClick={handleGoToCart}>
              <FaShoppingCart /> Ver carrito
            </button>
          </div>
        </div>
      </div>
      
      <button className="back-button" onClick={handleGoBack}>
        <FaArrowLeft /> Volver al curso
      </button>
    </div>
  );
};

export default PaymentCancel;
