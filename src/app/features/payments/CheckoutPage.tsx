import { PaymentAmount } from '@goool/sdk';

export function CheckoutPage() {
  return (
    <div className="space-y-6 max-w-lg mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
        <p className="text-sm text-gray-500 mt-1">Confirmá tu pago</p>
      </div>

      <div className="bg-white border rounded-xl p-6 space-y-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Membresía</span>
          <span className="font-medium text-gray-900">Plan mensual</span>
        </div>
        <div className="flex justify-between text-sm border-t pt-3">
          <span className="text-gray-500">Total</span>
          <span className="font-bold text-gray-900"><PaymentAmount amountCents={50000} /></span>
        </div>

        <button
          className="w-full py-3 text-sm font-medium rounded-lg text-white mt-4"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          Pagar ahora
        </button>

        <p className="text-xs text-gray-400 text-center">
          Pago seguro procesado por FacturaExpress
        </p>
      </div>
    </div>
  );
}

export function ConfirmationPage() {
  return (
    <div className="space-y-6 max-w-lg mx-auto text-center">
      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
        <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">¡Pago exitoso!</h1>
        <p className="text-sm text-gray-500 mt-1">Tu pago fue procesado correctamente.</p>
      </div>
      <p className="text-xs text-gray-400">Recibirás un comprobante por email.</p>
    </div>
  );
}
