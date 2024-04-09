import { IUser } from '../models/userModel'; 

declare global {
  namespace Express {
    interface RequestWithUser extends Request {
      user?: IUser;
    }
  }
}
