import { Link } from 'react-router';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { usePanier } from '@/contexts/PanierContext.jsx';

export default function Compte() {
  const { utilisateur } = useAuth();
  const { panier } = usePanier();
  const s = panier.length > 1 ? 'x' : '';

  return (
    <>
      <title>Mon compte — Pixel Clés</title>
      <h1 className="mb-6 text-3xl font-bold tracking-tight">Mon compte</h1>
      <p className="mb-2">Bonjour {utilisateur.nom}. Adresse de connexion : {utilisateur.email}.</p>
      <p className="mb-8 text-muted-foreground">
        {panier.length} jeu{s} dans <Link className="text-primary hover:underline" to="/panier">votre panier</Link>.
      </p>
    </>
  );
}
