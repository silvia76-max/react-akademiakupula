// Script para inicializar el tema antes de que se cargue React
(function() {
  // Obtener el tema guardado en localStorage o usar el tema por defecto (dark)
  const savedTheme = localStorage.getItem('theme') || 'dark';
  
  // Aplicar el tema al elemento html
  document.documentElement.setAttribute('data-theme', savedTheme);
  
  console.log('Tema inicializado:', savedTheme);
})();
