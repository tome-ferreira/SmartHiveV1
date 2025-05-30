export interface FullSystemDetails {
  id: number;
  clientid: number;
  clientname: string;
  name: string;
  description: string;
  remoteaccesslink: string;
  installation_product_id: string;
  maintenance_product_id: string;
  downpayment: number | null;
  downpaymentPaymentId: string | null;
  monthlypayment: number | null;
  monthlypaymentpaymentid: string | null;
  yearlypayment: number | null;
  yearlypaymentpaymentid: string | null;
  isactive: boolean;
  currency: string | null;
  created_at: string; 
}
