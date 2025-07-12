import { Session } from "express-session";

declare module "express-session" {
  interface SessionData {
    userId?: number;
    user?: {
      id: number;
      email: string;
      name: string;
      role: string;
    };
  }
}

export interface AuthenticatedRequest extends Express.Request {
  session: Session & SessionData;
}