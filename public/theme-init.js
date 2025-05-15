// Este script se ejecuta antes de que se cargue React
// para evitar el parpadeo al cargar la página

(function() {
  // Obtener el tema guardado o usar 'dark' por defecto
  var savedTheme = localStorage.getItem('theme') || 'dark';
  
  // Aplicar el tema al elemento HTML
  document.documentElement.setAttribute('data-theme', savedTheme);
  
  // Aplicar el color de fondo directamente para evitar parpadeos
  if (savedTheme === 'dark') {
    document.documentElement.style.backgroundColor = '#000000';
    document.body.style.backgroundColor = '#000000';
  } else {
    document.documentElement.style.backgroundColor = '#ffffff';
    document.body.style.backgroundColor = '#ffffff';
  }
})();
