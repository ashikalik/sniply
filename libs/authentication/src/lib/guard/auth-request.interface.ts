import { Request } from 'express';
import { IAuthUser } from './auth-user.interface';

export interface IAuthRequest extends Request {
  authUser?: IAuthUser;
}
