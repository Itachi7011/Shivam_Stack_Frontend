import { Navigate } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';

export default function RequireAdmin({ children, requiredPermissions = [] }) {
  const { admin, loading, isAuthenticated, hasAllPermissions } = useAdmin();
  
  if (loading) {
    return <div className="admin-loading">Loading admin panel...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  
  // Check permissions if required
  if (requiredPermissions.length > 0 && !hasAllPermissions(requiredPermissions)) {
    return <Navigate to="/admin/dashboard" replace />;
  }
  
  return children;
}