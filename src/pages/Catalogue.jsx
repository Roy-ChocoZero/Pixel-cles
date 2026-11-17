import { useState } from 'react';
import { useSearchParams } from 'react-router';
import { jeux } from '@/data/jeux.js';
import { prixFinal } from '@/utils/prix.js';
import Filtres from '@/components/Filtres.jsx';
import ListeJeux from '@/components/ListeJeux.jsx';

// Les genres et les plateformes proposés dans les filtres : chacun une fois, dans l'ordre alphabétique.
const genres = [...new Set(jeux.map((jeu) => jeu.genre))].sort();
const plateformes = [...new Set(jeux.map((jeu) => jeu.plateforme))].sort();

// Les quatre façons de trier : une fonction de comparaison pour chacune.
const TRIS = {
  titre: (a, b) => a.titre.localeCompare(b.titre, 'fr'),
  prix: (a, b) => prixFinal(a) - prixFinal(b),
  remise: (a, b) => b.remise - a.remise,
  recents: (a, b) => b.annee - a.annee,
};

export default function Catalogue() {
  // La recherche vit dans l'adresse (?q=…) : elle survit au retour arrière, et se partage.
  const [parametres, setParametres] = useSearchParams();
  const recherche = parametres.get('q') ?? '';
  const [genre, setGenre] = useState('');
  const [plateforme, setPlateforme] = useState('');
  const [disponiblesSeulement, setDisponiblesSeulement] = useState(false);
  const [tri, setTri] = useState('titre');

  function setRecherche(valeur) {
    setParametres(valeur ? { q: valeur } : {}, { replace: true });
  }

  function reinitialiser() {
    setRecherche('');
    setGenre('');
    setPlateforme('');
    setDisponiblesSeulement(false);
    setTri('titre');
  }

  // Ce qui s'affiche se CALCULE à partir de l'état, à chaque rendu : on ne le range pas dans un état.
  const texte = recherche.trim().toLowerCase();
  const selection = jeux
    .filter((jeu) => `${jeu.titre} ${jeu.editeur}`.toLowerCase().includes(texte))
    .filter((jeu) => genre === '' || jeu.genre === genre)
    .filter((jeu) => plateforme === '' || jeu.plateforme === plateforme)
    .filter((jeu) => !disponiblesSeulement || jeu.disponible)
    .toSorted(TRIS[tri]);

  const s = selection.length > 1 ? 's' : '';

  return (
    <>
      <title>Catalogue — Pixel Clés</title>
      <h1 className="mb-6 text-3xl font-bold tracking-tight">Le catalogue</h1>

      <Filtres
        recherche={recherche}
        onRecherche={setRecherche}
        genres={genres}
        genre={genre}
        onGenre={setGenre}
        plateformes={plateformes}
        plateforme={plateforme}
        onPlateforme={setPlateforme}
        disponiblesSeulement={disponiblesSeulement}
        onDisponiblesSeulement={setDisponiblesSeulement}
        tri={tri}
        onTri={setTri}
        onReinitialiser={reinitialiser}
      />

      <p className="mb-4 text-muted-foreground" aria-live="polite">
        {selection.length} jeu{selection.length > 1 ? 'x' : ''} affiché{s} sur {jeux.length}
      </p>

      <ListeJeux jeux={selection} />
    </>
  );
}
