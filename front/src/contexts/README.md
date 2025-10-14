# Arquitectura Final - Contextos Simplificados

Esta documentación explica la arquitectura final simplificada usando solo contextos con `useState`.

## 🎯 **Arquitectura Final**

### **✅ Solo Contextos - Sin Hooks Separados**
- **Más simple** - Solo 2 archivos principales
- **Menos abstracción** - Acceso directo a estado y funciones
- **Mejor performance** - Sin capas adicionales
- **Más directo** - Todo en un solo lugar

## 📁 **Estructura Final**

```
contexts/
├── SearchContext.jsx    # Contexto para filtros de búsqueda
└── FlightsContext.jsx   # Contexto para resultados de vuelos
```

**¡Solo 2 archivos!** - Sin hooks separados, sin abstracciones innecesarias.

## 🔧 **Contextos**

### SearchContext

```javascript
// Estado usando useState
const [tripType, setTripType] = useState('oneway');
const [from, setFrom] = useState(null);
const [to, setTo] = useState(null);
const [departDate, setDepartDate] = useState('');
const [returnDate, setReturnDate] = useState('');
const [adults, setAdults] = useState(1);
const [flexibleDates, setFlexibleDates] = useState(false);
const [aeropuertos, setAeropuertos] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

// Carga automática de aeropuertos
useEffect(() => {
  // Cargar aeropuertos al montar
}, []);

// Utilidades
const getSearchCriteria = () => { /* ... */ };
const isSearchValid = () => { /* ... */ };
const resetFilters = () => { /* ... */ };
```

### FlightsContext

```javascript
// Estado usando useState
const [vuelos, setVuelos] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
const [selectedFlight, setSelectedFlight] = useState(null);
const [searchPerformed, setSearchPerformed] = useState(false);

// Funciones
const searchFlights = async (criteria) => { /* ... */ };
const selectFlight = (flight) => { /* ... */ };
const clearResults = () => { /* ... */ };
```

## 🎯 **Uso en Componentes**

### **Arquitectura Final - Solo Contextos**

```javascript
// SearchForm.jsx
import { useSearch } from '../contexts/SearchContext';
import { useFlights } from '../contexts/FlightsContext';

function SearchForm() {
  const {
    tripType, from, to, departDate, adults, flexibleDates,
    aeropuertos, loading: aeropuertosLoading,
    setTripType, setFrom, setTo, setDepartDate, setAdults, setFlexibleDates,
    getSearchCriteria, isSearchValid
  } = useSearch();

  const { searchFlights, loading: searchLoading } = useFlights();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isSearchValid()) return;
    
    const criteria = getSearchCriteria();
    await searchFlights(criteria);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Autocomplete value={from} onChange={(_, v) => setFrom(v)} options={aeropuertos} />
      <Button disabled={loading}>
        {loading ? 'Buscando...' : 'Buscar'}
      </Button>
    </form>
  );
}
```

```javascript
// ResultsList.jsx
import { useFlights } from '../contexts/FlightsContext';

function ResultsList() {
  const { vuelos, loading, error, searchPerformed, selectFlight } = useFlights();

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!searchPerformed) return <div>Realiza una búsqueda</div>;

  return (
    <div>
      {vuelos.map(vuelo => (
        <button key={vuelo.id} onClick={() => selectFlight(vuelo)}>
          Seleccionar {vuelo.airline}
        </button>
      ))}
    </div>
  );
}
```

## 🚀 **Ventajas de esta Arquitectura**

### **✅ Máxima Simplicidad**
- Solo 2 archivos principales
- Sin abstracciones innecesarias
- Código directo y claro

### **✅ Mejor Performance**
- useState es más eficiente que useReducer
- Sin capas adicionales de hooks
- Menos re-renders

### **✅ Fácil Mantenimiento**
- Todo en un solo lugar
- Fácil de entender
- Fácil de modificar

### **✅ Escalabilidad**
- Fácil agregar nuevas funcionalidades
- Fácil agregar nuevos campos
- Fácil debugging

## 📝 **Comparación: Antes vs Ahora**

| Aspecto | Arquitectura Compleja | Arquitectura Final |
|---------|---------------------|-------------------|
| **Archivos** | 6 archivos | 2 archivos |
| **Líneas de código** | ~500 líneas | ~200 líneas |
| **Complejidad** | Alta | Mínima |
| **Performance** | Overhead | Optimizado |
| **Mantenibilidad** | Difícil | Fácil |
| **Entendimiento** | Complejo | Simple |

## 🎯 **¿Cuándo usar hooks separados?**

**Solo en estos casos específicos:**

1. **Lógica muy compleja** que no cabe en el contexto
2. **Reutilización masiva** en muchos componentes
3. **Testing específico** de lógica de negocio
4. **Integración con librerías externas** complejas

**Para tu aplicación:** No necesitas hooks separados.

## 📋 **Ejemplo Completo Final**

```javascript
// App.jsx
import { SearchProvider, FlightsProvider } from './contexts';

function App() {
  return (
    <SearchProvider>
      <FlightsProvider>
        <SearchForm />
        <ResultsList />
      </FlightsProvider>
    </SearchProvider>
  );
}

// SearchForm.jsx
import { useSearch, useFlights } from '../contexts';

function SearchForm() {
  const { from, to, setFrom, setTo, aeropuertos, getSearchCriteria, isSearchValid } = useSearch();
  const { searchFlights, loading } = useFlights();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isSearchValid()) return;
    await searchFlights(getSearchCriteria());
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <Autocomplete value={from} onChange={(_, v) => setFrom(v)} options={aeropuertos} />
      <Autocomplete value={to} onChange={(_, v) => setTo(v)} options={aeropuertos} />
      <Button type="submit" disabled={loading}>
        {loading ? 'Buscando...' : 'Buscar'}
      </Button>
    </form>
  );
}

// ResultsList.jsx
import { useFlights } from '../contexts/FlightsContext';

function ResultsList() {
  const { vuelos, loading, error, selectFlight } = useFlights();
  
  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      {vuelos.map(vuelo => (
        <button key={vuelo.id} onClick={() => selectFlight(vuelo)}>
          Seleccionar {vuelo.airline}
        </button>
      ))}
    </div>
  );
}
```

## 🎉 **Conclusión**

**Esta es la arquitectura perfecta para tu aplicación:**

- ✅ **Máxima simplicidad** - Solo 2 archivos
- ✅ **Máximo rendimiento** - Sin overhead
- ✅ **Máxima mantenibilidad** - Código claro
- ✅ **Máxima escalabilidad** - Fácil de extender

**¡No necesitas hooks separados!** Los contextos son suficientes y más eficientes.
