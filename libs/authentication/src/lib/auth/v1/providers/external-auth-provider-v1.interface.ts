export interface IExternalAuthV1Identity {
  provider: string;
  providerUserId: string;
  email: string;
  emailVerified: boolean;
  displayName?: string | null;
}

export interface IExternalAuthV1Provider {
  provider: string;
  verify(idToken: string): Promise<IExternalAuthV1Identity>;
}
