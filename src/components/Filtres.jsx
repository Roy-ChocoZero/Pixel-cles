import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select';

// Les champs n'ont pas d'état à eux : la page le leur donne (value), et ils le lui rendent (onChange).
export default function Filtres({
  recherche, onRecherche,
  genres, genre, onGenre,
  plateformes, plateforme, onPlateforme,
  disponiblesSeulement, onDisponiblesSeulement,
  tri, onTri,
  onReinitialiser,
}) {
  return (
    <div className="mb-4 flex flex-wrap items-end gap-4 rounded-xl border bg-card p-4" role="search">
      <div className="grid min-w-44 flex-1 gap-2">
        <Label htmlFor="recherche">Titre ou éditeur</Label>
        <Input type="search" id="recherche" value={recherche} onChange={(e) => onRecherche(e.target.value)} />
      </div>

      <div className="grid min-w-44 flex-1 gap-2">
        <Label htmlFor="plateforme">Plateforme</Label>
        <NativeSelect id="plateforme" value={plateforme} onChange={(e) => onPlateforme(e.target.value)}>
          <NativeSelectOption value="">Toutes</NativeSelectOption>
          {plateformes.map((p) => <NativeSelectOption key={p} value={p}>{p}</NativeSelectOption>)}
        </NativeSelect>
      </div>

      <div className="grid min-w-44 flex-1 gap-2">
        <Label htmlFor="genre">Genre</Label>
        <NativeSelect id="genre" value={genre} onChange={(e) => onGenre(e.target.value)}>
          <NativeSelectOption value="">Tous les genres</NativeSelectOption>
          {genres.map((g) => <NativeSelectOption key={g} value={g}>{g}</NativeSelectOption>)}
        </NativeSelect>
      </div>

      <div className="grid min-w-44 flex-1 gap-2">
        <Label htmlFor="tri">Trier par</Label>
        <NativeSelect id="tri" value={tri} onChange={(e) => onTri(e.target.value)}>
          <NativeSelectOption value="titre">Titre</NativeSelectOption>
          <NativeSelectOption value="prix">Prix, du moins cher</NativeSelectOption>
          <NativeSelectOption value="remise">Plus grosse remise</NativeSelectOption>
          <NativeSelectOption value="recents">Les plus récents</NativeSelectOption>
        </NativeSelect>
      </div>

      <p className="flex items-center gap-2 pb-2">
        <input
          type="checkbox"
          id="disponibles"
          className="size-4 accent-primary"
          checked={disponiblesSeulement}
          onChange={(e) => onDisponiblesSeulement(e.target.checked)}
        />
        <Label htmlFor="disponibles">En stock seulement</Label>
      </p>

      <Button variant="outline" onClick={onReinitialiser}>Réinitialiser</Button>
    </div>
  );
}
