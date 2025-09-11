// prisma/seed.ts
import { Airline, Airport, Prisma, PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function addMinutes(date: Date, minutes: number) {
  return new Date(date.getTime() + minutes * 60000)
}

async function main() {
  console.log('Cleaning database...')
  // Orden: borrar dependencias primero
  await prisma.seats.deleteMany({})
  await prisma.flight.deleteMany({})
  await prisma.airline.deleteMany({})
  await prisma.airport.deleteMany({})

  console.log('Creating airports...')
  const airportInput = [
    {
      code: 'EZE',
      name: 'Ministro Pistarini International',
      city: 'Buenos Aires',
      country: 'Argentina'
    },
    { code: 'AEP', name: 'Aeroparque Jorge Newbery', city: 'Buenos Aires', country: 'Argentina' },
    { code: 'JFK', name: 'John F. Kennedy Intl', city: 'New York', country: 'USA' },
    { code: 'LAX', name: 'Los Angeles Intl', city: 'Los Angeles', country: 'USA' },
    { code: 'SCL', name: 'Arturo Merino Benitez', city: 'Santiago', country: 'Chile' },
    { code: 'GRU', name: 'Guarulhos Intl', city: 'São Paulo', country: 'Brazil' },
    { code: 'BOG', name: 'El Dorado Intl', city: 'Bogotá', country: 'Colombia' },
    { code: 'LIM', name: 'Jorge Chávez Intl', city: 'Lima', country: 'Peru' },
    { code: 'MEX', name: 'Benito Juárez Intl', city: 'Mexico City', country: 'Mexico' },
    { code: 'MIA', name: 'Miami Intl', city: 'Miami', country: 'USA' },
    { code: 'SFO', name: 'San Francisco Intl', city: 'San Francisco', country: 'USA' },
    { code: 'YYZ', name: 'Toronto Pearson', city: 'Toronto', country: 'Canada' },
    { code: 'MAD', name: 'Adolfo Suárez Madrid-Barajas', city: 'Madrid', country: 'Spain' },
    { code: 'BCN', name: 'Barcelona–El Prat', city: 'Barcelona', country: 'Spain' },
    { code: 'LHR', name: 'Heathrow', city: 'London', country: 'UK' },
    { code: 'CDG', name: 'Charles de Gaulle', city: 'Paris', country: 'France' },
    { code: 'FRA', name: 'Frankfurt Intl', city: 'Frankfurt', country: 'Germany' },
    { code: 'AMS', name: 'Schiphol', city: 'Amsterdam', country: 'Netherlands' },
    { code: 'SYD', name: 'Kingsford Smith', city: 'Sydney', country: 'Australia' },
    { code: 'AKL', name: 'Auckland Intl', city: 'Auckland', country: 'New Zealand' }
  ]

  const airports: Airport[] = []
  for (const a of airportInput) {
    const created = await prisma.airport.create({ data: a })
    airports.push(created)
  }

  console.log('Creating airlines...')
  const airlineInput = [
    { code: 'AR', name: 'Aerolíneas Argentinas' },
    { code: 'AA', name: 'American Airlines' },
    { code: 'DL', name: 'Delta Air Lines' },
    { code: 'UA', name: 'United Airlines' },
    { code: 'LA', name: 'LATAM Airlines' },
    { code: 'BA', name: 'British Airways' },
    { code: 'AF', name: 'Air France' },
    { code: 'LH', name: 'Lufthansa' },
    { code: 'QF', name: 'Qantas' },
    { code: 'AC', name: 'Air Canada' }
  ]

  const airlines: Airline[] = []
  for (const al of airlineInput) {
    const created = await prisma.airline.create({ data: al })
    airlines.push(created)
  }

  console.log('Creating flights...')
  const flights: Prisma.FlightGetPayload<{
    include: {
      origin: true,
      destination: true,
      airline: true
    }
  }>[] = []

  // Helper to pick random airport that is not equal to origin
  function pickDestination(excludeCode: string) {
    const pool = airports.filter((p) => p.code !== excludeCode)
    return pool[randomInt(0, pool.length - 1)]
  }

  const baseDate = new Date() // now
  // We'll create 60 flights distributed among airports/airlines
  for (let i = 0; i < 60; i++) {
    const airline = airlines[randomInt(0, airlines.length - 1)]
    const origin = airports[randomInt(0, airports.length - 1)]
    const destination = pickDestination(origin.code)

    const departOffsetDays = randomInt(1, 45) // within next 45 days
    const departHour = randomInt(0, 23)
    const departMinute = [0, 15, 30, 45][randomInt(0, 3)]

    const departure = new Date(baseDate)
    departure.setDate(baseDate.getDate() + departOffsetDays)
    departure.setHours(departHour, departMinute, 0, 0)

    // duration between 1h and 12h -> 60 to 720 minutes
    const durationMins = randomInt(60, 720)
    const arrival = addMinutes(departure, durationMins)

    const flightNumber = `${airline.code}${randomInt(100, 9999)}`

    const flight = await prisma.flight.create({
      data: {
        flightNumber,
        departure,
        arrival,
        durationMins,
        airline: { connect: { id: airline.id } },
        origin: { connect: { id: origin.id } },
        destination: { connect: { id: destination.id } }
      }
    })

    flights.push({ ...flight, origin, destination, airline })
  }

  console.log('Creating seats for each flight (40 seats per flight)...')
  // Generate seats per flight using createMany for performance
  for (const f of flights) {
    const seatsData: {
      flightId: string
      seatNumber: string
      class: string
      price: number
      isAvailable?: boolean
    }[] = []

    // Seat layout: rows 1..10, seats A..D -> 10 * 4 = 40
    const letters = ['A', 'B', 'C', 'D']
    for (let row = 1; row <= 10; row++) {
      for (const letter of letters) {
        const seatNumber = `${row}${letter}`
        // define class: rows 1-2 -> Business, rest Economy
        const clazz = row <= 2 ? 'Business' : 'Economy'

        // base price: depends on duration
        const base = Math.max(50, Math.round(f.durationMins * 0.5))
        // Business premium multiplier
        const multiplier = clazz === 'Business' ? 2.5 : 1.0
        // small random adjustment
        const jitter = randomInt(-10, 30)
        const price = Number((base * multiplier + jitter).toFixed(2))

        // mark some seats as unavailable randomly (5% chance)
        const isAvailable = Math.random() > 0.05

        seatsData.push({
          flightId: f.id,
          seatNumber,
          class: clazz,
          price,
          isAvailable
        })
      }
    }

    // createMany in batches (all 40 at once)
    await prisma.seats.createMany({
      data: seatsData
    })
  }

  console.log('Seed finished!')
}

main()
  .catch((e) => {
    console.error(e)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
