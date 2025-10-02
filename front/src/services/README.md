# Servicios de Vuelos

Este directorio contiene todos los servicios para manejar datos de vuelos, tanto con mocks como con API real.

## Estructura

```
services/
├── mockData.js      # Datos mock de vuelos y aeropuertos
├── flightService.js # Servicio principal (mock + API)
├── apiService.js    # Servicio de API con axios
└── index.js         # Exportaciones principales
```

## Configuración

### Variables de Entorno (.env)

Crea un archivo `.env` en el directorio `front/` con estas variables:

```env
# Configuración de la API
VITE_API_URL=http://localhost:3001/api

# Modo de desarrollo (true = usar mocks, false = usar API)
VITE_USE_MOCK=true

# Timeout de las peticiones (en milisegundos)
VITE_REQUEST_TIMEOUT=10000

# Configuración de la aplicación
VITE_APP_NAME=Búsqueda de Vuelos

# Configuración de paginación
VITE_DEFAULT_PAGE_SIZE=10

# Configuración de moneda
VITE_DEFAULT_CURRENCY=USD

# Configuración de idioma
VITE_DEFAULT_LANGUAGE=es-AR
```

## Uso

### Importar servicios

```javascript
import { vuelosService, utilidades, config } from '../services';
```

### Obtener todos los vuelos

```javascript
// Con async/await
const vuelos = await vuelosService.obtenerTodos();

// Con promesas
vuelosService.obtenerTodos().then(vuelos => {
  console.log(vuelos);
});
```

### Buscar vuelos

```javascript
// Buscar por origen y destino
const vuelosAMadrid = await vuelosService.buscar('Buenos Aires', 'Madrid');

// Buscar por precio máximo
const vuelosBaratos = await vuelosService.buscarPorPrecio(800);
```

### Obtener vuelo específico

```javascript
const vuelo = await vuelosService.obtenerPorId(1);
```

### Obtener aeropuertos

```javascript
// Todos los aeropuertos
const aeropuertos = await vuelosService.obtenerAeropuertos();

// Buscar por ciudad
const aeropuertosMadrid = await vuelosService.buscarAeropuertos('Madrid');
```

### Crear reserva

```javascript
const reserva = await vuelosService.crearReserva({
  vueloId: 1,
  pasajero: {
    nombre: 'Juan Pérez',
    email: 'juan@email.com'
  }
});
```

### Formatear datos

```javascript
const precioFormateado = utilidades.formatearPrecio(850); // "$850"
const fechaFormateada = utilidades.formatearFecha('2024-02-15T10:30:00'); // "15/2/2024"
const horaFormateada = utilidades.formatearHora('2024-02-15T10:30:00'); // "10:30"
```

## Cambiar entre Mock y API

### Para usar mocks (desarrollo):
```env
VITE_USE_MOCK=true
```

### Para usar API real (producción):
```env
VITE_USE_MOCK=false
VITE_API_URL=https://tu-api.com/api
```

## Manejo de Errores

El servicio maneja automáticamente los errores:

- Si `USE_MOCK=true`: Usa datos mock
- Si `USE_MOCK=false` y falla la API: Hace fallback a mocks
- Si hay error en la API: Muestra error en consola y usa mocks

## Ejemplo Completo en Componente

```javascript
import React, { useState, useEffect } from 'react';
import { vuelosService, utilidades } from '../services';

function BuscadorVuelos() {
  const [vuelos, setVuelos] = useState([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    cargarVuelos();
  }, []);
  
  const cargarVuelos = async () => {
    setLoading(true);
    try {
      const datos = await vuelosService.obtenerTodos();
      setVuelos(datos);
    } catch (error) {
      console.error('Error cargando vuelos:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const buscarVuelos = async (origen, destino) => {
    setLoading(true);
    try {
      const resultados = await vuelosService.buscar(origen, destino);
      setVuelos(resultados);
    } catch (error) {
      console.error('Error buscando vuelos:', error);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) return <div>Cargando...</div>;
  
  return (
    <div>
      {vuelos.map(vuelo => (
        <div key={vuelo.id}>
          <h3>{vuelo.aerolinea} - {vuelo.numeroVuelo}</h3>
          <p>{vuelo.origen} → {vuelo.destino}</p>
          <p>Precio: {utilidades.formatearPrecio(vuelo.precio)}</p>
          <p>Fecha: {utilidades.formatearFecha(vuelo.fechaSalida)}</p>
        </div>
      ))}
    </div>
  );
}
```
