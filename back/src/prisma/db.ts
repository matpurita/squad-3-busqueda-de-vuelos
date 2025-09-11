import { PrismaClient } from '@prisma/client'

type PrismaClientOptions = ConstructorParameters<typeof PrismaClient>[0];

const developmentOptions: PrismaClientOptions = {
  log: ['query', 'info', 'warn', 'error'],
  errorFormat: 'pretty'
}

const productionOptions: PrismaClientOptions = {
  log: ['warn', 'error'],
  errorFormat: 'minimal'
}

const options = process.env.NODE_ENV === 'production' ? productionOptions : developmentOptions

export const prisma = new PrismaClient(options)
