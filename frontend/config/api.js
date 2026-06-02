const ORIGIN = window.location.protocol === 'file:' || window.location.origin === 'null'
  ? 'http://localhost:3000'
  : window.location.origin;

const API_CONFIG = {
  BASE_URL: `${ORIGIN}/api`,

  endpoints: {
    tarjetas: {
      crear: '/tarjetas',
      obtener: (nombre) => `/tarjetas/${encodeURIComponent(nombre)}`,
      actualizar: (nombre) => `/tarjetas/${encodeURIComponent(nombre)}`,
      eliminar: (nombre) => `/tarjetas/${encodeURIComponent(nombre)}`,
      listar: '/tarjetas'
    }
  }
};

class TarjetaCRCService {
  static async crear(payload) {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.endpoints.tarjetas.crear}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al crear tarjeta');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en crear tarjeta:', error);
      throw error;
    }
  }

  static async actualizar(nombre, payload) {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.endpoints.tarjetas.actualizar(nombre)}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al actualizar tarjeta');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en actualizar tarjeta:', error);
      throw error;
    }
  }

  static async obtener(nombre) {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.endpoints.tarjetas.obtener(nombre)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Tarjeta no encontrada');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en obtener tarjeta:', error);
      throw error;
    }
  }

  static async obtenerTodas() {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.endpoints.tarjetas.listar}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al obtener tarjetas');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en obtener tarjetas:', error);
      throw error;
    }
  }

  static async eliminar(nombre) {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.endpoints.tarjetas.eliminar(nombre)}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al eliminar tarjeta');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en eliminar tarjeta:', error);
      throw error;
    }
  }
}
