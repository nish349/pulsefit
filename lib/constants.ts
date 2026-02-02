
export interface PromoCode {
  code: string;
  discountType: 'percent' | 'fixed';
  value: number;
}

export const validPromoCodes: PromoCode[] = [
  { code: 'WELCOME20', discountType: 'percent', value: 20 },
  { code: 'START50', discountType: 'fixed', value: 50 },
  { code: 'FIT10', discountType: 'percent', value: 10 },
];
