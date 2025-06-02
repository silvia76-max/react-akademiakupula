/* eslint-disable no-undef */
import { useEffect, useRef } from "react";
import CourseCard from "./CourseCard";
import "../styles/Courses.css";

import maquillajeImg from '../assets/images/unas-kupula3.jpg';
import unasImg from '../assets/images/unas-kupula5.jpg';
import esteticaImg from '../assets/images/unasdeco001.jpg';
import manicuraImg from '../assets/images/unas-kupula2.jpg';
import socialImg from '../assets/images/unas-kupula26.jpg';
import extensionImg from '../assets/images/unas-kupula27.jpg';

const Courses = () => {
  const sectionRef = useRef(null);
  const coursesRef = useRef([]);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const sectionObserverCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    };

    const cardObserverCallback = (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Add a staggered delay based on the index
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, index * 150);
        }
      });
    };

    const sectionObserver = new IntersectionObserver(sectionObserverCallback, observerOptions);
    const cardObserver = new IntersectionObserver(cardObserverCallback, observerOptions);

    if (sectionRef.current) {
      sectionObserver.observe(sectionRef.current);
    }

    coursesRef.current.forEach(ref => {
      if (ref) cardObserver.observe(ref);
    });

    return () => {
      if (sectionRef.current) {
        sectionObserver.unobserve(sectionRef.current);
      }
      coursesRef.current.forEach(ref => {
        if (ref) cardObserver.unobserve(ref);
      });
    };
  }, []);

  const addToCourseRefs = (el) => {
    if (el && !coursesRef.current.includes(el)) {
      coursesRef.current.push(el);
    }
  };

  const courses = [
    {
      id: "curso-de-maquillaje-profesional",
      title: "Curso de Maquillaje Profesional",
      description: "Aprende técnicas de maquillaje artístico y desarrolla tu creatividad con los mejores productos.",
      image: maquillajeImg,
      duration: "60 horas",
      level: "Avanzado"
    },
    {
      id: "curso-de-unas-esculpidas",
      title: "Curso de Uñas Esculpidas",
      description: "Domina el arte de las uñas acrílicas y gel. Técnicas profesionales para resultados perfectos.",
      image: unasImg,
      duration: "45 horas",
      level: "Intermedio"
    },
    {
      id: "estetica-integral",
      title: "Estética Integral",
      description: "Formación completa en tratamientos faciales y corporales. Todo lo que necesitas para ser profesional.",
      image: esteticaImg,
      duration: "120 horas",
      level: "Todos los niveles"
    },
    {
      id: "curso-de-manicura-y-pedicura",
      title: "Curso de Manicura y Pedicura",
      description: "Domina el arte y el cuidado de manos y pies. Aprende técnicas de spa y tratamientos especiales.",
      image: manicuraImg,
      duration: "30 horas",
      level: "Principiante"
    },
    {
      id: "curso-de-maquillaje-social",
      title: "Curso de Maquillaje Social",
      description: "Descubre técnicas de maquillaje social para eventos, bodas y ocasiones especiales.",
      image: socialImg,
      duration: "40 horas",
      level: "Intermedio"
    },
    {
      id: "curso-de-extension-de-pestanas",
      title: "Curso de Extensión de Pestañas",
      description: "Extensiones de pestañas de cero a cien. Aprende todas las técnicas: pelo a pelo, volumen ruso y más.",
      image: extensionImg,
      duration: "25 horas",
      level: "Avanzado"
    }
  ];

  return (
    <section id="cursos" className="course-section fade-in-section" ref={sectionRef}>
      <div className="courses-header">
        <h2 className="section-title">Nuestros Cursos</h2>
        <div className="title-underline"></div>
        <p className="courses-subtitle">
          Descubre nuestra amplia oferta formativa y da el siguiente paso en tu carrera profesional
        </p>
      </div>

      <div className="course-list">
        {courses.map((course, index) => (
          <div key={index} className="course-card-container" ref={addToCourseRefs}>
            <CourseCard
              id={course.id}
              title={course.title}
              description={course.description}
              image={course.image}
              duration={course.duration}
              level={course.level}
            />
          </div>
        ))}
      </div>

      <div className="courses-cta">
        <p>¿Quieres más información sobre nuestros cursos?</p>
        <a href="#contacto" className="courses-cta-button">Contáctanos</a>
      </div>
    </section>
  );
};

export default Courses;
