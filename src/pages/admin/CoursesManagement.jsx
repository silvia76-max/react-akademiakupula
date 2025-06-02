import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaSearch, FaPlus, FaEye, FaVideo, FaFileAlt, FaLink } from 'react-icons/fa';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { getCourses, deleteCourse } from '../../services/adminService';
import './CoursesManagement.css';

const CoursesManagement = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();



  useEffect(() => {
    // Función para cargar los cursos desde la API
    const fetchCourses = async () => {
      try {
        setLoading(true);

        // Verificar si el usuario es administrador
        const userData = JSON.parse(localStorage.getItem('akademia_user_data') || '{}');
        if (!userData || !userData.isAdmin) {
          console.log('No es administrador, redirigiendo a la página principal...');
          navigate('/');
          return;
        }

        // Obtener los cursos usando el servicio adminService
        const data = await getCourses();
        console.log('Cursos obtenidos:', data);
        setCourses(data || []);
        setError(null);
      } catch (err) {
        console.error('Error al cargar los cursos:', err);
        setError('Error al cargar los cursos. Por favor, inténtalo de nuevo.');
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [navigate]);

  // Filtrar cursos según el término de búsqueda
  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.level.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = (e) => {
    e.preventDefault();
    // La búsqueda ya se realiza automáticamente con el filtro
  };

  const handleViewCourse = (course) => {
    setSelectedCourse(course);
    setShowModal(true);
  };

  const handleEditCourse = (id) => {
    // En una implementación real, aquí navegarías a la página de edición
    alert(`Editar curso con ID: ${id}`);
  };

  const handleDeleteCourse = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este curso?')) {
      try {
        setLoading(true);
        // Eliminar el curso usando el servicio adminService
        await deleteCourse(id);
        // Actualizar la lista de cursos
        const updatedCourses = courses.filter(course => course.id !== id);
        setCourses(updatedCourses);
        setError(null);
      } catch (err) {
        console.error(`Error al eliminar el curso ${id}:`, err);
        setError('Error al eliminar el curso. Por favor, inténtalo de nuevo.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleAddCourse = () => {
    // En una implementación real, aquí navegarías a la página de creación
    alert('Añadir nuevo curso');
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <div className="page-header">
          <h1>Gestión de Cursos</h1>
          <button
            className="add-button"
            onClick={handleAddCourse}
          >
            <FaPlus /> Nuevo Curso
          </button>
        </div>

        <div className="search-bar">
          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Buscar por título, descripción o nivel..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit">
              <FaSearch />
            </button>
          </form>
        </div>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading-spinner">Cargando...</div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Imagen</th>
                  <th>Título</th>
                  <th>Precio</th>
                  <th>Duración</th>
                  <th>Nivel</th>
                  <th>Estado</th>
                  <th>Inscripciones</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredCourses.map(course => (
                  <tr key={course.id}>
                    <td>{course.id}</td>
                    <td>
                      <img
                        src={course.image}
                        alt={course.title}
                        className="course-thumbnail"
                      />
                    </td>
                    <td>{course.title}</td>
                    <td>{course.price.toFixed(2)} €</td>
                    <td>{course.duration}</td>
                    <td>{course.level}</td>
                    <td>
                      <span className={`status-badge ${course.status}`}>
                        {course.status === 'active' ? 'Activo' : 'Borrador'}
                      </span>
                    </td>
                    <td>{course.enrollments}</td>
                    <td className="actions-cell">
                      <button
                        className="view-button"
                        onClick={() => handleViewCourse(course)}
                        title="Ver detalles"
                      >
                        <FaEye />
                      </button>
                      <button
                        className="edit-button"
                        onClick={() => handleEditCourse(course.id)}
                        title="Editar curso"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="delete-button"
                        onClick={() => handleDeleteCourse(course.id)}
                        title="Eliminar curso"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal para ver detalles del curso */}
        {showModal && selectedCourse && (
          <div className="modal-overlay">
            <div className="modal-content course-modal">
              <div className="modal-header">
                <h2>{selectedCourse.title}</h2>
                <button
                  className="close-button"
                  onClick={() => setShowModal(false)}
                >
                  &times;
                </button>
              </div>
              <div className="modal-body">
                <div className="course-image-container">
                  <img
                    src={selectedCourse.image}
                    alt={selectedCourse.title}
                    className="course-detail-image"
                  />
                </div>
                <div className="course-details">
                  <div className="detail-row">
                    <span className="detail-label">Instructor:</span>
                    <span className="detail-value">{selectedCourse.instructor}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Precio:</span>
                    <span className="detail-value">{selectedCourse.price.toFixed(2)} €</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Duración:</span>
                    <span className="detail-value">{selectedCourse.duration}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Nivel:</span>
                    <span className="detail-value">{selectedCourse.level}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Estado:</span>
                    <span className={`status-badge ${selectedCourse.status}`}>
                      {selectedCourse.status === 'active' ? 'Activo' : 'Borrador'}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Inscripciones:</span>
                    <span className="detail-value">{selectedCourse.enrollments}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Fecha de creación:</span>
                    <span className="detail-value">{new Date(selectedCourse.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="course-description">
                  <h3>Descripción</h3>
                  <p>{selectedCourse.description}</p>
                </div>
                <div className="course-content">
                  <h3>Contenido del curso</h3>
                  <div className="content-section">
                    <h4><FaVideo /> Videos ({selectedCourse.videos.length})</h4>
                    <ul className="content-list">
                      {selectedCourse.videos.map(video => (
                        <li key={video.id} className="content-item">
                          <div className="content-item-title">
                            <FaVideo className="content-icon" />
                            <span>{video.title}</span>
                          </div>
                          <div className="content-item-details">
                            <span className="content-duration">{video.duration}</span>
                            <a href={video.url} target="_blank" rel="noopener noreferrer" className="content-link">
                              <FaLink />
                            </a>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="content-section">
                    <h4><FaFileAlt /> Materiales ({selectedCourse.materials.length})</h4>
                    <ul className="content-list">
                      {selectedCourse.materials.map(material => (
                        <li key={material.id} className="content-item">
                          <div className="content-item-title">
                            <FaFileAlt className="content-icon" />
                            <span>{material.title}</span>
                          </div>
                          <div className="content-item-details">
                            <span className="content-type">{material.type.toUpperCase()}</span>
                            <button className="content-download">
                              Descargar
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesManagement;
