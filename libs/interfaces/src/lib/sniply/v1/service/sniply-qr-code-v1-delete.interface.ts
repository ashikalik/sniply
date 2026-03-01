export interface ISniplyQrCodeV1Delete {
  softDeleteByCode(code: string, userId: string): Promise<boolean>;
  softDeleteByCodes(codes: string[], userId: string): Promise<number>;
}
