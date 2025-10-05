declare global {
  namespace Express {
    export interface Request {
      user?: import('../schemas/authPayload').AuthPayload
    }
  }
}
