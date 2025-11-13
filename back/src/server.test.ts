import { Server } from 'http'

// Mock dependencies before imports
jest.mock('./app', () => ({
  __esModule: true,
  default: {
    listen: jest.fn((_config, callback) => {
      callback()
      return {} as Server
    })
  }
}))

jest.mock('./kafka/kafka', () => ({
  connectConsumer: jest.fn().mockResolvedValue(undefined)
}))

jest.mock('dotenv', () => ({
  config: jest.fn()
}))

import app from './app'
import { connectConsumer } from './kafka/kafka'
import dotenv from 'dotenv'

describe('server', () => {
  let consoleLogSpy: jest.SpyInstance
  let consoleErrorSpy: jest.SpyInstance
  let originalEnv: NodeJS.ProcessEnv

  beforeEach(() => {
    // Save original environment
    originalEnv = { ...process.env }

    // Setup spies
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation()
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()

    // Clear all mocks
    jest.clearAllMocks()
  })

  afterEach(() => {
    // Restore original environment
    process.env = originalEnv

    // Restore console methods
    consoleLogSpy.mockRestore()
    consoleErrorSpy.mockRestore()
  })

  it('should load dotenv configuration', async () => {
    // Clear the module cache to force re-import
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    jest.isolateModules(() => { void require('./server') })

    expect(dotenv.config).toHaveBeenCalled()
  })

  it('should start server on default port 3000 when PORT is not set', async () => {
    delete process.env.PORT
    delete process.env.NODE_ENV

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    jest.isolateModules(() => { void require('./server') })

    expect(app.listen).toHaveBeenCalledWith(
      expect.objectContaining({
        port: 3000,
        env: 'development'
      }),
      expect.any(Function)
    )
  })

  it('should start server on custom port when PORT is set', async () => {
    process.env.PORT = '8080'

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    jest.isolateModules(() => { void require('./server') })

    expect(app.listen).toHaveBeenCalledWith(
      expect.objectContaining({
        port: '8080'
      }),
      expect.any(Function)
    )
  })

  it('should use NODE_ENV from environment when set', async () => {
    process.env.NODE_ENV = 'production'

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    jest.isolateModules(() => { void require('./server') })

    expect(app.listen).toHaveBeenCalledWith(
      expect.objectContaining({
        env: 'production'
      }),
      expect.any(Function)
    )
  })

  it('should log server start message', async () => {
    process.env.PORT = '3000'

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    jest.isolateModules(() => { void require('./server') })

    expect(consoleLogSpy).toHaveBeenCalledWith('Server running on port 3000')
  })

  it('should connect Kafka consumer and log success', async () => {
    ;(connectConsumer as jest.Mock).mockResolvedValue(undefined)

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    jest.isolateModules(() => { void require('./server') })

    // Wait for async operations
    await new Promise(process.nextTick)

    expect(connectConsumer).toHaveBeenCalled()
    expect(consoleLogSpy).toHaveBeenCalledWith('Kafka consumer connected and running')
  })

  it('should handle Kafka consumer connection error', async () => {
    const mockError = new Error('Kafka connection failed')
    ;(connectConsumer as jest.Mock).mockRejectedValue(mockError)

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    jest.isolateModules(() => { void require('./server') })

    // Wait for async operations
    await new Promise(process.nextTick)

    expect(connectConsumer).toHaveBeenCalled()
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error connecting Kafka consumer:', mockError)
  })

  it('should not block server startup if Kafka fails', async () => {
    ;(connectConsumer as jest.Mock).mockRejectedValue(new Error('Kafka failed'))

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    jest.isolateModules(() => { void require('./server') })

    // Server should still start
    expect(app.listen).toHaveBeenCalled()
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Server running on port'))
  })
})
