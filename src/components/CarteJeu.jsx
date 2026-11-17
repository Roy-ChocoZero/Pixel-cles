import { Link } from 'react-router';
import { Card } from '@/components/ui/card';
import BoutonPanier from '@/components/BoutonPanier.jsx';
import Prix from '@/components/Prix.jsx';

// Une carte : elle ne décide de rien, elle affiche le jeu qu'on lui donne.
export default function CarteJeu({ jeu }) {
  return (
    <Card className={`h-full gap-2 p-3 ${jeu.disponible ? '' : 'opacity-60 grayscale'}`}>
      <img className="aspect-[2/3] w-full rounded-md object-cover" src={`/jaquettes/${jeu.id}.jpg`} alt="" />
      <p className="text-xs font-bold tracking-wider text-muted-foreground uppercase">{jeu.plateforme}</p>
      <h2 className="font-semibold">
        <Link className="hover:text-primary" to={`/jeux/${jeu.id}`}>{jeu.titre}</Link>
      </h2>
      <Prix jeu={jeu} />
      {!jeu.disponible && <p className="font-bold text-destructive">Rupture de stock</p>}
      <div className="mt-auto pt-2">
        <BoutonPanier jeu={jeu} />
      </div>
    </Card>
  );
}
