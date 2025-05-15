import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaSearch, FaPlus, FaEye, FaVideo, FaFileAlt, FaLink } from 'react-icons/fa';
import AdminSidebar from '../../components/admin/AdminSidebar';
import './CoursesManagement.css';

// Importar imágenes de cursos
import maquillajeImg from '../../assets/images/maquillaje.jpg';
import unasImg from '../../assets/images/unas.jpg';
import esteticaImg from '../../assets/images/estetica.jpg';
import manicuraImg from '../../assets/images/manicura.jpg';
import socialImg from '../../assets/images/social.jpg';
import extensionImg from '../../assets/images/extension.jpg';

const CoursesManagement = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  // Datos simulados para cursos
  const mockCourses = [
    {
      id: 1,
      slug: "curso-de-maquillaje-profesional",
      title: "Curso de Maquillaje Profesional",
      description: "Aprende técnicas de maquillaje artístico y desarrolla tu creatividad con los mejores productos.",
      image: maquillajeImg,
      duration: "60 horas",
      level: "Avanzado",
      price: 499.99,
      instructor: "Tania Calvo",
      status: "active",
      enrollments: 24,
      created_at: "2023-05-15T10:00:00",
      videos: [
        { id: 1, title: "Introducción al maquillaje profesional", duration: "15:30", url: "https://vimeo.com/123456789" },
        { id: 2, title: "Técnicas básicas de aplicación", duration: "22:45", url: "https://vimeo.com/123456790" },
        { id: 3, title: "Maquillaje para sesiones fotográficas", duration: "30:15", url: "https://vimeo.com/123456791" }
      ],
      materials: [
        { id: 1, title: "Guía de productos recomendados", type: "pdf" },
        { id: 2, title: "Plantillas de diseño", type: "pdf" }
      ]
    },
    {
      id: 2,
      slug: "curso-de-unas-esculpidas",
      title: "Curso de Uñas Esculpidas",
      description: "Domina el arte de las uñas acrílicas y gel. Técnicas profesionales para resultados perfectos.",
      image: unasImg,
      duration: "45 horas",
      level: "Intermedio",
      price: 399.99,
      instructor: "Tania Calvo",
      status: "active",
      enrollments: 18,
      created_at: "2023-06-20T14:30:00",
      videos: [
        { id: 4, title: "Preparación de uñas", duration: "18:20", url: "https://vimeo.com/123456792" },
        { id: 5, title: "Aplicación de acrílico", duration: "25:10", url: "https://vimeo.com/123456793" }
      ],
      materials: [
        { id: 3, title: "Lista de materiales necesarios", type: "pdf" }
      ]
    },
    {
      id: 3,
      slug: "estetica-integral",
      title: "Estética Integral",
      description: "Formación completa en tratamientos faciales y corporales. Todo lo que necesitas para ser profesional.",
      image: esteticaImg,
      duration: "120 horas",
      level: "Todos los niveles",
      price: 799.99,
      instructor: "Tania Calvo",
      status: "active",
      enrollments: 12,
      created_at: "2023-07-10T09:15:00",
      videos: [
        { id: 6, title: "Introducción a la estética integral", duration: "20:45", url: "https://vimeo.com/123456794" },
        { id: 7, title: "Análisis de piel", duration: "28:30", url: "https://vimeo.com/123456795" },
        { id: 8, title: "Tratamientos faciales básicos", duration: "35:15", url: "https://vimeo.com/123456796" }
      ],
      materials: [
        { id: 4, title: "Guía de diagnóstico facial", type: "pdf" },
        { id: 5, title: "Protocolos de tratamiento", type: "pdf" }
      ]
    },
    {
      id: 4,
      slug: "curso-de-manicura-y-pedicura",
      title: "Curso de Manicura y Pedicura",
      description: "Domina el arte y el cuidado de manos y pies. Aprende técnicas de spa y tratamientos especiales.",
      image: manicuraImg,
      duration: "30 horas",
      level: "Principiante",
      price: 299.99,
      instructor: "Tania Calvo",
      status: "active",
      enrollments: 30,
      created_at: "2023-08-05T11:45:00",
      videos: [
        { id: 9, title: "Preparación para manicura", duration: "15:20", url: "https://vimeo.com/123456797" },
        { id: 10, title: "Técnicas de limado y pulido", duration: "18:45", url: "https://vimeo.com/123456798" }
      ],
      materials: [
        { id: 6, title: "Guía de herramientas", type: "pdf" }
      ]
    },
    {
      id: 5,
      slug: "curso-de-maquillaje-social",
      title: "Curso de Maquillaje Social",
      description: "Descubre técnicas de maquillaje social para eventos, bodas y ocasiones especiales.",
      image: socialImg,
      duration: "40 horas",
      level: "Intermedio",
      price: 349.99,
      instructor: "Tania Calvo",
      status: "draft",
      enrollments: 0,
      created_at: "2023-09-15T13:30:00",
      videos: [
        { id: 11, title: "Maquillaje para eventos diurnos", duration: "22:10", url: "https://vimeo.com/123456799" },
        { id: 12, title: "Maquillaje para eventos nocturnos", duration: "24:35", url: "https://vimeo.com/123456800" }
      ],
      materials: [
        { id: 7, title: "Paletas de colores recomendadas", type: "pdf" }
      ]
    },
    {
      id: 6,
      slug: "curso-de-extension-de-pestanas",
      title: "Curso de Extensión de Pestañas",
      description: "Extensiones de pestañas de cero a cien. Aprende todas las técnicas: pelo a pelo, volumen ruso y más.",
      image: extensionImg,
      duration: "25 horas",
      level: "Avanzado",
      price: 449.99,
      instructor: "Tania Calvo",
      status: "active",
      enrollments: 15,
      created_at: "2023-10-01T10:00:00",
      videos: [
        { id: 13, title: "Introducción a las extensiones", duration: "16:40", url: "https://vimeo.com/123456801" },
        { id: 14, title: "Técnica pelo a pelo", duration: "28:15", url: "https://vimeo.com/123456802" },
        { id: 15, title: "Volumen ruso", duration: "32:50", url: "https://vimeo.com/123456803" }
      ],
      materials: [
        { id: 8, title: "Guía de productos y adhesivos", type: "pdf" },
        { id: 9, title: "Cuidados post-aplicación", type: "pdf" }
      ]
    }
  ];

  useEffect(() => {
    // Simulación de carga de datos desde el backend
    const fetchCourses = async () => {
      try {
        setLoading(true);
        // En una implementación real, aquí harías una llamada a la API
        // const response = await fetch('/api/admin/courses');
        // const data = await response.json();
        
        // Simulamos un retraso para la carga
        setTimeout(() => {
          setCourses(mockCourses);
          setLoading(false);
        }, 800);
      } catch (err) {
        console.error('Error al cargar los cursos:', err);
        setError('Error al cargar los cursos. Por favor, inténtalo de nuevo.');
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

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

  const handleDeleteCourse = (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este curso?')) {
      // En una implementación real, aquí harías una llamada a la API
      // await fetch(`/api/admin/courses/${id}`, { method: 'DELETE' });
      
      const updatedCourses = courses.filter(course => course.id !== id);
      setCourses(updatedCourses);
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
