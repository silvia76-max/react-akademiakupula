import{l as g,n as N,r as c,m as b,u as C,a as y,j as e,G as d,H as A,o as h,p as q,q as I,s as T,t as S,F as D,v as E,w as P,x as $,g as F,k as z,y as w,z as k}from"./index-Q5swbgvz.js";import{e as M,a as _}from"./unas-kupula27-v0eNJAVf.js";import{s as G}from"./unas-kupula26-Cvtue5ha.js";const L=[{id:"curso-de-maquillaje-profesional",title:"Curso de Maquillaje Profesional",description:"Aprende técnicas de maquillaje artístico y desarrolla tu creatividad con los mejores productos.",image:b,duration:"60 horas",level:"Avanzado",price:499.99,instructor:"Tania Calvo",fullDescription:`
      Este curso completo de maquillaje profesional te proporcionará todas las habilidades necesarias para destacar en la industria de la belleza.

      Aprenderás desde técnicas básicas hasta avanzadas, incluyendo:

      • Preparación de la piel
      • Corrección de imperfecciones
      • Técnicas de contorno e iluminación
      • Maquillaje para diferentes ocasiones
      • Maquillaje para fotografía y video
      • Tendencias actuales en maquillaje

      Al finalizar, estarás preparado/a para trabajar como maquillador/a profesional en diversos entornos.
    `,benefits:["Certificación profesional reconocida","Prácticas con modelos reales","Kit de maquillaje profesional incluido","Asesoramiento para iniciar tu carrera","Bolsa de trabajo para los mejores alumnos"]},{id:"curso-de-unas-esculpidas",title:"Curso de Uñas Esculpidas",description:"Domina el arte de las uñas acrílicas y gel. Técnicas profesionales para resultados perfectos.",image:C,duration:"45 horas",level:"Intermedio",price:349.99,instructor:"Laura Martínez",fullDescription:`
      Conviértete en un/a experto/a en el arte de las uñas esculpidas con este curso completo.

      Aprenderás:

      • Preparación de la uña natural
      • Técnicas de aplicación de acrílico
      • Técnicas de aplicación de gel
      • Diseño y decoración de uñas
      • Mantenimiento y reparación
      • Técnicas de marketing para tu negocio

      Este curso te dará todas las herramientas necesarias para iniciar tu propio negocio de uñas.
    `,benefits:["Kit de materiales incluido","Grupos reducidos para atención personalizada","Prácticas supervisadas","Certificado profesional","Asesoramiento para montar tu propio negocio"]},{id:"estetica-integral",title:"Estética Integral",description:"Formación completa en tratamientos faciales y corporales. Todo lo que necesitas para ser profesional.",image:M,duration:"120 horas",level:"Todos los niveles",price:799.99,instructor:"Carmen Rodríguez",fullDescription:`
      Este curso de estética integral te proporcionará una formación completa en todos los aspectos de la estética profesional.

      El programa incluye:

      • Anatomía y fisiología de la piel
      • Diagnóstico facial y corporal
      • Tratamientos faciales avanzados
      • Tratamientos corporales reductores y reafirmantes
      • Aparatología estética
      • Protocolos de tratamiento personalizados
      • Gestión de un centro de estética

      Al finalizar, estarás capacitado/a para trabajar en centros de estética o abrir tu propio negocio.
    `,benefits:["Formación teórica y práctica completa","Prácticas en cabina con clientes reales","Diploma acreditativo","Bolsa de trabajo","Descuentos en productos profesionales"]},{id:"curso-de-manicura-y-pedicura",title:"Curso de Manicura y Pedicura",description:"Domina el arte y el cuidado de manos y pies. Aprende técnicas de spa y tratamientos especiales.",image:y,duration:"30 horas",level:"Principiante",price:249.99,instructor:"Ana López",fullDescription:`
      Aprende todas las técnicas necesarias para ofrecer servicios profesionales de manicura y pedicura.

      El curso incluye:

      • Anatomía de manos y pies
      • Técnicas de manicura básica y spa
      • Técnicas de pedicura básica y spa
      • Esmaltado permanente
      • Tratamientos para problemas específicos
      • Decoración de uñas básica

      Este curso es ideal para principiantes que quieren iniciarse en el mundo de la estética.
    `,benefits:["Kit básico de manicura y pedicura incluido","Grupos reducidos","Prácticas entre alumnos","Certificado de asistencia","Asesoramiento post-curso"]},{id:"curso-de-maquillaje-social",title:"Curso de Maquillaje Social",description:"Descubre técnicas de maquillaje social para eventos, bodas y ocasiones especiales.",image:G,duration:"40 horas",level:"Intermedio",price:349.99,instructor:"Tania Calvo",fullDescription:`
      Especialízate en maquillaje social para eventos y ocasiones especiales con este curso completo.

      Aprenderás:

      • Maquillaje para novias
      • Maquillaje para eventos de día
      • Maquillaje para eventos de noche
      • Técnicas de fotografía
      • Adaptación del maquillaje según el tipo de evento
      • Productos específicos para larga duración

      Perfecto para quienes quieren especializarse en el maquillaje para eventos sociales.
    `,benefits:["Prácticas con modelos reales","Book fotográfico de tus trabajos","Certificado profesional","Descuentos en productos profesionales","Asesoramiento para emprendedores"]},{id:"curso-de-extension-de-pestanas",title:"Curso de Extensión de Pestañas",description:"Extensiones de pestañas de cero a cien. Aprende todas las técnicas: pelo a pelo, volumen ruso y más.",image:_,duration:"25 horas",level:"Avanzado",price:399.99,instructor:"Sofía Martín",fullDescription:`
      Conviértete en un/a especialista en extensiones de pestañas con este curso intensivo.

      El programa incluye:

      • Técnica pelo a pelo
      • Técnica de volumen ruso
      • Técnica de volumen híbrido
      • Lifting de pestañas
      • Tinte de pestañas
      • Mantenimiento y rellenos

      Un curso completo para dominar todas las técnicas de extensión de pestañas.
    `,benefits:["Kit profesional incluido","Prácticas con modelos reales","Grupos reducidos (máximo 6 alumnos)","Certificado profesional","Seguimiento post-curso"]}],H=()=>{const{courseId:i}=g(),{isAuthenticated:r,currentUser:O}=N(),[a,j]=c.useState(null),[x,u]=c.useState(!0),[n,l]=c.useState(!1),[t,p]=c.useState(!1);c.useEffect(()=>{try{const s=L.find(o=>o.id===i);if(s){if(j(s),r()){const o=localStorage.getItem(`wishlist_${i}`)==="true";l(o);const f=localStorage.getItem(`cart_${i}`)==="true";p(f),console.log(`Curso ${i} - En wishlist: ${o}, En carrito: ${f}`)}}else console.error(`Curso con ID ${i} no encontrado`);u(!1),window.scrollTo(0,0)}catch(s){console.error("Error al cargar el curso:",s),u(!1)}},[i,r]);const v=()=>{if(!r()){alert("Debes iniciar sesión para añadir cursos a tu lista de deseos");return}try{if(n)localStorage.setItem(`wishlist_${i}`,"false"),l(!1),alert(`Curso "${a.title}" eliminado de tu lista de deseos`);else{const s={id:i,title:a.title,price:a.price,image:a.image,description:a.description,duration:a.duration,level:a.level,instructor:a.instructor};localStorage.setItem(`wishlist_${i}`,"true"),localStorage.setItem(`wishlist_data_${i}`,JSON.stringify(s)),l(!0),alert(`Curso "${a.title}" añadido a tu lista de deseos`)}}catch(s){console.error("Error al manejar la lista de deseos:",s),alert("Ocurrió un error al procesar tu solicitud. Por favor, inténtalo de nuevo.")}},m=()=>{if(!r()){alert("Debes iniciar sesión para añadir cursos al carrito");return}try{if(t)alert(`El curso "${a.title}" ya está en tu carrito`);else{const s={id:i,title:a.title,price:a.price,image:a.image,description:a.description,duration:a.duration,level:a.level,instructor:a.instructor};localStorage.setItem(`cart_${i}`,"true"),localStorage.setItem(`cart_data_${i}`,JSON.stringify(s)),p(!0),alert(`Curso "${a.title}" añadido al carrito`)}}catch(s){console.error("Error al manejar el carrito:",s),alert("Ocurrió un error al procesar tu solicitud. Por favor, inténtalo de nuevo.")}};return x?e.jsxs("div",{className:"loading-container",children:[e.jsx("div",{className:"loading-spinner"}),e.jsx("p",{children:"Cargando detalles del curso..."})]}):a?e.jsxs(e.Fragment,{children:[e.jsx(A,{}),e.jsxs("div",{className:"course-detail-container",children:[e.jsxs("div",{className:"course-detail-header",children:[e.jsx("div",{className:"course-detail-image-container",children:e.jsx("img",{src:a.image,alt:a.title,className:"course-detail-image"})}),e.jsxs("div",{className:"course-detail-info",children:[e.jsx("h1",{className:"course-detail-title",children:a.title}),e.jsxs("div",{className:"course-detail-meta",children:[e.jsxs("div",{className:"meta-item",children:[e.jsx(h,{className:"meta-icon"}),e.jsx("span",{children:a.duration})]}),e.jsxs("div",{className:"meta-item",children:[e.jsx(q,{className:"meta-icon"}),e.jsx("span",{children:a.level})]}),e.jsxs("div",{className:"meta-item",children:[e.jsx(I,{className:"meta-icon"}),e.jsx("span",{children:a.instructor})]})]}),e.jsxs("div",{className:"course-detail-price",children:[e.jsx("span",{className:"price-label",children:"Precio:"}),e.jsxs("span",{className:"price-amount",children:[a.price.toFixed(2),"€"]})]}),e.jsx("div",{className:"course-detail-actions",children:e.jsxs("div",{className:"action-buttons",children:[r()?e.jsx(d,{text:t?"Ir al carrito":"Añadir al carrito",onClick:()=>{t?(window.location.href="/profile",localStorage.setItem("activeProfileTab","cart")):(m(),setTimeout(()=>{window.location.href="/profile",localStorage.setItem("activeProfileTab","cart")},1e3))}}):e.jsx(d,{text:"Iniciar sesión para comprar",link:"/",onClick:()=>{alert("Debes iniciar sesión para comprar este curso"),localStorage.setItem("redirectAfterLogin",`/curso/${i}`),localStorage.setItem("pendingPurchase",JSON.stringify({courseId:i}))}}),e.jsxs("div",{className:"icon-buttons",children:[e.jsx("button",{className:`icon-button wishlist-button ${r()?"":"disabled"} ${n?"active":""}`,onClick:v,disabled:!r(),title:r()?n?"Quitar de lista de deseos":"Añadir a lista de deseos":"Inicia sesión para añadir a lista de deseos",children:e.jsx(T,{})}),e.jsx("button",{className:`icon-button cart-button ${r()?"":"disabled"} ${t?"active":""}`,onClick:m,disabled:!r(),title:r()?t?"Ya está en el carrito":"Añadir al carrito":"Inicia sesión para añadir al carrito",children:e.jsx(S,{})})]})]})})]})]}),e.jsxs("div",{className:"course-detail-content",children:[e.jsxs("div",{className:"course-detail-description",children:[e.jsx("h2",{children:"Descripción del curso"}),e.jsx("div",{className:"description-text",children:a.fullDescription.split(`
`).map((s,o)=>e.jsx("p",{children:s},o))})]}),e.jsxs("div",{className:"course-detail-benefits",children:[e.jsx("h2",{children:"¿Qué obtendrás?"}),e.jsx("ul",{className:"benefits-list",children:a.benefits.map((s,o)=>e.jsxs("li",{className:"benefit-item",children:[e.jsx(D,{className:"benefit-icon"}),e.jsx("span",{children:s})]},o))})]})]}),e.jsxs("div",{className:"course-detail-features",children:[e.jsx("h2",{children:"Características del curso"}),e.jsxs("div",{className:"features-grid",children:[e.jsxs("div",{className:"feature-item",children:[e.jsx("div",{className:"feature-icon",children:e.jsx(E,{})}),e.jsxs("div",{className:"feature-text",children:[e.jsx("h3",{children:"Formato video"}),e.jsx("p",{children:"Curso en formato video con explicaciones detalladas paso a paso"})]})]}),e.jsxs("div",{className:"feature-item",children:[e.jsx("div",{className:"feature-icon",children:e.jsxs("div",{className:"multi-icon",children:[e.jsx(P,{}),e.jsx($,{})]})}),e.jsxs("div",{className:"feature-text",children:[e.jsx("h3",{children:"Acceso multidispositivo"}),e.jsx("p",{children:"Accede desde cualquier dispositivo: móvil, tablet o computadora"})]})]}),e.jsxs("div",{className:"feature-item",children:[e.jsx("div",{className:"feature-icon",children:e.jsx(h,{})}),e.jsxs("div",{className:"feature-text",children:[e.jsx("h3",{children:"A tu ritmo"}),e.jsx("p",{children:"Estudia en cualquier momento, sin horarios fijos"})]})]}),e.jsxs("div",{className:"feature-item",children:[e.jsx("div",{className:"feature-icon",children:e.jsxs("div",{className:"multi-icon",children:[e.jsx(F,{}),e.jsx(z,{})]})}),e.jsxs("div",{className:"feature-text",children:[e.jsx("h3",{children:"Soporte personalizado"}),e.jsx("p",{children:"Resuelve tus dudas por correo o WhatsApp con nuestros instructores"})]})]}),e.jsxs("div",{className:"feature-item",children:[e.jsx("div",{className:"feature-icon",children:e.jsxs("div",{className:"multi-icon",children:[e.jsx(w,{}),e.jsx(k,{})]})}),e.jsxs("div",{className:"feature-text",children:[e.jsx("h3",{children:"Certificado digital"}),e.jsx("p",{children:"Obtén un certificado de aprovechamiento descargable al finalizar"})]})]})]})]})]})]}):e.jsxs("div",{className:"course-not-found",children:[e.jsx("h2",{children:"Curso no encontrado"}),e.jsx("p",{children:"Lo sentimos, el curso que buscas no existe."}),e.jsx(d,{text:"Volver a cursos",link:"/#cursos"})]})};export{H as default};
