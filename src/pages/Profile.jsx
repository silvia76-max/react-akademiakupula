import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  FaHeart, FaShoppingCart, FaTrash, FaArrowRight, FaUser,
  FaCamera, FaPencilAlt, FaSave, FaTimes, FaSignOutAlt,
  FaHome, FaEnvelope, FaMapMarkerAlt, FaPhone, FaIdCard,
  FaGraduationCap, FaCertificate, FaUserCircle, FaLock,
  FaShieldAlt
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { getCart, saveCart, getWishlist, saveWishlist, removeFromCart, removeFromWishlist, moveFromWishlistToCart } from '../services/cartService';
import ProfileHeader from '../components/ProfileHeader';
import PaymentButton from '../components/PaymentButton';
import MyCourses from '../components/profile/MyCourses';
import SessionsManager from '../components/profile/SessionsManager';
import '../styles/Profile.css';

// Importamos las imágenes de los cursos (simulación)
import maquillajeImg from '../assets/images/unas-kupula3.jpg';
import unasImg from '../assets/images/unas-kupula5.jpg';
import esteticaImg from '../assets/images/unasdeco001.jpg';

// Datos simulados para la lista de deseos y el carrito
const wishlistData = [
  {
    id: 'curso-de-maquillaje-profesional',
    title: 'Curso de Maquillaje Profesional',
    price: 499.99,
    image: maquillajeImg
  },
  {
    id: 'curso-de-unas-esculpidas',
    title: 'Curso de Uñas Esculpidas',
    price: 349.99,
    image: unasImg
  }
];

const cartData = [
  {
    id: 'estetica-integral',
    title: 'Estética Integral',
    price: 799.99,
    image: esteticaImg
  }
];

function Profile() {
  const { currentUser, updateProfile, logout, isAuthenticated } = useAuth();
  const [user, setUser] = useState(currentUser || {
    id: 1,
    full_name: 'Usuario de Prueba',
    email: 'usuario@ejemplo.com',
    postal_code: '28001',
    phone: '600123456',
    address: 'Calle Ejemplo 123',
    city: 'Madrid',
    dni: '12345678A'
  });

  // Obtener la pestaña activa de localStorage o usar 'profile' por defecto
  const [activeTab, setActiveTab] = useState(() => {
    const savedTab = localStorage.getItem('activeProfileTab');
    return savedTab || 'profile';
  });

  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Usamos un avatar por defecto en lugar del logo
  const [avatar, setAvatar] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({...user});
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Guardar la pestaña activa en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('activeProfileTab', activeTab);
  }, [activeTab]);

  // Actualizar el usuario cuando cambie currentUser
  useEffect(() => {
    if (currentUser) {
      setUser(currentUser);
      setEditedUser(currentUser);
    }
  }, [currentUser]);

  // Cargar datos del carrito y la lista de deseos
  useEffect(() => {
    try {
      setLoading(true);

      // Verificar si el usuario está autenticado
      if (!isAuthenticated()) {
        navigate('/');
        return;
      }

      // Cargar datos del carrito y la lista de deseos
      const wishlistItems = getWishlist();
      const cartItems = getCart();

      console.log('Wishlist items:', wishlistItems);
      console.log('Cart items:', cartItems);

      // Para usuarios nuevos, mostrar listas vacías
      // Para usuarios existentes, mostrar los datos guardados o datos de ejemplo solo si no hay datos guardados
      const isNewUser = currentUser && currentUser.isNewUser;

      if (isNewUser) {
        setWishlist([]);
        setCart([]);
      } else {
        setWishlist(wishlistItems.length > 0 ? wishlistItems : []);
        setCart(cartItems.length > 0 ? cartItems : []);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error al cargar los datos:', error);
      setError('Error al cargar los datos. Por favor, inténtalo de nuevo.');
      setLoading(false);
    }
  }, [navigate, isAuthenticated]);

  // Función para cerrar sesión
  const handleLogout = () => {
    console.log('Cerrando sesión...');
    try {
      const result = logout();
      console.log('Resultado de logout:', result);

      // Forzar la limpieza de datos
      localStorage.removeItem('akademia_auth_token');
      localStorage.removeItem('akademia_user_data');
      localStorage.removeItem('akademia_token_expiry');
      localStorage.removeItem('akademia_session_id');

      sessionStorage.removeItem('akademia_auth_token');
      sessionStorage.removeItem('akademia_user_data');
      sessionStorage.removeItem('akademia_token_expiry');
      sessionStorage.removeItem('akademia_session_id');

      console.log('Datos de sesión eliminados');

      // Redirigir a la página principal
      navigate('/');

      // Recargar la página para asegurar que se limpien todos los estados
      window.location.reload();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      alert('Error al cerrar sesión. Por favor, inténtalo de nuevo.');
    }
  };

  // Función para manejar el cambio de avatar
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatar(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Función para abrir el selector de archivos
  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  // Función para iniciar la edición de datos
  const startEditing = () => {
    setIsEditing(true);
    setEditedUser({...user});
  };

  // Función para cancelar la edición
  const cancelEditing = () => {
    setIsEditing(false);
  };

  // Función para guardar los cambios
  const saveChanges = async () => {
    try {
      // Actualizar el perfil usando el contexto de autenticación
      await updateProfile(editedUser);
      setUser({...editedUser});
      setIsEditing(false);
      alert('Perfil actualizado correctamente');
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
      alert('Error al actualizar el perfil. Inténtalo de nuevo.');
    }
  };

  // Función para manejar cambios en los campos de edición
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Función para eliminar un curso de la lista de deseos
  const handleRemoveFromWishlist = (courseId) => {
    const result = removeFromWishlist(courseId);
    if (result.success) {
      setWishlist(wishlist.filter(course => course.id !== courseId));
    } else {
      alert(result.message);
    }
  };

  // Función para añadir un curso al carrito desde la lista de deseos
  const handleMoveToCart = (course) => {
    const result = moveFromWishlistToCart(course.id);
    if (result.success) {
      // Actualizar el estado local
      if (!cart.some(item => item.id === course.id)) {
        setCart([...cart, course]);
      }
      setWishlist(wishlist.filter(item => item.id !== course.id));
      alert(result.message);
    } else {
      alert(result.message);
    }
  };

  // Función para eliminar un curso del carrito
  const handleRemoveFromCart = (courseId) => {
    const result = removeFromCart(courseId);
    if (result.success) {
      setCart(cart.filter(course => course.id !== courseId));
    } else {
      alert(result.message);
    }
  };

  // Calcular el total del carrito
  const cartTotal = cart.reduce((total, course) => total + course.price, 0);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando perfil...</p>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button
          className="retry-button"
          onClick={() => window.location.reload()}
        >
          Intentar de nuevo
        </button>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <ProfileHeader activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="profile-container">
        {activeTab === 'profile' && (
          <div className="profile-card">
            <div className="profile-header">
              <div className="avatar-container">
                <div className="avatar-wrapper" onClick={handleAvatarClick}>
                  {avatar ? (
                    <img src={avatar} alt="Avatar de usuario" className="user-avatar" />
                  ) : (
                    <FaUserCircle className="default-avatar-icon" />
                  )}
                  <div className="avatar-overlay">
                    <FaCamera className="camera-icon" />
                  </div>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAvatarChange}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
              </div>

              <div className="profile-title-container">
                <h1 className="profile-title">
                  {isEditing ? 'Editar perfil' : `Bienvenido, ${user.full_name}`}
                </h1>

                {currentUser && currentUser.isNewUser && (
                  <div className="welcome-message">
                    <p>¡Gracias por registrarte! Comienza a explorar cursos y añádelos a tu lista de deseos o carrito.</p>
                  </div>
                )}

                {!isEditing ? (
                  <button className="edit-button" onClick={startEditing}>
                    <FaPencilAlt /> Editar perfil
                  </button>
                ) : (
                  <div className="edit-actions">
                    <button className="save-button" onClick={saveChanges}>
                      <FaSave /> Guardar
                    </button>
                    <button className="cancel-button" onClick={cancelEditing}>
                      <FaTimes /> Cancelar
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="profile-content">
              {!isEditing ? (
                <div className="profile-info">
                  <div className="info-item">
                    <FaUser className="info-icon" />
                    <div>
                      <h3>Nombre completo</h3>
                      <p>{user.full_name}</p>
                    </div>
                  </div>

                  <div className="info-item">
                    <FaEnvelope className="info-icon" />
                    <div>
                      <h3>Email</h3>
                      <p>{user.email}</p>
                    </div>
                  </div>

                  <div className="info-item">
                    <FaPhone className="info-icon" />
                    <div>
                      <h3>Teléfono</h3>
                      <p>{user.phone || 'No especificado'}</p>
                    </div>
                  </div>

                  <div className="info-item">
                    <FaHome className="info-icon" />
                    <div>
                      <h3>Dirección</h3>
                      <p>{user.address || 'No especificada'}</p>
                    </div>
                  </div>

                  <div className="info-item">
                    <FaMapMarkerAlt className="info-icon" />
                    <div>
                      <h3>Ciudad</h3>
                      <p>{user.city || 'No especificada'}</p>
                    </div>
                  </div>

                  <div className="info-item">
                    <FaMapMarkerAlt className="info-icon" />
                    <div>
                      <h3>Código Postal</h3>
                      <p>{user.postal_code || 'No especificado'}</p>
                    </div>
                  </div>

                  <div className="info-item">
                    <FaIdCard className="info-icon" />
                    <div>
                      <h3>DNI/NIE</h3>
                      <p>{user.dni || 'No especificado'}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="profile-edit-form">
                  <div className="form-group">
                    <label htmlFor="full_name">Nombre completo</label>
                    <input
                      type="text"
                      id="full_name"
                      name="full_name"
                      value={editedUser.full_name || ''}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={editedUser.email || ''}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">Teléfono</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={editedUser.phone || ''}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="address">Dirección</label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={editedUser.address || ''}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="city">Ciudad</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={editedUser.city || ''}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="postal_code">Código Postal</label>
                    <input
                      type="text"
                      id="postal_code"
                      name="postal_code"
                      value={editedUser.postal_code || ''}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="dni">DNI/NIE</label>
                    <input
                      type="text"
                      id="dni"
                      name="dni"
                      value={editedUser.dni || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              )}
            </div>

            <button
              className="logout-button"
              onClick={handleLogout}
            >
              <FaSignOutAlt className="logout-icon" />
              <span>Cerrar sesión</span>
            </button>
          </div>
        )}

        {activeTab === 'wishlist' && (
          <div className="wishlist-section">
            <h2 className="section-title">
              <FaHeart className="section-icon" />
              Mi lista de deseos
            </h2>

            {wishlist.length === 0 ? (
              <div className="empty-state">
                <p>No tienes cursos en tu lista de deseos.</p>
                <Link to="/" className="browse-courses-link">
                  Explorar cursos
                </Link>
              </div>
            ) : (
              <div className="course-list">
                {wishlist.map(course => (
                  <div className="course-card" key={course.id}>
                    <img src={course.image} alt={course.title} className="course-image" />
                    <div className="course-info">
                      <h3 className="course-title">{course.title}</h3>
                      <p className="course-price">{course.price.toFixed(2)} €</p>
                    </div>
                    <div className="course-actions">
                      <button
                        className="action-button remove-button"
                        onClick={() => handleRemoveFromWishlist(course.id)}
                        title="Eliminar de la lista de deseos"
                      >
                        <FaTrash />
                      </button>
                      <button
                        className="action-button add-to-cart-button"
                        onClick={() => handleMoveToCart(course)}
                        title="Añadir al carrito"
                      >
                        <FaShoppingCart />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'cart' && (
          <div className="cart-section">
            <h2 className="section-title">
              <FaShoppingCart className="section-icon" />
              Mi carrito
            </h2>

            {cart.length === 0 ? (
              <div className="empty-state">
                <p>No tienes cursos en tu carrito.</p>
                <Link to="/" className="browse-courses-link">
                  Explorar cursos
                </Link>
              </div>
            ) : (
              <>
                <div className="course-list">
                  {cart.map(course => (
                    <div className="course-card" key={course.id}>
                      <img src={course.image} alt={course.title} className="course-image" />
                      <div className="course-info">
                        <h3 className="course-title">{course.title}</h3>
                        <p className="course-price">{course.price.toFixed(2)} €</p>
                      </div>
                      <div className="course-actions">
                        <button
                          className="action-button remove-button"
                          onClick={() => handleRemoveFromCart(course.id)}
                          title="Eliminar del carrito"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="cart-summary">
                  <div className="cart-total">
                    <span>Total:</span>
                    <span className="total-amount">{cartTotal.toFixed(2)} €</span>
                  </div>
                  <PaymentButton
                    courseId={cart.map(course => course.id).join(',')}
                    price={cartTotal}
                    buttonText="Proceder al pago"
                    className="checkout-button"
                  />
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === 'courses' && (
          <div className="my-courses-section">
            <h2 className="section-title">
              <FaGraduationCap className="section-icon" />
              Mis cursos
            </h2>

            {currentUser && currentUser.isNewUser ? (
              <div className="empty-state">
                <p>Aún no tienes cursos.</p>
                <p className="empty-state-subtitle">
                  Explora nuestro catálogo y adquiere cursos para comenzar tu aprendizaje.
                </p>
                <Link to="/" className="browse-courses-link">
                  Ver cursos disponibles
                </Link>
              </div>
            ) : (
              <MyCourses />
            )}
          </div>
        )}

        {activeTab === 'certificates' && (
          <div className="certificates-section">
            <h2 className="section-title">
              <FaCertificate className="section-icon" />
              Mis diplomas
            </h2>

            <div className="empty-state">
              <p>No tienes diplomas disponibles.</p>
              <p className="certificate-info">
                Completa tus cursos para obtener tus diplomas.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'sessions' && (
          <div className="sessions-section">
            <h2 className="section-title">
              <FaShieldAlt className="section-icon" />
              Mis sesiones
            </h2>

            <SessionsManager />
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;