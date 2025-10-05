import { AuthPayload } from './schemas/authPayload'

declare global {
  namespace Express {
    export interface Request {
      user?: AuthPayload
    }
  }
}
