import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  FaHeart, FaShoppingCart, FaTrash, FaArrowRight, FaUser,
  FaCamera, FaPencilAlt, FaSave, FaTimes, FaSignOutAlt,
  FaHome, FaEnvelope, FaMapMarkerAlt, FaPhone, FaIdCard,
  FaGraduationCap, FaCertificate, FaUserCircle
} from 'react-icons/fa';
import { getProfile, logout, isAuthenticated } from '../services/authService';
import ProfileHeader from '../components/ProfileHeader';
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
  const [user, setUser] = useState({
    id: 1,
    full_name: 'Usuario de Prueba',
    email: 'usuario@ejemplo.com',
    postal_code: '28001',
    phone: '600123456',
    address: 'Calle Ejemplo 123',
    city: 'Madrid',
    dni: '12345678A'
  });
  const [activeTab, setActiveTab] = useState('profile');
  const [wishlist, setWishlist] = useState(wishlistData);
  const [cart, setCart] = useState(cartData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // Usamos un avatar por defecto en lugar del logo
  const [avatar, setAvatar] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({...user});
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Función para cerrar sesión
  const handleLogout = () => {
    logout();
    navigate('/');
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
  const saveChanges = () => {
    setUser({...editedUser});
    setIsEditing(false);
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
  const removeFromWishlist = (courseId) => {
    setWishlist(wishlist.filter(course => course.id !== courseId));
  };

  // Función para añadir un curso al carrito desde la lista de deseos
  const moveToCart = (course) => {
    if (!cart.some(item => item.id === course.id)) {
      setCart([...cart, course]);
    }
    removeFromWishlist(course.id);
  };

  // Función para eliminar un curso del carrito
  const removeFromCart = (courseId) => {
    setCart(cart.filter(course => course.id !== courseId));
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
          <div className="wishlist-container">
            <h2 className="section-title">Mi Lista de Deseos</h2>

            {wishlist.length === 0 ? (
              <div className="empty-state">
                <p>No tienes cursos en tu lista de deseos.</p>
                <Link to="/" className="action-link">Explorar cursos</Link>
              </div>
            ) : (
              <div className="course-list">
                {wishlist.map(course => (
                  <div key={course.id} className="course-item">
                    <div className="course-image-container">
                      <img src={course.image} alt={course.title} className="course-image" />
                    </div>
                    <div className="course-details">
                      <h3 className="course-title">{course.title}</h3>
                      <p className="course-price">{course.price.toFixed(2)}€</p>
                      <div className="course-actions">
                        <button
                          className="action-button view-button"
                          onClick={() => navigate(`/curso/${course.id}`)}
                        >
                          Ver curso
                        </button>
                        <button
                          className="action-button add-to-cart-button"
                          onClick={() => moveToCart(course)}
                        >
                          Añadir al carrito
                        </button>
                        <button
                          className="action-button remove-button"
                          onClick={() => removeFromWishlist(course.id)}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'cart' && (
          <div className="cart-container">
            <h2 className="section-title">Mi Carrito</h2>

            {cart.length === 0 ? (
              <div className="empty-state">
                <p>No tienes cursos en tu carrito.</p>
                <Link to="/" className="action-link">Explorar cursos</Link>
              </div>
            ) : (
              <>
                <div className="course-list">
                  {cart.map(course => (
                    <div key={course.id} className="course-item">
                      <div className="course-image-container">
                        <img src={course.image} alt={course.title} className="course-image" />
                      </div>
                      <div className="course-details">
                        <h3 className="course-title">{course.title}</h3>
                        <p className="course-price">{course.price.toFixed(2)}€</p>
                        <div className="course-actions">
                          <button
                            className="action-button view-button"
                            onClick={() => navigate(`/curso/${course.id}`)}
                          >
                            Ver curso
                          </button>
                          <button
                            className="action-button remove-button"
                            onClick={() => removeFromCart(course.id)}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="cart-summary">
                  <div className="cart-total">
                    <span>Total:</span>
                    <span className="total-amount">{cartTotal.toFixed(2)}€</span>
                  </div>
                  <button className="checkout-button">
                    Proceder al pago <FaArrowRight className="button-icon" />
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === 'courses' && (
          <div className="courses-container">
            <h2 className="section-title">Mis Cursos</h2>
            <div className="empty-state">
              <p>No tienes cursos adquiridos todavía.</p>
              <Link to="/" className="action-link">Explorar cursos</Link>
            </div>
          </div>
        )}

        {activeTab === 'certificates' && (
          <div className="certificates-container">
            <h2 className="section-title">Mis Diplomas</h2>
            <div className="empty-state">
              <p>No tienes diplomas disponibles todavía.</p>
              <p className="empty-state-subtitle">Completa tus cursos para obtener tus diplomas.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
