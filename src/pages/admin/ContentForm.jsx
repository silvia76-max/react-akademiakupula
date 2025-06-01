import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaSave, FaArrowLeft, FaUpload, FaImage, FaVideo, FaQuoteRight } from 'react-icons/fa';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { getContent, createContent, updateContent } from '../../services/contentService';
import './ContentForm.css';

const ContentForm = () => {
  const { contentId } = useParams();
  const navigate = useNavigate();
  const isNewContent = contentId === 'new';
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content_type: 'image',
    section: 'home',
    content_text: '',
    order: 0,
    is_active: true,
    duration: '',
    author_name: '',
    author_title: ''
  });
  
  const [files, setFiles] = useState({
    file: null,
    thumbnail: null,
    author_image: null
  });
  
  const [previews, setPreviews] = useState({
    file: null,
    thumbnail: null,
    author_image: null
  });
  
  const [loading, setLoading] = useState(!isNewContent);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  
  useEffect(() => {
    const fetchContentData = async () => {
      if (isNewContent) return;
      
      try {
        const contentData = await getContent(contentId);
        setFormData({
          title: contentData.title || '',
          description: contentData.description || '',
          content_type: contentData.content_type || 'image',
          section: contentData.section || 'home',
          content_text: contentData.content_text || '',
          order: contentData.order || 0,
          is_active: contentData.is_active !== undefined ? contentData.is_active : true,
          duration: contentData.duration || '',
          author_name: contentData.author_name || '',
          author_title: contentData.author_title || ''
        });
        
        // Establecer previews para archivos existentes
        setPreviews({
          file: contentData.url || null,
          thumbnail: contentData.thumbnail_url || null,
          author_image: contentData.author_image_url || null
        });
      } catch (err) {
        console.error('Error al cargar datos del contenido:', err);
        setError('Error al cargar los datos del contenido. Por favor, inténtalo de nuevo.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchContentData();
  }, [contentId, isNewContent]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      const file = files[0];
      setFiles(prev => ({
        ...prev,
        [name]: file
      }));
      
      // Crear URL para vista previa
      const previewUrl = URL.createObjectURL(file);
      setPreviews(prev => ({
        ...prev,
        [name]: previewUrl
      }));
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      // Crear FormData para enviar archivos
      const formDataToSend = new FormData();
      
      // Añadir campos de texto
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });
      
      // Añadir archivos si existen
      Object.keys(files).forEach(key => {
        if (files[key]) {
          formDataToSend.append(key, files[key]);
        }
      });
      
      if (isNewContent) {
        await createContent(formDataToSend);
        setSuccessMessage('Contenido creado correctamente');
      } else {
        await updateContent(contentId, formDataToSend);
        setSuccessMessage('Contenido actualizado correctamente');
      }
      
      // Redirigir después de un breve retraso
      setTimeout(() => {
        navigate('/admin/content');
      }, 2000);
    } catch (err) {
      console.error('Error al guardar contenido:', err);
      setError('Error al guardar los datos del contenido. Por favor, inténtalo de nuevo.');
    } finally {
      setSaving(false);
    }
  };
  
  // Determinar qué campos mostrar según el tipo de contenido
  const showTextContent = ['story', 'testimonial'].includes(formData.content_type);
  const showFileUpload = ['image', 'video', 'banner', 'hero'].includes(formData.content_type);
  const showThumbnail = formData.content_type === 'video';
  const showAuthorFields = formData.content_type === 'testimonial';
  const showDuration = formData.content_type === 'video';
  
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
          <h1>{isNewContent ? 'Nuevo Contenido' : 'Editar Contenido'}</h1>
          <button 
            className="back-button"
            onClick={() => navigate('/admin/content')}
          >
            <FaArrowLeft /> Volver
          </button>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}
        
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <div className="form-section">
              <h2>Información Básica</h2>
              
              <div className="form-group">
                <label htmlFor="title">Título *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="description">Descripción</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="content_type">Tipo de Contenido *</label>
                  <select
                    id="content_type"
                    name="content_type"
                    value={formData.content_type}
                    onChange={handleChange}
                    required
                  >
                    <option value="image">Imagen</option>
                    <option value="video">Video</option>
                    <option value="story">Historia</option>
                    <option value="testimonial">Testimonio</option>
                    <option value="banner">Banner</option>
                    <option value="hero">Hero</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="section">Sección *</label>
                  <select
                    id="section"
                    name="section"
                    value={formData.section}
                    onChange={handleChange}
                    required
                  >
                    <option value="home">Inicio</option>
                    <option value="about">Sobre Nosotros</option>
                    <option value="courses">Cursos</option>
                    <option value="contact">Contacto</option>
                    <option value="testimonials">Testimonios</option>
                    <option value="profile">Perfil</option>
                    <option value="course_detail">Detalle de Curso</option>
                  </select>
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="order">Orden</label>
                  <input
                    type="number"
                    id="order"
                    name="order"
                    value={formData.order}
                    onChange={handleChange}
                    min="0"
                  />
                </div>
                
                <div className="form-group checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      name="is_active"
                      checked={formData.is_active}
                      onChange={handleChange}
                    />
                    Activo
                  </label>
                </div>
              </div>
            </div>
            
            {showTextContent && (
              <div className="form-section">
                <h2>Contenido de Texto</h2>
                
                <div className="form-group">
                  <label htmlFor="content_text">Texto *</label>
                  <textarea
                    id="content_text"
                    name="content_text"
                    value={formData.content_text}
                    onChange={handleChange}
                    rows="6"
                    required={showTextContent}
                  />
                </div>
              </div>
            )}
            
            {showFileUpload && (
              <div className="form-section">
                <h2>Archivo</h2>
                
                <div className="form-group file-upload">
                  <label htmlFor="file">
                    {formData.content_type === 'image' || formData.content_type === 'banner' || formData.content_type === 'hero' ? 'Imagen' : 'Video'}
                    {isNewContent ? ' *' : ''}
                  </label>
                  
                  <div className="file-input-container">
                    <input
                      type="file"
                      id="file"
                      name="file"
                      onChange={handleFileChange}
                      accept={formData.content_type === 'video' ? 'video/*' : 'image/*'}
                      required={isNewContent && showFileUpload}
                      className="file-input"
                    />
                    <label htmlFor="file" className="file-label">
                      <FaUpload /> Seleccionar archivo
                    </label>
                    <span className="file-name">
                      {files.file ? files.file.name : 'Ningún archivo seleccionado'}
                    </span>
                  </div>
                  
                  {previews.file && (
                    <div className="file-preview">
                      {formData.content_type === 'video' ? (
                        <video src={previews.file} controls className="preview-media" />
                      ) : (
                        <img src={previews.file} alt="Vista previa" className="preview-media" />
                      )}
                    </div>
                  )}
                </div>
                
                {showThumbnail && (
                  <div className="form-group file-upload">
                    <label htmlFor="thumbnail">Miniatura</label>
                    
                    <div className="file-input-container">
                      <input
                        type="file"
                        id="thumbnail"
                        name="thumbnail"
                        onChange={handleFileChange}
                        accept="image/*"
                        className="file-input"
                      />
                      <label htmlFor="thumbnail" className="file-label">
                        <FaUpload /> Seleccionar miniatura
                      </label>
                      <span className="file-name">
                        {files.thumbnail ? files.thumbnail.name : 'Ningún archivo seleccionado'}
                      </span>
                    </div>
                    
                    {previews.thumbnail && (
                      <div className="file-preview">
                        <img src={previews.thumbnail} alt="Vista previa de miniatura" className="preview-media" />
                      </div>
                    )}
                  </div>
                )}
                
                {showDuration && (
                  <div className="form-group">
                    <label htmlFor="duration">Duración (segundos)</label>
                    <input
                      type="number"
                      id="duration"
                      name="duration"
                      value={formData.duration}
                      onChange={handleChange}
                      min="0"
                    />
                  </div>
                )}
              </div>
            )}
            
            {showAuthorFields && (
              <div className="form-section">
                <h2>Información del Autor</h2>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="author_name">Nombre del Autor</label>
                    <input
                      type="text"
                      id="author_name"
                      name="author_name"
                      value={formData.author_name}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="author_title">Título/Profesión</label>
                    <input
                      type="text"
                      id="author_title"
                      name="author_title"
                      value={formData.author_title}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                
                <div className="form-group file-upload">
                  <label htmlFor="author_image">Imagen del Autor</label>
                  
                  <div className="file-input-container">
                    <input
                      type="file"
                      id="author_image"
                      name="author_image"
                      onChange={handleFileChange}
                      accept="image/*"
                      className="file-input"
                    />
                    <label htmlFor="author_image" className="file-label">
                      <FaUpload /> Seleccionar imagen
                    </label>
                    <span className="file-name">
                      {files.author_image ? files.author_image.name : 'Ningún archivo seleccionado'}
                    </span>
                  </div>
                  
                  {previews.author_image && (
                    <div className="file-preview author-preview">
                      <img src={previews.author_image} alt="Vista previa de autor" className="preview-media" />
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <div className="form-actions">
              <button 
                type="button" 
                className="cancel-button"
                onClick={() => navigate('/admin/content')}
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

export default ContentForm;
