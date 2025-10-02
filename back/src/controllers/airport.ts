import { Request, Response } from 'express'
import { prisma } from '../prisma/db'

async function getAllAirports(_: Request, res: Response) {
  const airports = await prisma.airport.findMany()
  
  res.json(airports)
}

async function getAllAITA(_: Request, res: Response) {
  const airports = await prisma.airport.findMany({
    select: {
      code: true
    }
  })

  const aitaList = airports.map((airport) => airport.code)

  res.json(aitaList)
}

export default { getAllAirports, getAllAITA }