import { Link } from 'react-router';

export default function PageIntrouvable() {
  return (
    <>
      <title>Page introuvable — Pixel Clés</title>
      <h1 className="mb-4 text-3xl font-bold">Page introuvable</h1>
      <p>
        Cette adresse ne correspond à aucune page.{' '}
        <Link className="text-primary hover:underline" to="/">Retour à l'accueil</Link>
      </p>
    </>
  );
}
