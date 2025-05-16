// Servicio para gestionar el carrito y la lista de deseos

// Obtener el carrito del localStorage
export const getCart = () => {
  try {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    console.error('Error al obtener el carrito:', error);
    return [];
  }
};

// Guardar el carrito en localStorage
export const saveCart = (cart) => {
  try {
    localStorage.setItem('cart', JSON.stringify(cart));
  } catch (error) {
    console.error('Error al guardar el carrito:', error);
  }
};

// Añadir un curso al carrito
export const addToCart = (course) => {
  try {
    const cart = getCart();
    // Verificar si el curso ya está en el carrito
    if (!cart.some(item => item.id === course.id)) {
      // Asegurarse de que el curso tenga todos los campos necesarios
      const courseToAdd = {
        id: course.id,
        title: course.title,
        price: course.price,
        image: course.image,
        // Añadir otros campos si son necesarios
      };

      const updatedCart = [...cart, courseToAdd];
      saveCart(updatedCart);
      return { success: true, message: `Curso "${course.title}" añadido al carrito` };
    } else {
      return { success: false, message: `El curso "${course.title}" ya está en tu carrito` };
    }
  } catch (error) {
    console.error('Error al añadir al carrito:', error);
    return { success: false, message: 'Error al añadir al carrito' };
  }
};

// Eliminar un curso del carrito
export const removeFromCart = (courseId) => {
  try {
    const cart = getCart();
    const updatedCart = cart.filter(course => course.id !== courseId);
    saveCart(updatedCart);
    return { success: true, message: 'Curso eliminado del carrito' };
  } catch (error) {
    console.error('Error al eliminar del carrito:', error);
    return { success: false, message: 'Error al eliminar del carrito' };
  }
};

// Obtener la lista de deseos del localStorage
export const getWishlist = () => {
  try {
    const wishlist = localStorage.getItem('wishlist');
    return wishlist ? JSON.parse(wishlist) : [];
  } catch (error) {
    console.error('Error al obtener la lista de deseos:', error);
    return [];
  }
};

// Guardar la lista de deseos en localStorage
export const saveWishlist = (wishlist) => {
  try {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  } catch (error) {
    console.error('Error al guardar la lista de deseos:', error);
  }
};

// Añadir un curso a la lista de deseos
export const addToWishlist = (course) => {
  try {
    const wishlist = getWishlist();
    // Verificar si el curso ya está en la lista de deseos
    if (!wishlist.some(item => item.id === course.id)) {
      // Asegurarse de que el curso tenga todos los campos necesarios
      const courseToAdd = {
        id: course.id,
        title: course.title,
        price: course.price,
        image: course.image,
        // Añadir otros campos si son necesarios
      };

      const updatedWishlist = [...wishlist, courseToAdd];
      saveWishlist(updatedWishlist);
      return { success: true, message: `Curso "${course.title}" añadido a tu lista de deseos` };
    } else {
      return { success: false, message: `El curso "${course.title}" ya está en tu lista de deseos` };
    }
  } catch (error) {
    console.error('Error al añadir a la lista de deseos:', error);
    return { success: false, message: 'Error al añadir a la lista de deseos' };
  }
};

// Eliminar un curso de la lista de deseos
export const removeFromWishlist = (courseId) => {
  try {
    const wishlist = getWishlist();
    const updatedWishlist = wishlist.filter(course => course.id !== courseId);
    saveWishlist(updatedWishlist);
    return { success: true, message: 'Curso eliminado de la lista de deseos' };
  } catch (error) {
    console.error('Error al eliminar de la lista de deseos:', error);
    return { success: false, message: 'Error al eliminar de la lista de deseos' };
  }
};

// Verificar si un curso está en la lista de deseos
export const isInWishlist = (courseId) => {
  try {
    const wishlist = getWishlist();
    return wishlist.some(course => course.id === courseId);
  } catch (error) {
    console.error('Error al verificar la lista de deseos:', error);
    return false;
  }
};

// Verificar si un curso está en el carrito
export const isInCart = (courseId) => {
  try {
    const cart = getCart();
    return cart.some(course => course.id === courseId);
  } catch (error) {
    console.error('Error al verificar el carrito:', error);
    return false;
  }
};

// Mover un curso de la lista de deseos al carrito
export const moveFromWishlistToCart = (courseId) => {
  try {
    const wishlist = getWishlist();
    const course = wishlist.find(item => item.id === courseId);

    if (course) {
      // Asegurarse de que el curso tenga todos los campos necesarios
      const courseToMove = {
        id: course.id,
        title: course.title,
        price: course.price,
        image: course.image,
        // Añadir otros campos si son necesarios
      };

      const result = addToCart(courseToMove);
      if (result.success) {
        removeFromWishlist(courseId);
        return { success: true, message: `Curso "${course.title}" movido al carrito` };
      } else {
        return result;
      }
    } else {
      return { success: false, message: 'Curso no encontrado en la lista de deseos' };
    }
  } catch (error) {
    console.error('Error al mover de la lista de deseos al carrito:', error);
    return { success: false, message: 'Error al mover al carrito' };
  }
};
