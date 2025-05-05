// Profile.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/auth/profile', {
          method: 'GET',
          credentials: 'include', // ⚡ para enviar la cookie de sesión
        });

        if (res.status === 401) {
          navigate('/login');
        }

        const data = await res.json();
        if (res.ok) {
          setUser(data);
        } else {
          alert(data.message);
        }
      } catch (err) {
        console.error(err);
        alert('Error al cargar perfil');
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (res.ok) {
        alert('Sesión cerrada');
        navigate('/login');
      } else {
        const data = await res.json();
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert('Error al cerrar sesión');
    }
  };

  if (!user) return <p>Cargando perfil...</p>;

  return (
    <div>
      <h1>Bienvenido, {user.full_name}</h1>
      <p>Email: {user.email}</p>
      <p>Código Postal: {user.postal_code}</p>

      <button onClick={handleLogout}>Cerrar sesión</button>
    </div>
  );
}

export default Profile;
