import { vuelos, aeropuertos } from "./mockData";
import { apiService } from "./apiService";
import { config } from "../config";

// Servicio unificado para vuelos (mock + API)
export const vuelosService = {
  // Obtener todos los vuelos
  obtenerTodos: async () => {
    if (config.USE_MOCK) {
      return vuelos;
    } else {
      try {
        const response = await apiService.obtenerTodosLosVuelos();
        return response.data || response;
      } catch (error) {
        console.error("Error obteniendo vuelos de API:", error);
        return vuelos; // Fallback a mocks si falla la API
      }
    }
  },

  // Buscar vuelos por origen y destino
  buscar: async (origen, destino) => {
    if (config.USE_MOCK) {
      return vuelos.filter(
        (vuelo) =>
          vuelo.origen.toLowerCase().includes(origen.toLowerCase()) &&
          vuelo.destino.toLowerCase().includes(destino.toLowerCase())
      );
    } else {
      try {
        const response = await apiService.buscarVuelos({ origen, destino });
        return response.data || response;
      } catch (error) {
        console.error("Error buscando vuelos en API:", error);
        // Fallback a mocks si falla la API
        return vuelos.filter(
          (vuelo) =>
            vuelo.origen.toLowerCase().includes(origen.toLowerCase()) &&
            vuelo.destino.toLowerCase().includes(destino.toLowerCase())
        );
      }
    }
  },

  // Buscar vuelos con filtros completos (incluyendo fechas)
  buscarConFiltros: async (criterios) => {
    const resultados = config.USE_MOCK
      ? getMockedFlights(criterios)
      : await searchFlights(criterios);

    return resultados;
  },

  // Buscar vuelos por precio máximo
  buscarPorPrecio: async (precioMaximo) => {
    if (config.USE_MOCK) {
      return vuelos.filter((vuelo) => vuelo.precio <= precioMaximo);
    } else {
      try {
        const response = await apiService.buscarVuelos({ precioMaximo });
        return response.data || response;
      } catch (error) {
        console.error("Error buscando vuelos por precio en API:", error);
        return vuelos.filter((vuelo) => vuelo.precio <= precioMaximo);
      }
    }
  },

  // Obtener vuelo por ID
  obtenerPorId: async (id) => {
    if (config.USE_MOCK) {
      return vuelos.find((vuelo) => vuelo.id === id);
    } else {
      try {
        const response = await apiService.obtenerVuelo(id);
        return response.data || response;
      } catch (error) {
        console.error("Error obteniendo vuelo por ID en API:", error);
        return vuelos.find((vuelo) => vuelo.id === id);
      }
    }
  },

  // Obtener todos los aeropuertos
  obtenerAeropuertos: async () => {
    if (config.USE_MOCK) {
      return aeropuertos;
    } else {
      try {
        const response = await apiService.obtenerAeropuertos();
        return response.data || response;
      } catch (error) {
        console.error("Error obteniendo aeropuertos de API:", error);
        return aeropuertos;
      }
    }
  },

  // Buscar aeropuertos por ciudad
  buscarAeropuertos: async (ciudad) => {
    if (config.USE_MOCK) {
      return aeropuertos.filter((aeropuerto) =>
        aeropuerto.ciudad.toLowerCase().includes(ciudad.toLowerCase())
      );
    } else {
      try {
        const response = await apiService.buscarAeropuertos(ciudad);
        return response.data || response;
      } catch (error) {
        console.error("Error buscando aeropuertos en API:", error);
        return aeropuertos.filter((aeropuerto) =>
          aeropuerto.ciudad.toLowerCase().includes(ciudad.toLowerCase())
        );
      }
    }
  },

  // Crear reserva
  crearReserva: async (datosReserva) => {
    if (config.USE_MOCK) {
      // Simular creación de reserva
      return {
        id: `BK${Date.now()}`,
        ...datosReserva,
        estado: "confirmada",
        fechaCreacion: new Date().toISOString(),
      };
    } else {
      try {
        const response = await apiService.crearReserva(datosReserva);
        return response.data || response;
      } catch (error) {
        throw new Error(`Error creando reserva: ${error.message}`);
      }
    }
  },
};

// Funciones útiles simples
export const utilidades = {
  // Formatear precio
  formatearPrecio: (precio) => {
    return `$${precio.toLocaleString("es-AR")}`;
  },

  // Formatear fecha
  formatearFecha: (fecha) => {
    return new Date(fecha).toLocaleDateString("es-AR");
  },

  // Formatear hora
  formatearHora: (fecha) => {
    return new Date(fecha).toLocaleTimeString("es-AR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  },
};

const getMockedFlights = ({
  from,
  to,
  departDate,
  returnDate,
  onlyDirect,
} = criterios) => {
  let vuelosFiltrados = vuelos.filter(
    (vuelo) =>
      vuelo.origen.toLowerCase().includes(from.toLowerCase()) &&
      vuelo.destino.toLowerCase().includes(to.toLowerCase())
  );

  // Filtrar por fecha de salida si se proporciona
  if (departDate) {
    const fechaSalida = new Date(departDate);
    vuelosFiltrados = vuelosFiltrados.filter((vuelo) => {
      const vueloFecha = new Date(vuelo.fechaSalida);
      // Comparar solo la fecha (sin hora)
      return (
        vueloFecha.getFullYear() === fechaSalida.getFullYear() &&
        vueloFecha.getMonth() === fechaSalida.getMonth() &&
        vueloFecha.getDate() === fechaSalida.getDate()
      );
    });
  }

  // Filtrar por fecha de regreso si es viaje de ida y vuelta
  if (returnDate && criterios.tripType === "roundtrip") {
    const fechaRegreso = new Date(returnDate);
    vuelosFiltrados = vuelosFiltrados.filter((vuelo) => {
      const vueloFecha = new Date(vuelo.fechaLlegada);
      // Comparar solo la fecha (sin hora)
      return (
        vueloFecha.getFullYear() === fechaRegreso.getFullYear() &&
        vueloFecha.getMonth() === fechaRegreso.getMonth() &&
        vueloFecha.getDate() === fechaRegreso.getDate()
      );
    });
  }

  // Filtrar por vuelos directos si se solicita
  if (onlyDirect) {
    vuelosFiltrados = vuelosFiltrados.filter((vuelo) => vuelo.escalas === 0);
  }

  console.log("Criterios de búsqueda:", criterios);
  console.log("Vuelos encontrados:", vuelosFiltrados.length);
  console.log("Vuelos filtrados:", vuelosFiltrados);

  return vuelosFiltrados;
};

const searchFlights = async (criteria) => {
  try {
    const response = await apiService.buscarVuelos(criteria);
    return response
  } catch (error) {
    console.error("Error buscando vuelos con filtros en API:", error);
  }
};
