import { Link } from 'react-router';
import { usePanier } from '@/contexts/PanierContext.jsx';
import { MAXIMUM } from '@/contexts/panierReducer.js';
import { euros, prixFinal } from '@/utils/prix.js';
import { Button } from '@/components/ui/button';

export default function Panier() {
  const { panier, total, retirer, vider } = usePanier();
  const s = panier.length > 1 ? 'x' : '';

  function confirmerVider() {
    if (window.confirm('Retirer tous les jeux de votre panier ?')) {
      vider();
    }
  }

  return (
    <>
      <title>Panier — Pixel Clés</title>
      <h1 className="mb-6 text-3xl font-bold tracking-tight">Mon panier</h1>

      {panier.length === 0 ? (
        <p className="rounded-lg border border-dashed p-4">
          Votre panier est vide.{' '}
          <Link className="text-primary hover:underline" to="/catalogue">Choisir des jeux dans le catalogue</Link>
        </p>
      ) : (
        <>
          <p className="mb-4 text-muted-foreground">{panier.length} jeu{s} sur {MAXIMUM} possibles.</p>
          <ul className="mb-6 grid gap-3">
            {panier.map((jeu) => (
              <li key={jeu.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-card px-4 py-3">
                <p>
                  <Link className="font-semibold hover:text-primary" to={`/jeux/${jeu.id}`}>{jeu.titre}</Link>
                  <span className="text-muted-foreground">, {jeu.plateforme} · </span>
                  {euros.format(prixFinal(jeu))}
                </p>
                <Button variant="outline" size="sm" aria-label={`Retirer ${jeu.titre}`} onClick={() => retirer(jeu.id)}>
                  Retirer
                </Button>
              </li>
            ))}
          </ul>
          <p className="mb-4 text-2xl font-extrabold">Total : {euros.format(total)}</p>
          <p className="flex flex-wrap items-center gap-3">
            <Button variant="outline" onClick={confirmerVider}>Vider le panier</Button>
          </p>
        </>
      )}
    </>
  );
}
