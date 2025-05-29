export interface FullSystemFormData {
  ClientId: number;
  Name: string;
  Description?: string;
  RemoteAccessLink?: string;
  Currency: string;
  PaymentMethod: string;
  Downpayment: number;
  MonthlyPayment: number;
  YearlyPayment: number;
}