import { IAuthUserModel } from './auth-user.model';

export interface IAuthSessionModel {
  tokenType: 'Bearer';
  accessToken: string;
  accessTokenExpiresInSec: number;
  refreshToken?: string;
  refreshTokenExpiresAt?: string;
  sessionId?: string;
  user: IAuthUserModel;
}
