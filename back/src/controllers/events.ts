import { Request, Response } from 'express'
import { prisma } from '../prisma/db'

async function handleEvent (req: Request, res: Response) {
  const { event, data } = req.body

  // Here you can process the event and data as needed
  console.log(`Received event: ${event}`, data)

  try {
    switch (event) {
      case 'new_flight':
        await prisma.flight.create({ data })

        break
      case 'flight_update':
        await prisma.flight.update({
          where: { id: data.id },
          data
        })
        break
      case 'flight_deleted':
        await prisma.flight.delete({
          where: { id: data.id }
        })
        break
      default:
        return res.status(400).json({ message: 'Unknown event type' })
    }
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error })
  }

  res.status(201).json({ message: 'Event received', event })
}

export default { handleEvent }