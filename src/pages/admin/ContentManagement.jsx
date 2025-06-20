import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaSearch, FaPlus, FaImage, FaVideo, FaQuoteRight, FaFilter } from 'react-icons/fa';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { getContents, deleteContent } from '../../services/contentService';
import './ContentManagement.css';

const ContentManagement = () => {
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [contentToDelete, setContentToDelete] = useState(null);
  const [filters, setFilters] = useState({
    section: '',
    type: '',
    activeOnly: true
  });
  const navigate = useNavigate();

  const fetchContents = async () => {
    try {
      setLoading(true);
      const data = await getContents(
        filters.section || null,
        filters.type || null,
        filters.activeOnly
      );
      setContents(data);
      setError(null);
    } catch (err) {
      console.error('Error al cargar contenido:', err);
      setError('Error al cargar el contenido. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  // Verificar si el usuario es administrador
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.is_admin) {
      navigate('/login');
    }
  }, [navigate]);

  const handleSearch = (e) => {
    e.preventDefault();
    // Filtrar contenido por término de búsqueda
    // Esto es una búsqueda local, ya que no tenemos un endpoint de búsqueda
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters({
      ...filters,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleEditContent = (contentId) => {
    navigate(`/admin/content/edit/${contentId}`);
  };

  const handleDeleteClick = (content) => {
    setContentToDelete(content);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!contentToDelete) return;
    
    try {
      await deleteContent(contentToDelete.id);
      setContents(contents.filter(content => content.id !== contentToDelete.id));
      setShowDeleteModal(false);
      setContentToDelete(null);
    } catch (err) {
      console.error('Error al eliminar contenido:', err);
      setError('Error al eliminar el contenido. Por favor, inténtalo de nuevo.');
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setContentToDelete(null);
  };

  // Filtrar contenido por término de búsqueda
  const filteredContents = contents.filter(content => 
    content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (content.description && content.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Función para renderizar el icono según el tipo de contenido
  const renderContentTypeIcon = (type) => {
    switch (type) {
      case 'image':
        return <FaImage className="content-type-icon image" />;
      case 'video':
        return <FaVideo className="content-type-icon video" />;
      case 'story':
      case 'testimonial':
        return <FaQuoteRight className="content-type-icon story" />;
      default:
        return null;
    }
  };

  return (
<<<<<<< HEAD
=======
    <div className="admin-layout">
      <AdminSidebar />
>>>>>>> 92ec14313c90033ee7aed81cb6133cfda4661041
      <div className="admin-content">
        <div className="page-header">
          <h1>Gestión de Contenido</h1>
          <button 
            className="add-button"
            onClick={() => navigate('/admin/content/new')}
          >
            <FaPlus /> Nuevo Contenido
          </button>
        </div>

        <div className="filters-container">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Buscar por título o descripción..."
              value={searchTerm}
              onChange={handleSearch}
            />
            <FaSearch className="search-icon" />
          </div>
          
          <div className="filter-options">
            <div className="filter-group">
              <label htmlFor="section">Sección:</label>
              <select 
                id="section" 
                name="section" 
                value={filters.section}
                onChange={handleFilterChange}
              >
                <option value="">Todas</option>
                <option value="home">Inicio</option>
                <option value="about">Sobre Nosotros</option>
                <option value="courses">Cursos</option>
                <option value="contact">Contacto</option>
                <option value="testimonials">Testimonios</option>
              </select>
            </div>
            
            <div className="filter-group">
              <label htmlFor="type">Tipo:</label>
              <select 
                id="type" 
                name="type" 
                value={filters.type}
                onChange={handleFilterChange}
              >
                <option value="">Todos</option>
                <option value="image">Imagen</option>
                <option value="video">Video</option>
                <option value="story">Historia</option>
                <option value="testimonial">Testimonio</option>
                <option value="banner">Banner</option>
                <option value="hero">Hero</option>
              </select>
            </div>
            
            <div className="filter-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="activeOnly"
                  checked={filters.activeOnly}
                  onChange={handleFilterChange}
                />
                Solo activos
              </label>
            </div>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading-spinner">Cargando...</div>
        ) : (
          <>
            {filteredContents.length === 0 ? (
              <div className="no-content-message">
                <p>No se encontró contenido con los filtros seleccionados.</p>
              </div>
            ) : (
              <div className="content-grid">
                {filteredContents.map(content => (
                  <div key={content.id} className="content-card">
                    <div className="content-preview">
                      {renderContentTypeIcon(content.content_type)}
                      {content.thumbnail_url || content.url ? (
                        <img 
                          src={content.thumbnail_url || content.url} 
                          alt={content.title}
                          className="content-thumbnail"
                        />
                      ) : (
                        <div className="content-placeholder">
                          {content.content_type === 'story' || content.content_type === 'testimonial' ? (
                            <p className="content-text-preview">{content.content_text?.substring(0, 100)}...</p>
                          ) : (
                            <span>Sin vista previa</span>
                          )}
                        </div>
                      )}
                      {!content.is_active && <div className="inactive-badge">Inactivo</div>}
                    </div>
                    
                    <div className="content-info">
                      <h3>{content.title}</h3>
                      <p className="content-section">Sección: {content.section}</p>
                      <p className="content-type">Tipo: {content.content_type}</p>
                      {content.description && (
                        <p className="content-description">{content.description.substring(0, 100)}...</p>
                      )}
                    </div>
                    
                    <div className="content-actions">
                      <button 
                        className="edit-button"
                        onClick={() => handleEditContent(content.id)}
                        title="Editar contenido"
                      >
                        <FaEdit />
                      </button>
                      <button 
                        className="delete-button"
                        onClick={() => handleDeleteClick(content)}
                        title="Eliminar contenido"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {showDeleteModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h2>Confirmar eliminación</h2>
              <p>¿Estás seguro de que deseas eliminar el contenido <strong>{contentToDelete?.title}</strong>?</p>
              <p>Esta acción no se puede deshacer.</p>
              <div className="modal-actions">
                <button className="cancel-button" onClick={cancelDelete}>
                  Cancelar
                </button>
                <button className="confirm-button" onClick={confirmDelete}>
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
<<<<<<< HEAD
=======
    </div>
>>>>>>> 92ec14313c90033ee7aed81cb6133cfda4661041
  );
};

export default ContentManagement;
