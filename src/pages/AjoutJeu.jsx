import { Link, useNavigate } from 'react-router';
import { creerJeu } from '@/services/api.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import FormulaireJeu from '@/components/FormulaireJeu.jsx';
export default function AjoutJeu() {
const { jeton } = useAuth();
const navigate = useNavigate();
// Si l'API refuse, creerJeu lève une erreur : le formulaire l'attrape et l'affiche.
async function ajouter(jeu) {
    const jeuCree = await creerJeu(jeu, jeton);

    navigate('/admin', {state: { message: `« ${jeuCree.titre} » a été ajouté au catalogue.`, }, });
}
return (
<>
<title>Ajouter un jeu — Pixel Clés</title>
<p className="mb-4 text-sm text-muted-foreground">

<Link className="text-primary hover:underline" to="/admin">Back-
office</Link> › Ajouter un jeu

</p>
<h1 className="mb-6 text-3xl font-bold tracking-tight">Ajouter un jeu</h1>
<FormulaireJeu libelle="Ajouter ce jeu" onEnvoyer={ajouter} />
</>
);
}