import CarteJeu from '@/components/CarteJeu.jsx';

export default function ListeJeux({ jeux }) {
  if (jeux.length === 0) {
    return <p className="rounded-lg border border-dashed p-4">Aucun jeu ne correspond à votre recherche.</p>;
  }

  return (
    <ul className="grid grid-cols-[repeat(auto-fill,minmax(13rem,1fr))] gap-5">
      {jeux.map((jeu) => (
        <li key={jeu.id}>
          <CarteJeu jeu={jeu} />
        </li>
      ))}
    </ul>
  );
}
