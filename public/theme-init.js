// Este script se ejecuta antes de que se cargue React
// para evitar el parpadeo al cargar la página

(function() {
  try {
    // Obtener el tema guardado o usar 'dark' por defecto
    var savedTheme = localStorage.getItem('theme') || 'dark';

    // Aplicar el tema al elemento HTML
    document.documentElement.setAttribute('data-theme', savedTheme);

    // Aplicar el color de fondo directamente para evitar parpadeos
    if (savedTheme === 'dark') {
      document.documentElement.style.backgroundColor = '#000000';
      if (document.body) document.body.style.backgroundColor = '#000000';
    } else {
      document.documentElement.style.backgroundColor = '#ffffff';
      if (document.body) document.body.style.backgroundColor = '#ffffff';
    }

    // No tocar ninguna otra variable de localStorage
    console.log('Theme initialized: ' + savedTheme);
  } catch (error) {
    // En caso de error, establecer tema oscuro por defecto
    document.documentElement.setAttribute('data-theme', 'dark');
    document.documentElement.style.backgroundColor = '#000000';
    if (document.body) document.body.style.backgroundColor = '#000000';
    console.error('Error initializing theme:', error);
  }
})();
