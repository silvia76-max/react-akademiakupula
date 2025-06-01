import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaSave, FaArrowLeft } from 'react-icons/fa';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { getUser, updateUser } from '../../services/adminService.js';
import './UserForm.css';

const UserForm = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const isNewUser = userId === 'new';
  
const [formData, setFormData] = useState({
  full_name: '',
  email: '',
  postal_code: '',
  is_admin: false,
  is_confirmed: false,
  role_id: null
});
  
  const [loading, setLoading] = useState(!isNewUser);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  
  useEffect(() => {
    const fetchUserData = async () => {
      if (isNewUser) return;
      
      try {
        const userData = await getUser(userId);
        setFormData({
          full_name: userData.full_name,
          email: userData.email,
          postal_code: userData.postal_code,
          is_admin: userData.is_admin,
          is_confirmed: userData.is_confirmed,
          role_id: userData.role_id
        });
      } catch (err) {
        console.error('Error al cargar datos del usuario:', err);
        setError('Error al cargar los datos del usuario. Por favor, inténtalo de nuevo.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [userId, isNewUser]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      if (isNewUser) {
        // Implementar creación de usuario
        console.log('Crear nuevo usuario:', formData);
      } else {
        await updateUser(userId, formData);
        setSuccessMessage('Usuario actualizado correctamente');
      }
    } catch (err) {
      console.error('Error al guardar usuario:', err);
      setError('Error al guardar los datos del usuario. Por favor, inténtalo de nuevo.');
    } finally {
      setSaving(false);
    }
  };
  
  if (loading) {
    return (
      <div className="admin-layout">
        <AdminSidebar />
        <div className="admin-content">
          <div className="loading-spinner">Cargando...</div>
        </div>
      </div>
    );
  }
  
  return (
      <div className="admin-content">
        <div className="page-header">
          <h1>{isNewUser ? 'Nuevo Usuario' : 'Editar Usuario'}</h1>
          <button 
            className="back-button"
            onClick={() => navigate('/admin/users')}
          >
            <FaArrowLeft /> Volver
          </button>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}
        
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="full_name">Nombre completo</label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="postal_code">Código Postal</label>
              <input
                type="text"
                id="postal_code"
                name="postal_code"
                value={formData.postal_code}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="is_admin"
                  checked={formData.is_admin}
                  onChange={handleChange}
                />
                Administrador
              </label>
            </div>
            
            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="is_confirmed"
                  checked={formData.is_confirmed}
                  onChange={handleChange}
                />
                Cuenta confirmada
              </label>
            </div>
            
            <div className="form-actions">
              <button 
                type="button" 
                className="cancel-button"
                onClick={() => navigate('/admin/users')}
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                className="save-button"
                disabled={saving}
              >
                {saving ? 'Guardando...' : (
                  <>
                    <FaSave /> Guardar
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
  );
};

export default UserForm;
