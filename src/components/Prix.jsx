import { Badge } from '@/components/ui/badge';
import { euros, prixFinal } from '@/utils/prix.js';

// Le prix d'un jeu : la remise, l'ancien prix barré, le nouveau en gras.
export default function Prix({ jeu }) {
  if (jeu.remise === 0) {
    return <p className="text-xl font-bold">{euros.format(jeu.prix)}</p>;
  }

  return (
    <p className="flex flex-wrap items-baseline gap-2">
      <Badge>-{jeu.remise} %</Badge>
      <del className="text-sm text-muted-foreground">{euros.format(jeu.prix)}</del>
      <strong className="text-xl">{euros.format(prixFinal(jeu))}</strong>
    </p>
  );
}
