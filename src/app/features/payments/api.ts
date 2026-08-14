import type { AxiosInstance } from 'axios';
import type { PaymentMethodDTO } from '@goool/sdk';

interface PaymentMethodsResponse {
  data: PaymentMethodDTO[];
}

export async function getPaymentMethods(
  client: AxiosInstance,
): Promise<PaymentMethodDTO[]> {
  const response = await client.get<PaymentMethodsResponse>(
    '/socios/v1/payment-methods',
  );

  return response.data.data;
}
