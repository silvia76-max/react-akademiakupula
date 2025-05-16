import React, { useState, useEffect } from 'react';
import { FaPlay, FaCheck, FaDownload, FaLock, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import VimeoPlayer from '../VimeoPlayer';
import '../../styles/MyCourses.css';

const MyCourses = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [completedVideos, setCompletedVideos] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const [editingMaterial, setEditingMaterial] = useState(null);

  // Datos simulados para cursos inscritos
  const mockEnrolledCourses = [
    {
      id: 1,
      title: 'Curso de Maquillaje Profesional',
      image: '/src/assets/images/maquillaje.jpg',
      progress: 35,
      instructor: 'Tania Calvo',
      enrollmentDate: '2023-09-15T10:00:00',
      videos: [
        { id: 1, title: 'Introducción al maquillaje profesional', duration: '15:30', completed: true, url: '824804225' },
        { id: 2, title: 'Técnicas básicas de aplicación', duration: '22:45', completed: false, url: '824804225' },
        { id: 3, title: 'Maquillaje para sesiones fotográficas', duration: '30:15', completed: false, url: '824804225' }
      ],
      materials: [
        { id: 1, title: 'Guía de productos recomendados', type: 'pdf', url: '#' },
        { id: 2, title: 'Plantillas de diseño', type: 'pdf', url: '#' }
      ]
    },
    {
      id: 2,
      title: 'Curso de Uñas Esculpidas',
      image: '/src/assets/images/unas.jpg',
      progress: 60,
      instructor: 'Tania Calvo',
      enrollmentDate: '2023-08-20T14:30:00',
      videos: [
        { id: 4, title: 'Preparación de uñas', duration: '18:20', completed: true, url: '824804225' },
        { id: 5, title: 'Aplicación de acrílico', duration: '25:10', completed: true, url: '824804225' },
        { id: 6, title: 'Diseños básicos', duration: '20:05', completed: false, url: '824804225' }
      ],
      materials: [
        { id: 3, title: 'Lista de materiales necesarios', type: 'pdf', url: '#' }
      ]
    }
  ];

  useEffect(() => {
    // Simulación de carga de datos desde el backend
    const fetchEnrolledCourses = async () => {
      try {
        setLoading(true);
        // En una implementación real, aquí harías una llamada a la API
        // const response = await fetch('/api/user/enrolled-courses');
        // const data = await response.json();

        // Verificar si el usuario es administrador
        const userData = JSON.parse(localStorage.getItem('akademia_user_data') || '{}');
        const adminStatus = userData && userData.isAdmin;
        setIsAdmin(adminStatus);

        console.log('Estado de administrador:', adminStatus);

        // Simulamos un retraso para la carga
        setTimeout(() => {
          setEnrolledCourses(mockEnrolledCourses);
          setSelectedCourse(mockEnrolledCourses[0]);

          // Cargar videos completados desde localStorage
          const savedCompletedVideos = localStorage.getItem('completedVideos');
          if (savedCompletedVideos) {
            setCompletedVideos(JSON.parse(savedCompletedVideos));
          }

          setLoading(false);
        }, 800);
      } catch (err) {
        console.error('Error al cargar los cursos inscritos:', err);
        setError('Error al cargar tus cursos. Por favor, inténtalo de nuevo.');
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, []);

  // Marcar un video como completado
  const handleVideoComplete = (videoId) => {
    if (!completedVideos.includes(videoId)) {
      const updatedCompletedVideos = [...completedVideos, videoId];
      setCompletedVideos(updatedCompletedVideos);

      // Guardar en localStorage
      localStorage.setItem('completedVideos', JSON.stringify(updatedCompletedVideos));

      // Actualizar el progreso del curso
      updateCourseProgress(selectedCourse.id, videoId);
    }
  };

  // Actualizar el progreso del curso
  const updateCourseProgress = (courseId, videoId) => {
    const updatedCourses = enrolledCourses.map(course => {
      if (course.id === courseId) {
        // Actualizar el estado de completado del video
        const updatedVideos = course.videos.map(video => {
          if (video.id === videoId) {
            return { ...video, completed: true };
          }
          return video;
        });

        // Calcular el nuevo progreso
        const totalVideos = updatedVideos.length;
        const completedCount = updatedVideos.filter(video => video.completed).length;
        const newProgress = Math.round((completedCount / totalVideos) * 100);

        return {
          ...course,
          videos: updatedVideos,
          progress: newProgress
        };
      }
      return course;
    });

    setEnrolledCourses(updatedCourses);

    // Actualizar el curso seleccionado si es necesario
    if (selectedCourse && selectedCourse.id === courseId) {
      const updatedSelectedCourse = updatedCourses.find(course => course.id === courseId);
      setSelectedCourse(updatedSelectedCourse);
    }
  };

  // Seleccionar un curso
  const handleSelectCourse = (course) => {
    setSelectedCourse(course);
    setSelectedVideo(null);
  };

  // Seleccionar un video
  const handleSelectVideo = (video) => {
    setSelectedVideo(video);
  };

  // Descargar material
  const handleDownloadMaterial = (material) => {
    // En una implementación real, aquí descargarías el archivo
    alert(`Descargando ${material.title}`);
  };

  // Verificar si un video está completado
  const isVideoCompleted = (videoId) => {
    return completedVideos.includes(videoId) ||
           (selectedCourse && selectedCourse.videos.find(v => v.id === videoId)?.completed);
  };

  // Funciones de administración

  // Añadir un nuevo video
  const handleAddVideo = () => {
    if (!selectedCourse) return;

    const newVideo = {
      id: Date.now(), // ID único basado en timestamp
      title: 'Nuevo video',
      duration: '00:00',
      completed: false,
      url: '824804225' // URL de Vimeo por defecto
    };

    const updatedCourse = {
      ...selectedCourse,
      videos: [...selectedCourse.videos, newVideo]
    };

    // Actualizar el curso seleccionado
    setSelectedCourse(updatedCourse);

    // Actualizar la lista de cursos
    const updatedCourses = enrolledCourses.map(course =>
      course.id === selectedCourse.id ? updatedCourse : course
    );

    setEnrolledCourses(updatedCourses);
    setEditingVideo(newVideo);
    setIsEditing(true);

    alert('Video añadido. Ahora puedes editar sus detalles.');
  };

  // Editar un video
  const handleEditVideo = (video) => {
    setEditingVideo(video);
    setIsEditing(true);
  };

  // Eliminar un video
  const handleDeleteVideo = (videoId) => {
    if (!selectedCourse) return;

    if (confirm('¿Estás seguro de que quieres eliminar este video?')) {
      const updatedVideos = selectedCourse.videos.filter(v => v.id !== videoId);

      const updatedCourse = {
        ...selectedCourse,
        videos: updatedVideos
      };

      // Actualizar el curso seleccionado
      setSelectedCourse(updatedCourse);

      // Actualizar la lista de cursos
      const updatedCourses = enrolledCourses.map(course =>
        course.id === selectedCourse.id ? updatedCourse : course
      );

      setEnrolledCourses(updatedCourses);

      alert('Video eliminado correctamente.');
    }
  };

  // Añadir un nuevo material
  const handleAddMaterial = () => {
    if (!selectedCourse) return;

    const newMaterial = {
      id: Date.now(), // ID único basado en timestamp
      title: 'Nuevo material',
      type: 'pdf',
      url: '#'
    };

    const updatedCourse = {
      ...selectedCourse,
      materials: [...selectedCourse.materials, newMaterial]
    };

    // Actualizar el curso seleccionado
    setSelectedCourse(updatedCourse);

    // Actualizar la lista de cursos
    const updatedCourses = enrolledCourses.map(course =>
      course.id === selectedCourse.id ? updatedCourse : course
    );

    setEnrolledCourses(updatedCourses);
    setEditingMaterial(newMaterial);
    setIsEditing(true);

    alert('Material añadido. Ahora puedes editar sus detalles.');
  };

  // Editar un material
  const handleEditMaterial = (material) => {
    setEditingMaterial(material);
    setIsEditing(true);
  };

  // Eliminar un material
  const handleDeleteMaterial = (materialId) => {
    if (!selectedCourse) return;

    if (confirm('¿Estás seguro de que quieres eliminar este material?')) {
      const updatedMaterials = selectedCourse.materials.filter(m => m.id !== materialId);

      const updatedCourse = {
        ...selectedCourse,
        materials: updatedMaterials
      };

      // Actualizar el curso seleccionado
      setSelectedCourse(updatedCourse);

      // Actualizar la lista de cursos
      const updatedCourses = enrolledCourses.map(course =>
        course.id === selectedCourse.id ? updatedCourse : course
      );

      setEnrolledCourses(updatedCourses);

      alert('Material eliminado correctamente.');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando tus cursos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button
          className="retry-button"
          onClick={() => window.location.reload()}
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (enrolledCourses.length === 0) {
    return (
      <div className="empty-state">
        <h3>No estás inscrito en ningún curso</h3>
        <p className="empty-state-subtitle">Explora nuestro catálogo y encuentra el curso perfecto para ti</p>
        <a href="/cursos" className="browse-courses-link">Ver cursos disponibles</a>
      </div>
    );
  }

  return (
    <div className="my-courses-container">
      <div className="courses-sidebar">
        <h3 className="sidebar-title">Mis Cursos</h3>
        <ul className="course-list-sidebar">
          {enrolledCourses.map(course => (
            <li
              key={course.id}
              className={`course-item-sidebar ${selectedCourse && selectedCourse.id === course.id ? 'active' : ''}`}
              onClick={() => handleSelectCourse(course)}
            >
              <div className="course-item-content">
                <h4 className="course-item-title">{course.title}</h4>
                <div className="course-progress-container">
                  <div className="course-progress-bar">
                    <div
                      className="course-progress-fill"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                  <span className="course-progress-text">{course.progress}%</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="course-content">
        {selectedCourse && (
          <>
            <div className="course-header">
              <h2 className="course-title">{selectedCourse.title}</h2>
              <div className="course-meta">
                <span className="course-instructor">Instructor: {selectedCourse.instructor}</span>
                <span className="course-enrollment-date">
                  Inscrito el: {new Date(selectedCourse.enrollmentDate).toLocaleDateString()}
                </span>
              </div>
              <div className="course-progress-container large">
                <div className="course-progress-bar">
                  <div
                    className="course-progress-fill"
                    style={{ width: `${selectedCourse.progress}%` }}
                  ></div>
                </div>
                <span className="course-progress-text">{selectedCourse.progress}% completado</span>
              </div>
            </div>

            {selectedVideo ? (
              <div className="video-player-section">
                <div className="vimeo-player-container">
                  <VimeoPlayer
                    videoId={selectedVideo.url}
                    title={selectedVideo.title}
                    onComplete={() => handleVideoComplete(selectedVideo.id)}
                  />
                </div>
                <button
                  className="back-to-list-button"
                  onClick={() => setSelectedVideo(null)}
                >
                  Volver a la lista de videos
                </button>
              </div>
            ) : (
              <div className="course-sections">
                <div className="course-section">
                  <div className="section-header">
                    <h3 className="section-title">Videos del curso</h3>
                    {isAdmin && (
                      <button
                        className="admin-add-button"
                        onClick={handleAddVideo}
                        title="Añadir nuevo video"
                      >
                        <FaPlus /> Añadir video
                      </button>
                    )}
                  </div>
                  <ul className="video-list">
                    {selectedCourse.videos.map(video => (
                      <li key={video.id} className="video-item">
                        <div className="video-item-info">
                          <div className="video-item-status">
                            {isVideoCompleted(video.id) ? (
                              <FaCheck className="video-completed-icon" />
                            ) : (
                              <FaPlay className="video-play-icon" />
                            )}
                          </div>
                          <div className="video-item-details">
                            <h4 className="video-item-title">{video.title}</h4>
                            <span className="video-item-duration">{video.duration}</span>
                          </div>
                        </div>
                        <div className="video-item-actions">
                          <button
                            className="video-play-button"
                            onClick={() => handleSelectVideo(video)}
                          >
                            Ver video
                          </button>

                          {isAdmin && (
                            <div className="admin-actions">
                              <button
                                className="admin-edit-button"
                                onClick={() => handleEditVideo(video)}
                                title="Editar video"
                              >
                                <FaEdit />
                              </button>
                              <button
                                className="admin-delete-button"
                                onClick={() => handleDeleteVideo(video.id)}
                                title="Eliminar video"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="course-section">
                  <div className="section-header">
                    <h3 className="section-title">Materiales del curso</h3>
                    {isAdmin && (
                      <button
                        className="admin-add-button"
                        onClick={handleAddMaterial}
                        title="Añadir nuevo material"
                      >
                        <FaPlus /> Añadir material
                      </button>
                    )}
                  </div>
                  <ul className="material-list">
                    {selectedCourse.materials.map(material => (
                      <li key={material.id} className="material-item">
                        <div className="material-item-info">
                          <div className="material-item-icon">
                            <FaDownload />
                          </div>
                          <div className="material-item-details">
                            <h4 className="material-item-title">{material.title}</h4>
                            <span className="material-item-type">{material.type.toUpperCase()}</span>
                          </div>
                        </div>
                        <div className="material-item-actions">
                          <button
                            className="material-download-button"
                            onClick={() => handleDownloadMaterial(material)}
                          >
                            Descargar
                          </button>

                          {isAdmin && (
                            <div className="admin-actions">
                              <button
                                className="admin-edit-button"
                                onClick={() => handleEditMaterial(material)}
                                title="Editar material"
                              >
                                <FaEdit />
                              </button>
                              <button
                                className="admin-delete-button"
                                onClick={() => handleDeleteMaterial(material.id)}
                                title="Eliminar material"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MyCourses;
