export interface SystemWithClientName {
  id: number;
  clientid: number;
  name: string;
  description: string | null;
  remoteaccesslink: string | null;
  downpayment: number | null;
  monthlypayment: number | null;
  yearlypayment: number | null;
  currency: string | null;
  created_at: string; 
  paymentmethod: string | null;
  clientname: string;
}
