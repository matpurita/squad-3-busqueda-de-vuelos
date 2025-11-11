// Flight Created Event
export interface FlightCreatedEvent {
  flightId: string;
  flightNumber: string;
  origin: string;
  destination: string;
  aircraftModel: string;
  departureAt: string; // ISO 8601 date-time format
  arrivalAt: string;   // ISO 8601 date-time format
  status: string;
  price: number;
  currency: string;    // 3-character currency code
}

// Flight Updated Event
export interface FlightUpdatedEvent {
  flightId: string;
  newStatus: string;
  newDepartureAt?: string; // Optional, can be undefined
  newArrivalAt?: string;   // Optional, can be undefined
}

// Reservation Created Event
export interface ReservationCreatedEvent {
  reservationId: string;
  userId: string;
  flightId: string;
  amount: number;
  currency: string; // 3-character currency code
  reservedAt: string; // ISO 8601 date-time format
}

// Reservation Updated Event
export interface ReservationUpdatedEvent {
  reservationId: string;
  newStatus: string;
  reservationDate?: string; // Optional, can be undefined
  flightDate?: string;       // Optional, can be undefined
}

// User Created Event
export interface UserCreateEvent {
  userId: string;
  nombre_completo: string;
  email: string;
  password: string;
  nationalityOrOrigin: string;
  roles: string[];
  createdAt: string; // ISO 8601 date-time format
}
