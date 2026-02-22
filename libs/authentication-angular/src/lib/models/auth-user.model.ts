export interface IAuthUserModel {
  id: string;
  email: string;
  emailVerifiedAt?: string | null;
  status?: string;
  createdAt?: string;
}
