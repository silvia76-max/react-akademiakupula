import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaSearch, FaPlus, FaEye } from 'react-icons/fa';
import { getCourses, deleteCourse } from '../../services/adminService.js';
import './CoursesManagement.css';

const CoursesManagement = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const data = await getCourses();
        setCourses(data || []);
        setError(null);
      } catch (err) {
        setError('Error al cargar los cursos. Por favor, inténtalo de nuevo.');
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Filtrar cursos según el término de búsqueda
  const filteredCourses = courses.filter(course =>
    (course.titulo || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (course.descripcion || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (course.nivel || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = (e) => {
    e.preventDefault();
  };

  const handleViewCourse = (course) => {
    setSelectedCourse(course);
    setShowModal(true);
  };

  const handleEditCourse = (id) => {
    alert(`Editar curso con ID: ${id}`);
  };

  const handleDeleteCourse = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este curso?')) {
      try {
        setLoading(true);
        await deleteCourse(id);
        setCourses(courses.filter(course => course.id !== id));
        setError(null);
      } catch (err) {
        setError('Error al eliminar el curso. Por favor, inténtalo de nuevo.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleAddCourse = () => {
    alert('Añadir nuevo curso');
  };

  return (
    <div className="admin-content">
      <div className="page-header">
        <h1>Gestión de Cursos</h1>
        <button className="add-button" onClick={handleAddCourse}>
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
                <th>Instructor</th>
                <th>Destacado</th>
                <th>Activo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredCourses.map(course => (
                <tr key={course.id}>
                  <td>{course.id}</td>
                  <td>
                    {course.imagen_url ? (
                      <img
                        src={course.imagen_url}
                        alt={course.titulo}
                        className="course-thumbnail"
                      />
                    ) : null}
                  </td>
                  <td>{course.titulo}</td>
                  <td>{course.precio ? course.precio.toFixed(2) : '0.00'} €</td>
                  <td>{course.duracion}</td>
                  <td>{course.nivel}</td>
                  <td>{course.instructor}</td>
                  <td>{course.destacado ? 'Sí' : 'No'}</td>
                  <td>{course.activo ? 'Sí' : 'No'}</td>
                  <td className="actions-cell">
                    <button className="view-button" onClick={() => handleViewCourse(course)} title="Ver detalles">
                      <FaEye />
                    </button>
                    <button className="edit-button" onClick={() => handleEditCourse(course.id)} title="Editar curso">
                      <FaEdit />
                    </button>
                    <button className="delete-button" onClick={() => handleDeleteCourse(course.id)} title="Eliminar curso">
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
              <h2>{selectedCourse.titulo}</h2>
              <button className="close-button" onClick={() => setShowModal(false)}>
                &times;
              </button>
            </div>
            <div className="modal-body">
              <div className="course-image-container">
                {selectedCourse.imagen_url && (
                  <img
                    src={selectedCourse.imagen_url}
                    alt={selectedCourse.titulo}
                    className="course-detail-image"
                  />
                )}
              </div>
              <div className="course-details">
                <div className="detail-row">
                  <span className="detail-label">Instructor:</span>
                  <span className="detail-value">{selectedCourse.instructor}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Precio:</span>
                  <span className="detail-value">{selectedCourse.precio ? selectedCourse.precio.toFixed(2) : '0.00'} €</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Duración:</span>
                  <span className="detail-value">{selectedCourse.duracion}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Nivel:</span>
                  <span className="detail-value">{selectedCourse.nivel}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Destacado:</span>
                  <span className="detail-value">{selectedCourse.destacado ? 'Sí' : 'No'}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Activo:</span>
                  <span className="detail-value">{selectedCourse.activo ? 'Sí' : 'No'}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Fecha de creación:</span>
                  <span className="detail-value">{selectedCourse.created_at ? new Date(selectedCourse.created_at).toLocaleDateString() : ''}</span>
                </div>
              </div>
              <div className="course-description">
                <h3>Descripción</h3>
                <p>{selectedCourse.descripcion}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursesManagement;
