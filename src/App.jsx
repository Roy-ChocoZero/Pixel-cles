import { Routes, Route } from 'react-router';
import MiseEnPage from '@/components/MiseEnPage.jsx';
import RouteProtegee from '@/components/RouteProtegee.jsx';
import Accueil from '@/pages/Accueil.jsx';
import Catalogue from '@/pages/Catalogue.jsx';
import FicheJeu from '@/pages/FicheJeu.jsx';
import Panier from '@/pages/Panier.jsx';
import Connexion from '@/pages/Connexion.jsx';
import Compte from '@/pages/Compte.jsx';
import Admin from '@/pages/Admin.jsx';
import AjoutJeu from '@/pages/AjoutJeu.jsx';
import PageIntrouvable from '@/pages/PageIntrouvable.jsx';

// Les adresses de l'application : une route = une adresse = une page.
export default function App() {
  return (
    <Routes>
      <Route element={<MiseEnPage />}>
        <Route index element={<Accueil />} />
        <Route path="catalogue" element={<Catalogue />} />
        <Route path="jeux/:id" element={<FicheJeu />} />
        <Route path="panier" element={<Panier />} />
        <Route path="connexion" element={<Connexion />} />
        <Route
          path="compte"
          element={
            <RouteProtegee>
              <Compte />
            </RouteProtegee>
          }
        />
        <Route
          path="admin"
          element={
          <RouteProtegee role="admin">
          <Admin />
          </RouteProtegee>
          }
        />
        <Route
          path="admin/nouveau"
          element={
          <RouteProtegee role="admin">
          <AjoutJeu />
          </RouteProtegee>
          }
        />
        <Route path="*" element={<PageIntrouvable />} />
      </Route>
    </Routes>
  );
}
