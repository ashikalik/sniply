export interface IAuthUser {
  sub: string;
  sid: string;
  email: string;
  iss: string;
  aud: string;
  iat?: number;
  exp?: number;
}
