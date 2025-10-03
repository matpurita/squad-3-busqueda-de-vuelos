import { NextFunction, Request, Response } from 'express'
import { searchMetricSchema } from '../schemas/searchMetric'
import { prisma } from '../prisma/db'

async function postSearchMetric(req: Request, res: Response, next: NextFunction) {
  try {
    const searchMetric = searchMetricSchema.parse({
      userId: req.user!.userId,
      flightsTo: req.body.flightsTo,
      flightsFrom: req.body.flightsFrom,
      dateFrom: req.body.dateFrom,
      dateTo: req.body.dateTo,
      resultsCount: req.body.resultsCount,
      timestamp: req.body.timestamp
    })

    prisma.searchMetrics.create({ data: searchMetric })

    // Send to core
    // await fetch('http://localhost:9090/metrics', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' }
    // })

    res.status(201).json({ message: 'Search metric recorded' })
  } catch (error) {
    next(error)
  }
}

export default { postSearchMetric }
