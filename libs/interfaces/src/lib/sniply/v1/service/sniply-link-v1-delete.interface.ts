export interface ISniplyLinkV1Delete {
  softDeleteByCode(code: string): Promise<boolean>;
}
