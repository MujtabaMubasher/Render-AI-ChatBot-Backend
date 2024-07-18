import { Request } from 'express';
import { User } from './models/user-model.js'; // Update the path if necessary

declare module 'express-serve-static-core' {
  interface Request {
    user?: typeof User; // Make user property optional
  }
}