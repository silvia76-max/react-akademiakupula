import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const [user, setUser] = useState(null);
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

    if (!token) {
      navigate('/login'); // 4. Redirigimos si no hay token
    } else {
      fetchProfile();
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token'); // 5. Eliminamos el token al cerrar sesión
    navigate('/login');
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