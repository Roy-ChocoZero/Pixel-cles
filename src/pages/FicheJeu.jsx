import { Link, useNavigate, useParams } from 'react-router';
import { chargerJeu } from '@/services/api.js';
import { useRequete } from '@/hooks/useRequete.js';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import BoutonPanier from '@/components/BoutonPanier.jsx';
import Prix from '@/components/Prix.jsx';
import { Chargement, Erreur } from '@/components/Etat.jsx';

export default function FicheJeu() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { chargement, erreur, donnees: jeu, recharger } = useRequete((signal) =>
    chargerJeu(id, signal), [id]);
  if (chargement) {
    return <Chargement texte="Chargement de la fiche…" />;
  }
  if (erreur?.statut === 404) {
    return (
      <>
        <title>Jeu introuvable — Pixel Clés</title>
        <h1 className="mb-4 text-3xl font-bold">Jeu introuvable</h1>
        <p>
          Aucun jeu ne porte l'identifiant « {id} ».{' '}
          <Link className="text-primary hover:underline" to="/catalogue">Retour au catalogue</Link>
        </p> </>);
  }
  if (erreur) {
    return <Erreur erreur={erreur} onReessayer={recharger} />;
  }
  return (
    <>
      <title>{`${jeu.titre} — Pixel Clés`}</title>
      <p className="mb-4 text-sm text-muted-foreground">
        <Link className="text-primary hover:underline" to="/catalogue">Catalogue</Link> › {jeu.titre}
      </p>
      {/* Sur un écran large, la jaquette à gauche et la fiche à droite ; sur un téléphone, l'une sous l'autre. */}
      <div className="grid max-w-5xl items-start gap-6 md:grid-cols-[16rem_1fr]">
        {jeu.jaquette && <img className="aspect-[2/3] w-full rounded-xl object-cover" src={jeu.jaquette} alt="" />}
        <Card className="gap-3 border-t-4 border-t-primary p-6">
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
      </div>
    </>);
}