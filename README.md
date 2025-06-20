![Vista Home de Akademia Kupula](src/assets/images/Kupulahome.png)

Este proyecto es una plataforma web integral para la gestión y promoción de una academia. Desarrollada en React, permite tanto informar sobre la academia, sus cursos y eventos presenciales, como ofrecer la posibilidad de comprar y realizar cursos online. 

La aplicación cuenta con una página pública donde los visitantes pueden conocer la oferta de la academia, consultar información sobre los cursos, eventos, instructores y noticias relevantes. Además, los usuarios pueden registrarse, acceder a un panel personal para gestionar sus datos, inscribirse en cursos y realizar compras online de manera segura.

Para la administración, el sistema incluye un completo panel de gestión protegido para usuarios con rol de administrador. Desde este panel es posible administrar usuarios, cursos, pedidos, mensajes de contacto y sesiones activas, así como gestionar el contenido multimedia y la información destacada de la web.

En resumen, React-akademiaKupula es una solución moderna y flexible para academias que buscan digitalizar su oferta formativa y mejorar la experiencia tanto de sus alumnos como de sus administradores.

## Características principales

- **Gestión de usuarios:** Visualización, búsqueda y administración de usuarios registrados.
- **Gestión de cursos:** Creación, edición, eliminación y visualización de cursos, con detalles como título, descripción, precio, duración, nivel, instructor, etc.
- **Gestión de pedidos:** Visualización y gestión de pedidos realizados por los usuarios, incluyendo detalles de pago y estado.
- **Gestión de contactos:** Visualización y gestión de mensajes enviados por los usuarios a través del formulario de contacto.
- **Gestión de sesiones:** Visualización y finalización de sesiones activas de los usuarios.
- **Panel de administración:** Acceso restringido solo a administradores, con rutas protegidas.
- **Búsqueda y filtrado:** Todas las tablas permiten buscar y filtrar por diferentes campos.
- **Modales de detalle:** Visualización de detalles de cada entidad en modales emergentes.
- **Eliminación segura:** Confirmación antes de eliminar registros importantes.

## Tecnologías utilizadas

- **React** (Vite)
- **React Router DOM**
- **Axios**
- **React Icons**
- **CSS personalizado**
- **Backend:** API RESTful (no incluida en este repositorio)

## Estructura del proyecto

src/
  components/
    admin/
      DataTable.jsx
      AdminSidebar.jsx
      AdminProtectedRoute.jsx
  pages/
    admin/
      UsersManagement.jsx
      CoursesManagement.jsx
      OrdersManagement.jsx
      ContactsManagement.jsx
      SessionsManagement.jsx
  services/
    adminService.js
    authService.js
  context/
    AuthContext.jsx
  App.jsx
  main.jsx


## Instalación y ejecución

1. Clona el repositorio:
   
bash
   git clone https://github.com/tuusuario/React-akademiaKupula.git
   cd React-akademiaKupula


2. Instala las dependencias:
   
bash
   npm install


3. Configura las variables de entorno si es necesario (por ejemplo, la URL de la API).

4. Ejecuta la aplicación en modo desarrollo:
   
bash
   npm run dev


5. Accede a http://localhost:5173 en tu navegador.

## Notas

- El acceso al panel de administración está protegido y requiere iniciar sesión como administrador.
- El backend debe estar disponible y configurado para que la app funcione correctamente.
- Si encuentras errores, revisa la consola del navegador para obtener detalles.

## Contribución

¡Las contribuciones son bienvenidas! Por favor, abre un issue o pull request para sugerencias o mejoras.

## Autor

- [silvia76-max]

---


