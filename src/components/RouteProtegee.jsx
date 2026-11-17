import { Navigate, useLocation } from 'react-router';
import { useAuth } from '@/contexts/AuthContext.jsx';
// Une page réservée : sans utilisateur connecté, on part vers la connexion,
// en retenant d'où l'on venait. Avec un rôle demandé, il faut aussi avoir ce rôle.
export default function RouteProtegee({ children, role }) {
const { utilisateur } = useAuth();
const location = useLocation();
if (!utilisateur) {
return <Navigate to="/connexion" replace state={{ depuis: location.pathname }}
/>;
}
  if (role && utilisateur.role !== role) {
    return (
      <>
        <title>Accès réservé</title>
        <h1 className="mb-4 text-3xl font-bold">Accès réservé</h1>
        <p>Cette page est réservée aux administrateurs.</p>
      </>
    );
  }
return children;
}