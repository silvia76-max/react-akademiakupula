/**
 * Modelo para la tabla de sesiones de usuario
 * 
 * Este modelo representa una sesión de usuario en la base de datos.
 * Cada vez que un usuario inicia sesión, se crea un nuevo registro en esta tabla.
 * Cuando el usuario cierra sesión, se actualiza el campo 'ended_at'.
 */

class Session {
  constructor(data = {}) {
    this.id = data.id || null;
    this.user_id = data.user_id || null;
    this.token = data.token || null;
    this.ip_address = data.ip_address || null;
    this.user_agent = data.user_agent || null;
    this.device_info = data.device_info || null;
    this.started_at = data.started_at || new Date();
    this.ended_at = data.ended_at || null;
    this.is_active = data.is_active !== undefined ? data.is_active : true;
    this.last_activity = data.last_activity || new Date();
  }

  /**
   * Convierte el objeto a un formato adecuado para guardar en la base de datos
   */
  toDatabase() {
    return {
      id: this.id,
      user_id: this.user_id,
      token: this.token,
      ip_address: this.ip_address,
      user_agent: this.user_agent,
      device_info: this.device_info,
      started_at: this.started_at,
      ended_at: this.ended_at,
      is_active: this.is_active,
      last_activity: this.last_activity
    };
  }

  /**
   * Crea una instancia de Session a partir de datos de la base de datos
   */
  static fromDatabase(data) {
    return new Session({
      id: data.id,
      user_id: data.user_id,
      token: data.token,
      ip_address: data.ip_address,
      user_agent: data.user_agent,
      device_info: data.device_info,
      started_at: data.started_at ? new Date(data.started_at) : null,
      ended_at: data.ended_at ? new Date(data.ended_at) : null,
      is_active: data.is_active,
      last_activity: data.last_activity ? new Date(data.last_activity) : null
    });
  }

  /**
   * Finaliza la sesión
   */
  end() {
    this.ended_at = new Date();
    this.is_active = false;
    return this;
  }

  /**
   * Actualiza la última actividad
   */
  updateActivity() {
    this.last_activity = new Date();
    return this;
  }

  /**
   * Verifica si la sesión está activa
   */
  isActive() {
    return this.is_active && !this.ended_at;
  }

  /**
   * Verifica si la sesión ha expirado
   * @param {number} expiryTimeInMinutes - Tiempo de expiración en minutos
   */
  hasExpired(expiryTimeInMinutes = 60) {
    if (!this.last_activity) return true;
    
    const now = new Date();
    const lastActivity = new Date(this.last_activity);
    const diffInMinutes = (now - lastActivity) / (1000 * 60);
    
    return diffInMinutes > expiryTimeInMinutes;
  }
}

export default Session;
