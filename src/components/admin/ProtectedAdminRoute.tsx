import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
}

export function ProtectedAdminRoute({ children }: ProtectedAdminRouteProps) {
  const { user, isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-destructive mb-4">অ্যাক্সেস নেই</h1>
          <p className="text-muted-foreground mb-4">
            আপনার এই পেজে প্রবেশের অনুমতি নেই। শুধুমাত্র অ্যাডমিনরা এই পেজে প্রবেশ করতে পারবেন।
          </p>
          <a href="/" className="text-primary hover:underline">
            হোমপেজে ফিরে যান
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
