// Datos mock simples para vuelos
export const vuelos = [
  {
    id: 1,
    origen: "Buenos Aires",
    destino: "Madrid",
    aerolinea: "Iberia",
    numeroVuelo: "IB6845",
    fechaSalida: "2024-02-15T10:30:00",
    fechaLlegada: "2024-02-16T05:45:00",
    precio: 850,
    duracion: "11h 15m",
    escalas: 0
  },
  {
    id: 2,
    origen: "Buenos Aires",
    destino: "Barcelona",
    aerolinea: "Air Europa",
    numeroVuelo: "UX25",
    fechaSalida: "2024-02-15T14:20:00",
    fechaLlegada: "2024-02-16T09:35:00",
    precio: 920,
    duracion: "11h 15m",
    escalas: 0
  },
  {
    id: 3,
    origen: "Buenos Aires",
    destino: "París",
    aerolinea: "Air France",
    numeroVuelo: "AF417",
    fechaSalida: "2024-02-16T22:15:00",
    fechaLlegada: "2024-02-17T17:30:00",
    precio: 1100,
    duracion: "13h 15m",
    escalas: 0
  },
  {
    id: 4,
    origen: "Buenos Aires",
    destino: "Nueva York",
    aerolinea: "American Airlines",
    numeroVuelo: "AA997",
    fechaSalida: "2024-02-17T11:00:00",
    fechaLlegada: "2024-02-17T19:30:00",
    precio: 750,
    duracion: "8h 30m",
    escalas: 0
  },
  {
    id: 5,
    origen: "Buenos Aires",
    destino: "Miami",
    aerolinea: "LATAM",
    numeroVuelo: "LA802",
    fechaSalida: "2024-02-18T09:15:00",
    fechaLlegada: "2024-02-18T16:45:00",
    precio: 680,
    duracion: "7h 30m",
    escalas: 0
  },
  {
    id: 6,
    origen: "Buenos Aires",
    destino: "Madrid",
    aerolinea: "Air Europa",
    numeroVuelo: "UX27",
    fechaSalida: "2024-02-19T08:00:00",
    fechaLlegada: "2024-02-20T03:15:00",
    precio: 780,
    duracion: "11h 15m",
    escalas: 1
  },
  {
    id: 7,
    origen: "Buenos Aires",
    destino: "Barcelona",
    aerolinea: "Iberia",
    numeroVuelo: "IB6847",
    fechaSalida: "2024-02-20T12:30:00",
    fechaLlegada: "2024-02-21T07:45:00",
    precio: 890,
    duracion: "11h 15m",
    escalas: 0
  },
  {
    id: 8,
    origen: "Buenos Aires",
    destino: "París",
    aerolinea: "LATAM",
    numeroVuelo: "LA804",
    fechaSalida: "2024-02-21T16:45:00",
    fechaLlegada: "2024-02-22T12:00:00",
    precio: 1050,
    duracion: "13h 15m",
    escalas: 1
  }
];

// Datos mock simples para aeropuertos
export const aeropuertos = [
  { codigo: "BUE", nombre: "Aeropuerto Ezeiza", ciudad: "Buenos Aires" },
  { codigo: "MAD", nombre: "Aeropuerto Madrid-Barajas", ciudad: "Madrid" },
  { codigo: "BCN", nombre: "Aeropuerto Barcelona-El Prat", ciudad: "Barcelona" },
  { codigo: "CDG", nombre: "Aeropuerto Charles de Gaulle", ciudad: "París" },
  { codigo: "JFK", nombre: "Aeropuerto JFK", ciudad: "Nueva York" },
  { codigo: "MIA", nombre: "Aeropuerto Miami", ciudad: "Miami" }
];
