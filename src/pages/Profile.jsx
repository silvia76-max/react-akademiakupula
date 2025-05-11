import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaHeart, FaShoppingCart, FaTrash, FaArrowRight } from 'react-icons/fa';
import '../styles/Profile.css';

// Importamos las imágenes de los cursos (simulación)
import maquillajeImg from '../assets/images/unas-kupula3.jpg';
import unasImg from '../assets/images/unas-kupula5.jpg';
import esteticaImg from '../assets/images/unasdeco001.jpg';
import manicuraImg from '../assets/images/unas-kupula2.jpg';
import socialImg from '../assets/images/unas-kupula26.jpg';
import extensionImg from '../assets/images/unas-kupula27.jpg';

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
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [wishlist, setWishlist] = useState(wishlistData);
  const [cart, setCart] = useState(cartData);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token'); // 1. Obtenemos el token JWT

    const fetchProfile = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/auth/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}` // 2. Enviamos el token en headers
          }
        });

        if (res.status === 401) {
          localStorage.removeItem('token'); // 3. Limpiamos el token si no es válido
          navigate('/login');
          return;
        }

        const data = await res.json();
        console.log('Respuesta del perfil:', data);

        if (res.ok) {
          // Verificar si los datos vienen en el formato esperado
          if (data.data) {
            // Si los datos vienen en un objeto 'data'
            console.log('Usando data.data:', data.data);
            setUser(data.data);
          } else {
            // Si los datos vienen directamente
            console.log('Usando data directamente:', data);
            setUser(data);
          }
        } else {
          console.error('Error en la respuesta:', data);
          alert(data.message || 'Error al cargar el perfil');
        }
      } catch (err) {
        console.error(err);
        alert('Error al cargar perfil');
      }
    };

    // Función para obtener la lista de deseos
    const fetchWishlist = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/wishlist', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setWishlist(data.wishlist);
          }
        }
      } catch (error) {
        console.error('Error al obtener la lista de deseos:', error);
      }
    };

    // Función para obtener el carrito
    const fetchCart = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/cart', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setCart(data.cart);
          }
        }
      } catch (error) {
        console.error('Error al obtener el carrito:', error);
      }
    };

    if (!token) {
      navigate('/login'); // 4. Redirigimos si no hay token
    } else {
      fetchProfile();
      fetchWishlist();
      fetchCart();
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token'); // 5. Eliminamos el token al cerrar sesión
    navigate('/login');
  };

  // Función para eliminar un curso de la lista de deseos
  const removeFromWishlist = async (courseId) => {
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`http://localhost:5000/api/wishlist/${courseId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        // Actualizar el estado local solo si la operación en el servidor fue exitosa
        setWishlist(wishlist.filter(course => course.id !== courseId));
      } else {
        console.error('Error al eliminar el curso de la lista de deseos');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Función para añadir un curso al carrito desde la lista de deseos
  const moveToCart = async (course) => {
    const token = localStorage.getItem('token');

    try {
      // Añadir al carrito
      const response = await fetch('http://localhost:5000/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          course_id: course.id
        })
      });

      if (response.ok) {
        // La API ya elimina el curso de la lista de deseos al añadirlo al carrito,
        // pero actualizamos el estado local para reflejar los cambios inmediatamente
        setCart([...cart, course]);
        setWishlist(wishlist.filter(item => item.id !== course.id));
      } else {
        console.error('Error al añadir el curso al carrito');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Función para eliminar un curso del carrito
  const removeFromCart = async (courseId) => {
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`http://localhost:5000/api/cart/${courseId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        // Actualizar el estado local solo si la operación en el servidor fue exitosa
        setCart(cart.filter(course => course.id !== courseId));
      } else {
        console.error('Error al eliminar el curso del carrito');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Calcular el total del carrito
  const cartTotal = cart.reduce((total, course) => total + course.price, 0);

  if (!user) return <p>Cargando perfil...</p>;

  return (
    <div className="profile-container">
      <div className="profile-tabs">
        <button
          className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          Mi Perfil
        </button>
        <button
          className={`tab-button ${activeTab === 'wishlist' ? 'active' : ''}`}
          onClick={() => setActiveTab('wishlist')}
        >
          <FaHeart className="tab-icon" /> Lista de Deseos ({wishlist.length})
        </button>
        <button
          className={`tab-button ${activeTab === 'cart' ? 'active' : ''}`}
          onClick={() => setActiveTab('cart')}
        >
          <FaShoppingCart className="tab-icon" /> Carrito ({cart.length})
        </button>
      </div>

      {activeTab === 'profile' && (
        <div className="profile-card">
          <h1 className="profile-title">Bienvenido, {user.full_name}</h1>
          <div className="profile-info">
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Código Postal:</strong> {user.postal_code}</p>
          </div>
          <button className="logout-button" onClick={handleLogout}>Cerrar sesión</button>
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
    </div>
  );
}

export default Profile;