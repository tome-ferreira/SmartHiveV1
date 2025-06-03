interface UpdateStripePayload {
  productId: string;
  type: 'installation' | 'maintenance';
  updatedFields: {
    name?: string;
    description?: string;
    active?: boolean;
    prices?: {
      id: string;
      amount: number;
    }[];
  };
}
