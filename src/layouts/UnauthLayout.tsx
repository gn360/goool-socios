import { Outlet } from 'react-router-dom';
import { APP_NAME } from '@/config/app';

export function UnauthLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-brand-primary">{APP_NAME}</h1>
        <p className="text-sm text-gray-500 mt-1">Portal de socios</p>
      </div>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
        <Outlet />
      </div>

      <p className="mt-8 text-sm text-gray-400">
        &copy; {new Date().getFullYear()} {APP_NAME}
      </p>
    </div>
  );
}
