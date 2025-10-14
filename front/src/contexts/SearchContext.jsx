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
  const [selectedClass, setSelectedClass] = useState('')
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

  // Obtener criterios de búsqueda formateados
  const getSearchCriteria = () => {
    console.log('SORT:', sort)
    return {
      tripType,
      origin: from?.code,
      destination: to?.code,
      departureDate: departDate,
      returnDate: tripType === 'roundtrip' ? returnDate : undefined,
      adults,
      flexibleDates,
      selectedClass,
      sort: sort ?? undefined
    };
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
    aeropuertos, loading, error, selectedClass, sort,
    
    // Setters
    setTripType, setFrom, setTo, setDepartDate, setReturnDate,
    setAdults, setFlexibleDates, setAeropuertos, setLoading, setError, setSelectedClass, setSort,
    
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
