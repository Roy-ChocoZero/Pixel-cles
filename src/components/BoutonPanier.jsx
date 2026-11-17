import { usePanier } from '@/contexts/PanierContext.jsx';
import { Button } from '@/components/ui/button';

// Le même bouton sur les cartes et sur la fiche : il sait tout seul dans quel état il est.
export default function BoutonPanier({ jeu }) {
  const { contient, plein, ajouter } = usePanier();

  if (!jeu.disponible) {
    return <Button disabled>Rupture de stock</Button>;
  }
  if (contient(jeu.id)) {
    return <Button variant="secondary" disabled>Dans le panier</Button>;
  }
  if (plein) {
    return <Button disabled>Panier plein</Button>;
  }
  return <Button onClick={() => ajouter(jeu)}>Ajouter au panier</Button>;
}
