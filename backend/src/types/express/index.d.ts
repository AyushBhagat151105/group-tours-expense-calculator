export interface decodeUserType {
  id: string;
}

import { Request } from "express";

export interface AuthenticatedRequest extends Request {
  user?: decodeUserType;
}
