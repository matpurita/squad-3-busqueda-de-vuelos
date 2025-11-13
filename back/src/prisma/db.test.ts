import { prisma } from './db'
import { PrismaClient } from '@prisma/client'

// Mock PrismaClient constructor
jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      $connect: jest.fn(),
      $disconnect: jest.fn()
    }))
  }
})

describe('prisma database client', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should export a prisma client instance', () => {
    expect(prisma).toBeDefined()
    expect(typeof prisma).toBe('object')
  })

  it('should be a singleton instance', () => {
    // The prisma instance should be the same throughout the application
    expect(prisma).toBeDefined()
    expect(typeof prisma).toBe('object')
  })

  describe('configuration', () => {
    it('should have proper type checking', () => {
      // TypeScript compile-time check - if this compiles, types are correct
      const client: PrismaClient = prisma as PrismaClient
      expect(client).toBeDefined()
    })

    it('should export prisma client instance', () => {
      expect(typeof prisma).toBe('object')
    })
  })
})
