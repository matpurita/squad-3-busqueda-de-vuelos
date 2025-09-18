import { prisma } from '../prisma/db'

async function getAllAirports() {
  return await prisma.airport.findMany()
}

async function getAllAITA() {
  const query = await prisma.airport.findMany({
    select: {
      code: true
    }
  })

  return query.map((airport) => airport.code)
}

export default { getAllAirports, getAllAITA }