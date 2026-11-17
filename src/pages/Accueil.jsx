import { Link } from 'react-router';
import { jeux } from '@/data/jeux.js';
import ListeJeux from '@/components/ListeJeux.jsx';

// Les quatre plus grosses remises du moment.
const promos = jeux.toSorted((a, b) => b.remise - a.remise).slice(0, 4);

export default function Accueil() {
  return (
    <>
      <title>Accueil — Pixel Clés</title>
      <h1 className="mb-4 text-4xl font-extrabold tracking-tight">Vos jeux, moins chers, tout de suite</h1>
      <p className="mb-8 text-muted-foreground">
        {jeux.length} jeux en vente, sur PC et consoles.{' '}
        <Link className="text-primary underline-offset-4 hover:underline" to="/catalogue">Voir tout le catalogue</Link>
      </p>

      <h2 className="mb-4 text-2xl font-bold">Les meilleures promos</h2>
      <ListeJeux jeux={promos} />
    </>
  );
}
