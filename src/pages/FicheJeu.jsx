import { Link, useNavigate, useParams } from 'react-router';
import { jeux } from '@/data/jeux.js';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import BoutonPanier from '@/components/BoutonPanier.jsx';
import Prix from '@/components/Prix.jsx';

export default function FicheJeu() {
  const { id } = useParams();
  const navigate = useNavigate();
  const jeu = jeux.find((j) => j.id === id);

  if (!jeu) {
    return (
      <>
        <title>Jeu introuvable — Pixel Clés</title>
        <h1 className="mb-4 text-3xl font-bold">Jeu introuvable</h1>
        <p>
          Aucun jeu ne porte l'identifiant « {id} ».{' '}
          <Link className="text-primary hover:underline" to="/catalogue">Retour au catalogue</Link>
        </p>
      </>
    );
  }

  return (
    <>
      <title>{`${jeu.titre} — Pixel Clés`}</title>
      <p className="mb-4 text-sm text-muted-foreground">
        <Link className="text-primary hover:underline" to="/catalogue">Catalogue</Link> › {jeu.titre}
      </p>

      <Card className="max-w-3xl gap-3 border-t-4 border-t-primary p-6">
        <p className="text-xs font-bold tracking-wider text-muted-foreground uppercase">{jeu.plateforme} · {jeu.genre}</p>
        <h1 className="text-3xl font-bold">{jeu.titre}</h1>
        <p className="text-muted-foreground">{jeu.editeur} · {jeu.annee}</p>
        <Prix jeu={jeu} />
        {!jeu.disponible && <p className="font-bold text-destructive">Rupture de stock</p>}
        <p className="text-lg">{jeu.description}</p>

        <div className="mt-4 flex flex-wrap gap-3">
          <BoutonPanier jeu={jeu} />
          <Button variant="outline" onClick={() => navigate(-1)}>Retour</Button>
        </div>
      </Card>
    </>
  );
}
