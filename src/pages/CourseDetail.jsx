import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaClock, FaGraduationCap, FaChalkboardTeacher, FaCheck, FaHeart, FaShoppingCart, FaVideo, FaMobile, FaLaptop, FaClock as FaAnytime, FaEnvelope, FaWhatsapp, FaCertificate, FaDownload } from 'react-icons/fa';
import Header from '../components/Header';
import Footer from '../components/Footer';
import GoldenButton from '../components/GoldenButton';
import PaymentButton from '../components/PaymentButton';
import { addToCart, addToWishlist, removeFromWishlist, isInWishlist, isInCart } from '../services/cartService';
import { useAuth } from '../context/AuthContext';
import '../styles/CourseDetail.css';

// Importamos las imágenes de los cursos
import maquillajeImg from '../assets/images/unas-kupula3.jpg';
import unasImg from '../assets/images/unas-kupula5.jpg';
import esteticaImg from '../assets/images/unasdeco001.jpg';
import manicuraImg from '../assets/images/unas-kupula2.jpg';
import socialImg from '../assets/images/unas-kupula26.jpg';
import extensionImg from '../assets/images/unas-kupula27.jpg';

// Base de datos de cursos (en una aplicación real, esto vendría del backend)
const coursesData = [
  {
    id: 'curso-de-maquillaje-profesional',
    title: 'Curso de Maquillaje Profesional',
    description: 'Aprende técnicas de maquillaje artístico y desarrolla tu creatividad con los mejores productos.',
    image: maquillajeImg,
    duration: '60 horas',
    level: 'Avanzado',
    price: 499.99,
    instructor: 'Tania Calvo',
    fullDescription: `
      Este curso completo de maquillaje profesional te proporcionará todas las habilidades necesarias para destacar en la industria de la belleza.

      Aprenderás desde técnicas básicas hasta avanzadas, incluyendo:

      • Preparación de la piel
      • Corrección de imperfecciones
      • Técnicas de contorno e iluminación
      • Maquillaje para diferentes ocasiones
      • Maquillaje para fotografía y video
      • Tendencias actuales en maquillaje

      Al finalizar, estarás preparado/a para trabajar como maquillador/a profesional en diversos entornos.
    `,
    benefits: [
      'Certificación profesional reconocida',
      'Prácticas con modelos reales',
      'Kit de maquillaje profesional incluido',
      'Asesoramiento para iniciar tu carrera',
      'Bolsa de trabajo para los mejores alumnos'
    ]
  },
  {
    id: 'curso-de-unas-esculpidas',
    title: 'Curso de Uñas Esculpidas',
    description: 'Domina el arte de las uñas acrílicas y gel. Técnicas profesionales para resultados perfectos.',
    image: unasImg,
    duration: '45 horas',
    level: 'Intermedio',
    price: 349.99,
    instructor: 'Laura Martínez',
    fullDescription: `
      Conviértete en un/a experto/a en el arte de las uñas esculpidas con este curso completo.

      Aprenderás:

      • Preparación de la uña natural
      • Técnicas de aplicación de acrílico
      • Técnicas de aplicación de gel
      • Diseño y decoración de uñas
      • Mantenimiento y reparación
      • Técnicas de marketing para tu negocio

      Este curso te dará todas las herramientas necesarias para iniciar tu propio negocio de uñas.
    `,
    benefits: [
      'Kit de materiales incluido',
      'Grupos reducidos para atención personalizada',
      'Prácticas supervisadas',
      'Certificado profesional',
      'Asesoramiento para montar tu propio negocio'
    ]
  },
  {
    id: 'estetica-integral',
    title: 'Estética Integral',
    description: 'Formación completa en tratamientos faciales y corporales. Todo lo que necesitas para ser profesional.',
    image: esteticaImg,
    duration: '120 horas',
    level: 'Todos los niveles',
    price: 799.99,
    instructor: 'Carmen Rodríguez',
    fullDescription: `
      Este curso de estética integral te proporcionará una formación completa en todos los aspectos de la estética profesional.

      El programa incluye:

      • Anatomía y fisiología de la piel
      • Diagnóstico facial y corporal
      • Tratamientos faciales avanzados
      • Tratamientos corporales reductores y reafirmantes
      • Aparatología estética
      • Protocolos de tratamiento personalizados
      • Gestión de un centro de estética

      Al finalizar, estarás capacitado/a para trabajar en centros de estética o abrir tu propio negocio.
    `,
    benefits: [
      'Formación teórica y práctica completa',
      'Prácticas en cabina con clientes reales',
      'Diploma acreditativo',
      'Bolsa de trabajo',
      'Descuentos en productos profesionales'
    ]
  },
  {
    id: 'curso-de-manicura-y-pedicura',
    title: 'Curso de Manicura y Pedicura',
    description: 'Domina el arte y el cuidado de manos y pies. Aprende técnicas de spa y tratamientos especiales.',
    image: manicuraImg,
    duration: '30 horas',
    level: 'Principiante',
    price: 249.99,
    instructor: 'Ana López',
    fullDescription: `
      Aprende todas las técnicas necesarias para ofrecer servicios profesionales de manicura y pedicura.

      El curso incluye:

      • Anatomía de manos y pies
      • Técnicas de manicura básica y spa
      • Técnicas de pedicura básica y spa
      • Esmaltado permanente
      • Tratamientos para problemas específicos
      • Decoración de uñas básica

      Este curso es ideal para principiantes que quieren iniciarse en el mundo de la estética.
    `,
    benefits: [
      'Kit básico de manicura y pedicura incluido',
      'Grupos reducidos',
      'Prácticas entre alumnos',
      'Certificado de asistencia',
      'Asesoramiento post-curso'
    ]
  },
  {
    id: 'curso-de-maquillaje-social',
    title: 'Curso de Maquillaje Social',
    description: 'Descubre técnicas de maquillaje social para eventos, bodas y ocasiones especiales.',
    image: socialImg,
    duration: '40 horas',
    level: 'Intermedio',
    price: 349.99,
    instructor: 'Tania Calvo',
    fullDescription: `
      Especialízate en maquillaje social para eventos y ocasiones especiales con este curso completo.

      Aprenderás:

      • Maquillaje para novias
      • Maquillaje para eventos de día
      • Maquillaje para eventos de noche
      • Técnicas de fotografía
      • Adaptación del maquillaje según el tipo de evento
      • Productos específicos para larga duración

      Perfecto para quienes quieren especializarse en el maquillaje para eventos sociales.
    `,
    benefits: [
      'Prácticas con modelos reales',
      'Book fotográfico de tus trabajos',
      'Certificado profesional',
      'Descuentos en productos profesionales',
      'Asesoramiento para emprendedores'
    ]
  },
  {
    id: 'curso-de-extension-de-pestanas',
    title: 'Curso de Extensión de Pestañas',
    description: 'Extensiones de pestañas de cero a cien. Aprende todas las técnicas: pelo a pelo, volumen ruso y más.',
    image: extensionImg,
    duration: '25 horas',
    level: 'Avanzado',
    price: 399.99,
    instructor: 'Sofía Martín',
    fullDescription: `
      Conviértete en un/a especialista en extensiones de pestañas con este curso intensivo.

      El programa incluye:

      • Técnica pelo a pelo
      • Técnica de volumen ruso
      • Técnica de volumen híbrido
      • Lifting de pestañas
      • Tinte de pestañas
      • Mantenimiento y rellenos

      Un curso completo para dominar todas las técnicas de extensión de pestañas.
    `,
    benefits: [
      'Kit profesional incluido',
      'Prácticas con modelos reales',
      'Grupos reducidos (máximo 6 alumnos)',
      'Certificado profesional',
      'Seguimiento post-curso'
    ]
  }
];

const CourseDetail = () => {
  const { courseId } = useParams();
  const { isAuthenticated, currentUser } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inWishlist, setInWishlist] = useState(false);
  const [inCart, setInCart] = useState(false);

  useEffect(() => {
    try {
      // Cargar datos del curso
      const selectedCourse = coursesData.find(c => c.id === courseId);

      if (selectedCourse) {
        setCourse(selectedCourse);

        // Verificar si el curso está en la lista de deseos o en el carrito
        if (isAuthenticated()) {
          // Verificar lista de deseos usando localStorage directamente
          const wishlistStatus = localStorage.getItem(`wishlist_${courseId}`) === 'true';
          setInWishlist(wishlistStatus);

          // Verificar carrito usando localStorage directamente
          const cartStatus = localStorage.getItem(`cart_${courseId}`) === 'true';
          setInCart(cartStatus);

          console.log(`Curso ${courseId} - En wishlist: ${wishlistStatus}, En carrito: ${cartStatus}`);
        }
      } else {
        console.error(`Curso con ID ${courseId} no encontrado`);
      }

      setLoading(false);

      // Scroll al inicio de la página
      window.scrollTo(0, 0);
    } catch (error) {
      console.error('Error al cargar el curso:', error);
      setLoading(false);
    }
  }, [courseId, isAuthenticated]);

  // Función para manejar el clic en el botón de lista de deseos
  const handleWishlistClick = () => {
    if (!isAuthenticated()) {
      alert('Debes iniciar sesión para añadir cursos a tu lista de deseos');
      return;
    }

    try {
      if (inWishlist) {
        // Eliminar de la lista de deseos
        localStorage.setItem(`wishlist_${courseId}`, 'false');
        setInWishlist(false);
        alert(`Curso "${course.title}" eliminado de tu lista de deseos`);
      } else {
        // Preparar el curso para añadir con todos los datos necesarios
        const courseToAdd = {
          id: courseId,
          title: course.title,
          price: course.price,
          image: course.image,
          description: course.description,
          duration: course.duration,
          level: course.level,
          instructor: course.instructor
        };

        // Guardar en localStorage
        localStorage.setItem(`wishlist_${courseId}`, 'true');
        localStorage.setItem(`wishlist_data_${courseId}`, JSON.stringify(courseToAdd));

        // Actualizar estado
        setInWishlist(true);
        alert(`Curso "${course.title}" añadido a tu lista de deseos`);
      }
    } catch (error) {
      console.error('Error al manejar la lista de deseos:', error);
      alert('Ocurrió un error al procesar tu solicitud. Por favor, inténtalo de nuevo.');
    }
  };

  // Función para manejar el clic en el botón de carrito
  const handleCartClick = () => {
    if (!isAuthenticated()) {
      alert('Debes iniciar sesión para añadir cursos al carrito');
      return;
    }

    try {
      if (inCart) {
        alert(`El curso "${course.title}" ya está en tu carrito`);
      } else {
        // Preparar el curso para añadir con todos los datos necesarios
        const courseToAdd = {
          id: courseId,
          title: course.title,
          price: course.price,
          image: course.image,
          description: course.description,
          duration: course.duration,
          level: course.level,
          instructor: course.instructor
        };

        // Guardar en localStorage
        localStorage.setItem(`cart_${courseId}`, 'true');
        localStorage.setItem(`cart_data_${courseId}`, JSON.stringify(courseToAdd));

        // Actualizar estado
        setInCart(true);
        alert(`Curso "${course.title}" añadido al carrito`);
      }
    } catch (error) {
      console.error('Error al manejar el carrito:', error);
      alert('Ocurrió un error al procesar tu solicitud. Por favor, inténtalo de nuevo.');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando detalles del curso...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="course-not-found">
        <h2>Curso no encontrado</h2>
        <p>Lo sentimos, el curso que buscas no existe.</p>
        <GoldenButton text="Volver a cursos" link="/#cursos" />
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="course-detail-container">
        <div className="course-detail-header">
          <div className="course-detail-image-container">
            <img src={course.image} alt={course.title} className="course-detail-image" />
          </div>
          <div className="course-detail-info">
            <h1 className="course-detail-title">{course.title}</h1>
            <div className="course-detail-meta">
              <div className="meta-item">
                <FaClock className="meta-icon" />
                <span>{course.duration}</span>
              </div>
              <div className="meta-item">
                <FaGraduationCap className="meta-icon" />
                <span>{course.level}</span>
              </div>
              <div className="meta-item">
                <FaChalkboardTeacher className="meta-icon" />
                <span>{course.instructor}</span>
              </div>
            </div>
            <div className="course-detail-price">
              <span className="price-label">Precio:</span>
              <span className="price-amount">{course.price.toFixed(2)}€</span>
            </div>
            <div className="course-detail-actions">
              <div className="action-buttons">
                {isAuthenticated() ? (
                  <GoldenButton
                    text={inCart ? "Ir al carrito" : "Añadir al carrito"}
                    onClick={() => {
                      if (inCart) {
                        // Redirigir al carrito
                        window.location.href = "/profile";
                        // Establecer la pestaña activa en el carrito
                        localStorage.setItem('activeProfileTab', 'cart');
                      } else {
                        // Añadir al carrito y luego redirigir
                        handleCartClick();
                        setTimeout(() => {
                          window.location.href = "/profile";
                          localStorage.setItem('activeProfileTab', 'cart');
                        }, 1000);
                      }
                    }}
                  />
                ) : (
                  <GoldenButton
                    text="Iniciar sesión para comprar"
                    link="/"
                    onClick={() => {
                      alert('Debes iniciar sesión para comprar este curso');
                      // Guardar el curso en localStorage para redirigir después del login
                      localStorage.setItem('redirectAfterLogin', `/curso/${courseId}`);
                      // También guardar información para la compra pendiente
                      localStorage.setItem('pendingPurchase', JSON.stringify({ courseId }));
                    }}
                  />
                )}

                <div className="icon-buttons">
                  <button
                    className={`icon-button wishlist-button ${!isAuthenticated() ? 'disabled' : ''} ${inWishlist ? 'active' : ''}`}
                    onClick={handleWishlistClick}
                    disabled={!isAuthenticated()}
                    title={isAuthenticated() ? (inWishlist ? "Quitar de lista de deseos" : "Añadir a lista de deseos") : "Inicia sesión para añadir a lista de deseos"}
                  >
                    <FaHeart />
                  </button>

                  <button
                    className={`icon-button cart-button ${!isAuthenticated() ? 'disabled' : ''} ${inCart ? 'active' : ''}`}
                    onClick={handleCartClick}
                    disabled={!isAuthenticated()}
                    title={isAuthenticated() ? (inCart ? "Ya está en el carrito" : "Añadir al carrito") : "Inicia sesión para añadir al carrito"}
                  >
                    <FaShoppingCart />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="course-detail-content">
          <div className="course-detail-description">
            <h2>Descripción del curso</h2>
            <div className="description-text">
              {course.fullDescription.split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>

          <div className="course-detail-benefits">
            <h2>¿Qué obtendrás?</h2>
            <ul className="benefits-list">
              {course.benefits.map((benefit, index) => (
                <li key={index} className="benefit-item">
                  <FaCheck className="benefit-icon" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="course-detail-features">
          <h2>Características del curso</h2>
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon">
                <FaVideo />
              </div>
              <div className="feature-text">
                <h3>Formato video</h3>
                <p>Curso en formato video con explicaciones detalladas paso a paso</p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon">
                <div className="multi-icon">
                  <FaMobile />
                  <FaLaptop />
                </div>
              </div>
              <div className="feature-text">
                <h3>Acceso multidispositivo</h3>
                <p>Accede desde cualquier dispositivo: móvil, tablet o computadora</p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon">
                <FaAnytime />
              </div>
              <div className="feature-text">
                <h3>A tu ritmo</h3>
                <p>Estudia en cualquier momento, sin horarios fijos</p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon">
                <div className="multi-icon">
                  <FaEnvelope />
                  <FaWhatsapp />
                </div>
              </div>
              <div className="feature-text">
                <h3>Soporte personalizado</h3>
                <p>Resuelve tus dudas por correo o WhatsApp con nuestros instructores</p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon">
                <div className="multi-icon">
                  <FaCertificate />
                  <FaDownload />
                </div>
              </div>
              <div className="feature-text">
                <h3>Certificado digital</h3>
                <p>Obtén un certificado de aprovechamiento descargable al finalizar</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseDetail;
