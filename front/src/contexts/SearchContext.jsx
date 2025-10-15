import { createContext, useContext, useState, useEffect } from 'react';
import { vuelosService } from '../services';

// Crear el contexto
const SearchContext = createContext();

// Provider del contexto
export const SearchProvider = ({ children }) => {
  // Estado del formulario
  const [tripType, setTripType] = useState('oneway');
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);
  const [departDate, setDepartDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [adults, setAdults] = useState(1);
  const [flexibleDates, setFlexibleDates] = useState(false);
  const [sort, setSort] = useState('price_asc')
  
  // Estado de aeropuertos y carga
  const [aeropuertos, setAeropuertos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar aeropuertos al montar
  useEffect(() => {
    const cargarAeropuertos = async () => {
      try {
        setLoading(true);
        const datos = await vuelosService.obtenerAeropuertos();
        const aeropuertosFormateados = datos.map(aeropuerto => ({
          code: aeropuerto.codigo,
          label: `${aeropuerto.ciudad} (${aeropuerto.codigo})`,
          ciudad: aeropuerto.ciudad,
          nombre: aeropuerto.nombre
        }));
        setAeropuertos(aeropuertosFormateados);
      } catch (error) {
        console.error('Error cargando aeropuertos:', error);
        setError('Error al cargar aeropuertos');
      } finally {
        setLoading(false);
      }
    };
    
    cargarAeropuertos();
  }, []);

   const getSearchCriteria = () => {
    const criteria = {
      origin: from?.code,
      destination: to?.code,
      departureDate: departDate,
      departureRange: flexibleDates ? 1 : 0, // Si es flexible, buscar ±3 días
      passengers: adults,
      currency: 'USD', // Por defecto USD, podrías hacerlo configurable
    };

    // Solo agregar returnDate y returnRange si es viaje de ida y vuelta
    if (tripType === 'roundtrip' && returnDate) {
      criteria.returnDate = returnDate;
      criteria.returnRange = flexibleDates ? 1 : 0; // Si es flexible, buscar ±1 día
    }

    // Solo agregar sort si está definido
    if (sort) {
      criteria.sort = sort;
    }

    console.log('Search criteria for backend:', criteria);
    return criteria;
  };

  // Validar si la búsqueda es válida
  const isSearchValid = () => {
    return from && to && departDate && (tripType === 'oneway' || (tripType === 'roundtrip' && returnDate)) && adults > 0;
  };

  // Resetear filtros
  const resetFilters = () => {
    setTripType('oneway');
    setFrom(null);
    setTo(null);
    setDepartDate('');
    setReturnDate('');
    setAdults(1);
    setFlexibleDates(false);
    setError(null);
  };

  const value = {
    // Estado
    tripType, from, to, departDate, returnDate, adults, flexibleDates,
    aeropuertos, loading, error, sort,
    
    // Setters
    setTripType, setFrom, setTo, setDepartDate, setReturnDate,
    setAdults, setFlexibleDates, setAeropuertos, setLoading, setError, setSort,
    
    // Utilidades
    getSearchCriteria, isSearchValid, resetFilters
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
};

// Hook para usar el contexto
export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch debe ser usado dentro de un SearchProvider');
  }
  return context;
};
