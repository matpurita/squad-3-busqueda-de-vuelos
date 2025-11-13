# 📋 **Componentes de Sugerencias - Guía de Uso**

## 🎯 **Componentes Disponibles**

### **1. SuggestionsAside** (Sidebar vertical)
Diseñado para mostrar sugerencias en un sidebar lateral, optimizado para espacios reducidos.
- **Dimensiones**: 280px ancho, 280px altura de imagen
- **Objetivo**: Mostrar imagen completa usando `object-fit: contain`

### **2. SuggestionsHorizontal** (Grid horizontal)
Diseñado para mostrar sugerencias en una sección completa con grid responsive.
- **Dimensiones**: Responsive, 300px altura de imagen
- **Objetivo**: Grid de 4+ destinos con imagen completa visible

### **3. SuggestionsBanner** (Proporción exacta)
Diseñado para mostrar las imágenes en su proporción original exacta 160x600px.
- **Dimensiones**: 160px ancho x 600px altura (1:3.75)
- **Objetivo**: Mostrar la imagen completa sin distorsión

## 🔧 **Props de los Componentes**

Ambos componentes comparten las mismas props:

Todos los componentes comparten las mismas props:

```jsx
// SuggestionsAside (Sidebar - imagen completa en 280x280px)
<SuggestionsAside 
  displayMode="random"
  maxSuggestions={3}
/>

// SuggestionsHorizontal (Grid - imagen completa en 300px altura)
<SuggestionsHorizontal 
  displayMode="random"
  maxSuggestions={4}
/>

// SuggestionsBanner (Proporción exacta 160x600px)
<SuggestionsBanner 
  displayMode="random"
  maxSuggestions={3}
/>
```

## 🎨 **Cuándo usar cada componente**

### **SuggestionsAside** - Usar cuando:
- ✅ Necesitas un sidebar lateral en desktop
- ✅ Tienes espacio limitado (280px de ancho)
- ✅ Quieres ver la imagen completa sin cortes
- ✅ El layout principal necesita complemento visual

### **SuggestionsHorizontal** - Usar cuando:
- ✅ Tienes una sección completa disponible
- ✅ Quieres mostrar 4+ destinos en grid
- ✅ Necesitas un layout responsive
- ✅ Prefieres más información visible por tarjeta

### **SuggestionsBanner** - Usar cuando:
- ✅ Quieres mostrar las imágenes en proporción exacta 160x600px
- ✅ El diseño permite elementos muy verticales
- ✅ Buscas un efecto visual impactante con banners reales
- ✅ Tienes espacio horizontal para múltiples banners

## 📐 **Comparación de dimensiones:**

| Componente | Ancho | Altura imagen | Proporción | object-fit |
|------------|-------|---------------|------------|------------|
| **SuggestionsAside** | 280px | 280px | 1:1 | `contain` |
| **SuggestionsHorizontal** | Flexible | 300px | Flexible | `contain` |
| **SuggestionsBanner** | 160px | 600px | 1:3.75 | `cover` |

## 🎨 **Ejemplos de Uso**

### **1. Modo Aleatorio (Default)**
```jsx
// Muestra sugerencias aleatorias de la configuración
<SuggestionsAside 
  displayMode="random"
  maxSuggestions={3}
/>
```

### **2. Modo Condicional**
```jsx
// Muestra sugerencias basadas en una condición específica
<SuggestionsAside 
  displayMode="conditional"
  condition="popular"
  maxSuggestions={3}
/>
```

### **3. Sugerencias Customizadas**
```jsx
const customSuggestions = [
  {
    id: 'custom1',
    title: 'Destino Especial',
    subtitle: 'Promoción limitada',
    description: 'Oferta exclusiva por tiempo limitado',
    image: '/path/to/image.jpg',
    price: 'Desde $199',
    tag: 'Oferta',
    destination: 'XYZ'
  }
];

<SuggestionsAside 
  suggestions={customSuggestions}
  onSuggestionClick={(suggestion) => console.log(suggestion)}
/>
```

## 📊 **Condiciones Disponibles**

Las condiciones se definen en `/src/config/suggestions.js`:

- **`popular`**: Destinos populares (Miami, NYC)
- **`international`**: Destinos internacionales (Madrid, París, Londres)
- **`national`**: Destinos nacionales (Bariloche, Mendoza, Salta)
- **`alternative`**: Opciones alternativas (Brasil, Chile, Perú)
- **`seasonal`**: Ofertas de temporada (Europa verano, esquí)
- **`business`**: Viajes de negocios (São Paulo, Santiago)

## 🎯 **Integración en ResultsList**

```jsx
// Lógica para determinar condición según contexto
const getSuggestionCondition = () => {
  const criteria = getSearchCriteria();
  
  if (criteria.origin === 'EZE') {
    if (criteria.destination?.includes('MIA')) {
      return 'popular';
    }
    return 'international';
  }
  
  if (vuelos.results.length === 0) {
    return 'alternative';
  }
  
  return 'random';
};

// En el componente
<SuggestionsAside
  displayMode="conditional"
  condition={getSuggestionCondition()}
  maxSuggestions={3}
  onSuggestionClick={handleSuggestionClick}
/>
```

## 📱 **Responsive Design**

```jsx
// Desktop: Sidebar derecho
{!isMobile && (
  <Grid item lg={4}>
    <SuggestionsAside
      displayMode="conditional"
      condition={getSuggestionCondition()}
      maxSuggestions={3}
    />
  </Grid>
)}

// Mobile: Debajo de resultados
{isMobile && (
  <Grid item xs={12}>
    <SuggestionsAside
      displayMode="random"
      maxSuggestions={2}
    />
  </Grid>
)}
```

## 🖼️ **Configuración de Imágenes**

### **Especificaciones de las imágenes:**
- **Dimensiones**: 160x600 píxeles (formato vertical/banner)
- **Formato**: PNG recomendado para mejor calidad
- **Ubicación**: `/front/public/images/`

### **Imágenes disponibles:**

```
/front/public/images/
├── Amsterdam.png      (160x600px)
├── Auckland.png       (160x600px)
├── BA.png            (160x600px)
├── Barcelona.png      (160x600px)
├── Bogota.png        (160x600px)
├── Frankfurt.png      (160x600px)
├── Lima.png          (160x600px)
├── Londres.png        (160x600px)
├── Los Angeles.png    (160x600px)
├── Madrid.png         (160x600px)
├── Mexico DF.png      (160x600px)
├── Miami.png          (160x600px)
├── New York.png       (160x600px)
├── Paris.png          (160x600px)
├── Roma.png           (160x600px)
├── San Francisco.png  (160x600px)
├── Santiago.png       (160x600px)
├── Sao Paulo.png      (160x600px)
├── Sydney.png         (160x600px)
└── Toronto.png        (160x600px)
```

### **Optimización para imágenes verticales:**

```jsx
// Componente vertical para sidebar
<SuggestionsAside 
  displayMode="random"
  maxSuggestions={3}
/>

// Componente horizontal para section completa
<SuggestionsHorizontal 
  displayMode="random"
  maxSuggestions={4}
/>
```

### **Ajustes de estilo:**

```jsx
<CardMedia
  component="img"
  height={180} // Altura optimizada para 160x600px
  sx={{
    objectFit: 'cover',
    objectPosition: 'center', // Centrar imagen
    filter: 'brightness(0.9)',
  }}
/>
```

## 🎨 **Estilos y Temas**

El componente usa Material-UI y respeta el tema:
- **Colores primarios** para tags y botones
- **Hover effects** en las tarjetas
- **Alpha transparency** para fondos
- **Responsive breakpoints** para móvil/desktop

## 🔄 **Callbacks y Eventos**

```jsx
const handleSuggestionClick = (suggestion) => {
  console.log('Sugerencia clickeada:', suggestion);
  
  // Ejemplos de uso:
  // 1. Actualizar búsqueda con nuevo destino
  setDestination(suggestion.destination);
  
  // 2. Navegar a página de destino
  navigate(`/destinations/${suggestion.destination}`);
  
  // 3. Abrir modal con más información
  setSelectedDestination(suggestion);
  setModalOpen(true);
  
  // 4. Tracking de analytics
  analytics.track('suggestion_clicked', {
    destination: suggestion.destination,
    price: suggestion.price,
    condition: suggestion.condition
  });
};
```

## 📈 **Casos de Uso Avanzados**

### **1. Sugerencias por Temporada**
```jsx
const getSeasonalCondition = () => {
  const month = new Date().getMonth();
  
  if (month >= 11 || month <= 2) {
    return 'seasonal'; // Verano: Europa, ski
  } else if (month >= 5 && month <= 8) {
    return 'national'; // Invierno: destinos nacionales
  }
  
  return 'random';
};
```

### **2. Sugerencias por Tipo de Usuario**
```jsx
const getUserCondition = (userProfile) => {
  if (userProfile.businessTraveler) {
    return 'business';
  }
  
  if (userProfile.budget === 'low') {
    return 'national';
  }
  
  if (userProfile.interests.includes('culture')) {
    return 'international';
  }
  
  return 'popular';
};
```

### **3. Filtros Dinámicos**
```jsx
// Excluir destinos ya seleccionados
const filteredSuggestions = getAllSuggestions().filter(
  suggestion => suggestion.destination !== currentDestination
);

<SuggestionsAside 
  suggestions={filteredSuggestions}
  maxSuggestions={3}
/>
```

## ✨ **Características**

- ✅ **Responsive**: Se adapta a móvil y desktop
- ✅ **Configurable**: Múltiples modos de visualización
- ✅ **Extensible**: Fácil agregar nuevas condiciones
- ✅ **Themed**: Integrado con Material-UI theme
- ✅ **Interactive**: Hover effects y callbacks
- ✅ **Performance**: Lazy loading de imágenes
- ✅ **Accessible**: Semántica correcta y navegación por teclado

¡El componente está listo para mostrar sugerencias dinámicas y mejorar la experiencia de usuario! 🎉