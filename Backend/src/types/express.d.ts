import { IUser } from '../models/userModel'; // Adjust the import path if necessary

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}
