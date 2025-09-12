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

  const airports: Airport[] = await Promise.all(
    airportInput.map(async (a) => await prisma.airport.create({ data: a }))
  )

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

  const airlines: Airline[] = await Promise.all(
    airlineInput.map(async (al) => await prisma.airline.create({ data: al }))
  )

  console.log('Creating flights for each airport pair, daily...')
  const baseDate = new Date()
  const flightsPerDay: number = 4 // one flight per day per pair
  const daysAhead: number = 60 // generate flights for 30 days

  for (let d = 0; d < daysAhead; d++) {
    for (const origin of airports) {
      for (const destination of airports) {
        if (origin.id === destination.id) continue
        const dailyBatch: Promise<unknown>[] = []

        for (let fpd = 0; fpd < flightsPerDay; fpd++) {
          const airline = airlines[randomInt(0, airlines.length - 1)]
          const departure = new Date(baseDate)
          departure.setDate(baseDate.getDate() + d)
          departure.setHours(randomInt(5, 22), [0, 15, 30, 45][randomInt(0, 3)], 0, 0)

          const duration = randomInt(60, 720)
          const arrival = addMinutes(departure, duration)
          const flightNumber = `${airline.code}${randomInt(100, 9999)}`

          const seatsData: Prisma.SeatsCreateManyFlightInput[] = []
          const letters = ['A', 'B', 'C', 'D']
          for (let row = 1; row <= 10; row++) {
            for (const letter of letters) {
              const seatNumber = `${row}${letter}`
              const clazz = row <= 2 ? 'Business' : 'Economy'
              const base = Math.max(50, Math.round(duration * 0.5))
              const multiplier = clazz === 'Business' ? 2.5 : 1.0
              const jitter = randomInt(-10, 30)
              const price = Number((base * multiplier + jitter).toFixed(2))
              const isAvailable = Math.random() > 0.05

              seatsData.push({ seatNumber, class: clazz, price, isAvailable })
            }
          }

          dailyBatch.push(
            prisma.flight.create({
              data: {
                flightNumber,
                departure,
                arrival,
                duration,
                airline: { connect: { id: airline.id } },
                origin: { connect: { id: origin.id } },
                destination: { connect: { id: destination.id } },
                seats: {
                  createMany: {
                    data: seatsData
                  }
                }
              }
            })
          )
        }

        await Promise.all(dailyBatch)
      }
    }
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
