import { Navigate, Outlet } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useAuthStore } from '../../Auth/Providers/AuthProvider';

const ProtectedRouteComponent = () => {
  const store = useAuthStore();

  if (!store.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export const ProtectedRoute = observer(ProtectedRouteComponent);
