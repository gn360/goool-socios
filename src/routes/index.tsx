import { Routes as RouterRoutes, Route, Navigate } from 'react-router-dom';
import { GuestGuard } from '@/routes/guards/GuestGuard';
import { AuthGuard } from '@/routes/guards/AuthGuard';
import { AuthLayout } from '@/layouts/AuthLayout';
import { UnauthLayout } from '@/layouts/UnauthLayout';
import { ErrorBoundary } from '@/app/components/ErrorBoundary';
import { LoginPage, ForgotPasswordPage, DashboardPage, NotFoundPage } from '@/app';
import { FamilyPage } from '@/app/features/family';
import { PaymentMethodsPage, PaymentHistoryPage, InvoiceListPage, RecurringPaymentsPage } from '@/app/features/payments';
import { CheckoutPage, ConfirmationPage } from '@/app/features/payments';

export function Routes() {
  return (
    <ErrorBoundary>
      <RouterRoutes>
        {/* ── Public routes ── */}
        <Route element={<GuestGuard />}>
          <Route element={<UnauthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          </Route>
        </Route>

        {/* ── Protected routes ── */}
        <Route element={<AuthGuard />}>
          <Route element={<AuthLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/profile" element={<div />} />
            <Route path="/memberships" element={<div />} />
            <Route path="/payments" element={<PaymentHistoryPage />} />
            <Route path="/payment-methods" element={<PaymentMethodsPage />} />
            <Route path="/invoices" element={<InvoiceListPage />} />
            <Route path="/recurring-payments" element={<RecurringPaymentsPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/payment/confirmation" element={<ConfirmationPage />} />
            <Route path="/family" element={<FamilyPage />} />
          </Route>
        </Route>

        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </RouterRoutes>
    </ErrorBoundary>
  );
}
