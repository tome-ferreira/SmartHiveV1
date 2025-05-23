export interface System{
    id?: number;
    ClientId?: number;
    Name: string;
    Description? : string | null;
    RemoteAccessLink: string;
    Downpayment: number;
    MonthlyPayment: number;
    YearlyPayment: number;
    Currency: string;
    PaymentMethod: string;
    created_at?: string; 
}