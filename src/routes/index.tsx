import { Routes as RouterRoutes, Route, Navigate } from 'react-router-dom';
import { GuestGuard } from '@/routes/guards/GuestGuard';
import { AuthGuard } from '@/routes/guards/AuthGuard';

export function Routes() {
  return (
    <RouterRoutes>
      {/* ── Public routes ── */}
      <Route element={<GuestGuard />}>
        <Route path="/login" element={<div />} />
      </Route>

      {/* ── Protected routes ── */}
      <Route element={<AuthGuard />}>
        <Route path="/dashboard" element={<div />} />
        <Route path="/profile" element={<div />} />
        <Route path="/memberships" element={<div />} />
        <Route path="/payments" element={<div />} />
        <Route path="/family" element={<div />} />
      </Route>

      {/* ── Catch-all → redirect to login ── */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </RouterRoutes>
  );
}
