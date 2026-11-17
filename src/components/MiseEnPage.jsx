import { Link, NavLink, Outlet } from 'react-router';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { usePanier } from '@/contexts/PanierContext.jsx';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// Les classes d'un lien du menu : orange et en gras sur la page où l'on est (aria-current="page").
const lien = 'hover:text-primary aria-[current=page]:font-bold aria-[current=page]:text-primary';

// Ce qui est commun à toutes les pages. <Outlet /> marque l'endroit où s'affiche la page demandée.
export default function MiseEnPage() {
  const { utilisateur, estAdmin, deconnecter } = useAuth();
  const { panier } = usePanier();

  return (
    <div className="flex min-h-screen flex-col">
      <a className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground" href="#contenu">
        Aller au contenu
      </a>

      <header className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-primary bg-black/40 px-6 py-4">
        <p className="text-2xl font-extrabold tracking-tight">
          <Link to="/">Pixel <span className="text-primary">Clés</span></Link>
        </p>
        <nav aria-label="Navigation principale">
          <ul className="flex flex-wrap items-center gap-6">
            <li><NavLink className={lien} to="/" end>Accueil</NavLink></li>
            <li><NavLink className={lien} to="/catalogue">Catalogue</NavLink></li>
            <li>
              <NavLink className={lien} to="/panier">
                Panier <Badge className="ml-1">{panier.length}</Badge>
              </NavLink>
            </li>
            <li><NavLink className={lien} to="/compte">Mon compte</NavLink></li>
            {estAdmin && <li><NavLink className={lien} to="/admin">Back-
              office</NavLink></li>}
            {utilisateur && (
              <li>
                <Button variant="outline" size="sm" onClick={deconnecter}>Se déconnecter</Button>
              </li>
            )}
          </ul>
        </nav>
      </header>

      <main id="contenu" className="mx-auto w-full max-w-6xl flex-1 px-6 py-8">
        <Outlet />
      </main>

      <footer className="border-t px-6 py-6 text-center text-sm text-muted-foreground">
        <p>&copy; 2026 Pixel Clés · des clés de jeux, livrées en un clic</p>
      </footer>
    </div>
  );
}
