// Servicio para gestionar el carrito y la lista de deseos

// Obtener el carrito del localStorage
export const getCart = () => {
  try {
    // Buscar todos los elementos del carrito en localStorage
    const cartItems = [];

    // Recorrer localStorage buscando elementos que empiecen con "cart_data_"
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('cart_data_')) {
        try {
          const courseId = key.replace('cart_data_', '');
          const courseDataStr = localStorage.getItem(key);

          if (!courseDataStr) {
            console.warn(`Datos vacíos para el curso ${courseId} en el carrito`);
            continue;
          }

          const courseData = JSON.parse(courseDataStr);

          // Verificar si el curso está activo en el carrito
          if (localStorage.getItem(`cart_${courseId}`) === 'true') {
            // Verificar que el curso tenga todos los datos necesarios
            if (!courseData.id) courseData.id = courseId;
            if (!courseData.title) courseData.title = 'Curso sin título';
            if (!courseData.price) courseData.price = 0;
            if (!courseData.image) courseData.image = '/images/default-course.jpg';

            cartItems.push(courseData);
          }
        } catch (parseError) {
          console.error(`Error al parsear datos del carrito para el curso ${key}:`, parseError);
        }
      }
    }

    // No creamos datos de ejemplo para mantener el carrito vacío si no hay elementos
    if (cartItems.length === 0) {
      console.log('Carrito vacío');
    }

    console.log('Carrito cargado:', cartItems);
    return cartItems;
  } catch (error) {
    console.error('Error al obtener el carrito:', error);
    return [];
  }
};

// Guardar el carrito en localStorage
export const saveCart = (cart) => {
  try {
    // Limpiar todos los elementos del carrito
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('cart_') || key.startsWith('cart_data_'))) {
        localStorage.removeItem(key);
      }
    }

    // Guardar los nuevos elementos
    cart.forEach(course => {
      localStorage.setItem(`cart_${course.id}`, 'true');
      localStorage.setItem(`cart_data_${course.id}`, JSON.stringify(course));
    });

    return true;
  } catch (error) {
    console.error('Error al guardar el carrito:', error);
    return false;
  }
};

// Añadir un curso al carrito
export const addToCart = (course) => {
  try {
    // Verificar si el curso ya está en el carrito
    if (localStorage.getItem(`cart_${course.id}`) === 'true') {
      return { success: false, message: `El curso "${course.title}" ya está en tu carrito` };
    }

    // Guardar el curso en localStorage
    localStorage.setItem(`cart_${course.id}`, 'true');
    localStorage.setItem(`cart_data_${course.id}`, JSON.stringify(course));

    return { success: true, message: `Curso "${course.title}" añadido al carrito` };
  } catch (error) {
    console.error('Error al añadir al carrito:', error);
    return { success: false, message: 'Error al añadir al carrito' };
  }
};

// Eliminar un curso del carrito
export const removeFromCart = (courseId) => {
  try {
    console.log('Eliminando curso del carrito:', courseId);

    // Verificar si el curso está en el carrito
    if (localStorage.getItem(`cart_${courseId}`) !== 'true') {
      console.warn('El curso no está en el carrito:', courseId);
      return { success: false, message: 'El curso no está en tu carrito' };
    }

    localStorage.removeItem(`cart_${courseId}`);
    localStorage.removeItem(`cart_data_${courseId}`);

    console.log('Curso eliminado del carrito:', courseId);
    return { success: true, message: 'Curso eliminado del carrito' };
  } catch (error) {
    console.error('Error al eliminar del carrito:', error);
    return { success: false, message: 'Error al eliminar del carrito' };
  }
};

// Obtener la lista de deseos del localStorage
export const getWishlist = () => {
  try {
    // Buscar todos los elementos de la lista de deseos en localStorage
    const wishlistItems = [];

    // Recorrer localStorage buscando elementos que empiecen con "wishlist_data_"
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('wishlist_data_')) {
        try {
          const courseId = key.replace('wishlist_data_', '');
          const courseDataStr = localStorage.getItem(key);

          if (!courseDataStr) {
            console.warn(`Datos vacíos para el curso ${courseId} en la lista de deseos`);
            continue;
          }

          const courseData = JSON.parse(courseDataStr);

          // Verificar si el curso está activo en la lista de deseos
          if (localStorage.getItem(`wishlist_${courseId}`) === 'true') {
            // Verificar que el curso tenga todos los datos necesarios
            if (!courseData.id) courseData.id = courseId;
            if (!courseData.title) courseData.title = 'Curso sin título';
            if (!courseData.price) courseData.price = 0;
            if (!courseData.image) courseData.image = '/images/default-course.jpg';

            wishlistItems.push(courseData);
          }
        } catch (parseError) {
          console.error(`Error al parsear datos de la lista de deseos para el curso ${key}:`, parseError);
        }
      }
    }

    // No creamos datos de ejemplo para mantener la lista de deseos vacía si no hay elementos
    if (wishlistItems.length === 0) {
      console.log('Lista de deseos vacía');
    }

    console.log('Lista de deseos cargada:', wishlistItems);
    return wishlistItems;
  } catch (error) {
    console.error('Error al obtener la lista de deseos:', error);
    return [];
  }
};

// Guardar la lista de deseos en localStorage
export const saveWishlist = (wishlist) => {
  try {
    // Limpiar todos los elementos de la lista de deseos
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('wishlist_') || key.startsWith('wishlist_data_'))) {
        localStorage.removeItem(key);
      }
    }

    // Guardar los nuevos elementos
    wishlist.forEach(course => {
      localStorage.setItem(`wishlist_${course.id}`, 'true');
      localStorage.setItem(`wishlist_data_${course.id}`, JSON.stringify(course));
    });

    return true;
  } catch (error) {
    console.error('Error al guardar la lista de deseos:', error);
    return false;
  }
};

// Añadir un curso a la lista de deseos
export const addToWishlist = (course) => {
  try {
    // Verificar si el curso ya está en la lista de deseos
    if (localStorage.getItem(`wishlist_${course.id}`) === 'true') {
      return { success: false, message: `El curso "${course.title}" ya está en tu lista de deseos` };
    }

    // Guardar el curso en localStorage
    localStorage.setItem(`wishlist_${course.id}`, 'true');
    localStorage.setItem(`wishlist_data_${course.id}`, JSON.stringify(course));

    return { success: true, message: `Curso "${course.title}" añadido a tu lista de deseos` };
  } catch (error) {
    console.error('Error al añadir a la lista de deseos:', error);
    return { success: false, message: 'Error al añadir a la lista de deseos' };
  }
};

// Eliminar un curso de la lista de deseos
export const removeFromWishlist = (courseId) => {
  try {
    console.log('Eliminando curso de la lista de deseos:', courseId);

    // Verificar si el curso está en la lista de deseos
    if (localStorage.getItem(`wishlist_${courseId}`) !== 'true') {
      console.warn('El curso no está en la lista de deseos:', courseId);
      return { success: false, message: 'El curso no está en tu lista de deseos' };
    }

    localStorage.removeItem(`wishlist_${courseId}`);
    localStorage.removeItem(`wishlist_data_${courseId}`);

    console.log('Curso eliminado de la lista de deseos:', courseId);
    return { success: true, message: 'Curso eliminado de la lista de deseos' };
  } catch (error) {
    console.error('Error al eliminar de la lista de deseos:', error);
    return { success: false, message: 'Error al eliminar de la lista de deseos' };
  }
};

// Verificar si un curso está en la lista de deseos
export const isInWishlist = (courseId) => {
  return localStorage.getItem(`wishlist_${courseId}`) === 'true';
};

// Verificar si un curso está en el carrito
export const isInCart = (courseId) => {
  return localStorage.getItem(`cart_${courseId}`) === 'true';
};

// Mover un curso de la lista de deseos al carrito
export const moveFromWishlistToCart = (courseId) => {
  try {
    console.log('Moviendo curso de la lista de deseos al carrito:', courseId);

    // Verificar si el curso está en la lista de deseos
    if (localStorage.getItem(`wishlist_${courseId}`) !== 'true') {
      console.warn('El curso no está en la lista de deseos:', courseId);
      return { success: false, message: 'El curso no está en tu lista de deseos' };
    }

    // Obtener los datos del curso
    const courseData = localStorage.getItem(`wishlist_data_${courseId}`);

    if (!courseData) {
      console.error('No se encontraron datos del curso:', courseId);
      return { success: false, message: 'Curso no encontrado en la lista de deseos' };
    }

    try {
      // Parsear los datos del curso
      const course = JSON.parse(courseData);
      console.log('Datos del curso obtenidos:', course);

      // Verificar que el curso tenga todos los datos necesarios
      if (!course.id) course.id = courseId;
      if (!course.title) course.title = 'Curso sin título';
      if (!course.price) course.price = 0;
      if (!course.image) course.image = '/images/default-course.jpg';

      // Añadir al carrito con los datos verificados
      localStorage.setItem(`cart_${courseId}`, 'true');
      localStorage.setItem(`cart_data_${courseId}`, JSON.stringify(course));

      // Eliminar de la lista de deseos
      localStorage.removeItem(`wishlist_${courseId}`);
      localStorage.removeItem(`wishlist_data_${courseId}`);

      console.log('Curso movido al carrito:', course);
      return { success: true, message: `Curso "${course.title}" movido al carrito` };
    } catch (parseError) {
      console.error('Error al parsear datos del curso:', parseError);
      return { success: false, message: 'Error al procesar datos del curso' };
    }
  } catch (error) {
    console.error('Error al mover de la lista de deseos al carrito:', error);
    return { success: false, message: 'Error al mover al carrito' };
  }
};
