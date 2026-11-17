import { useState } from 'react';
import { chargerGenres, chargerPlateformes } from '@/services/api.js';
import { useRequete } from '@/hooks/useRequete.js';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select';
import { Textarea } from '@/components/ui/textarea';
import { Refus } from '@/components/Etat.jsx';
const VIDE = {
titre: '', editeur: '', annee: '', plateforme: '', genre: '',
prix: '', remise: '0', stock: '10', description: '',
};
// Le formulaire d'un jeu, pour l'ajout comme pour la modification.
// « onEnvoyer » reçoit le jeu saisi, et renvoie la promesse de la requête.

export default function FormulaireJeu({ initial = VIDE, libelle, onEnvoyer }) {
const [jeu, setJeu] = useState(initial);
const [envoi, setEnvoi] = useState(false);
const [erreur, setErreur] = useState(null);
const { donnees: genres } = useRequete((signal) => chargerGenres(signal), []);
const { donnees: plateformes } = useRequete((signal) =>
chargerPlateformes(signal), []);
// Un seul gestionnaire pour tous les champs : le nom du champ dit quoi changer.
function changer(e) {
    const { name, value } = e.target;

    setJeu((jeuPrecedent) => ({...jeuPrecedent, [name]: value,}));
}
// Les attributs communs d'un champ : son identifiant, son nom, sa valeur, son gestionnaire.
function champ(nom) {
return { id: nom, name: nom, value: jeu[nom], onChange: changer };
}
// Le message d'erreur d'un champ, sous le champ : rien pour l'instant (PIX-17, au sprint 3).
function message() {
return null;
}
async function envoyer(e) {
e.preventDefault();
setEnvoi(true);
setErreur(null);
try {
// Les champs donnent du texte ; l'API attend des nombres.
    await onEnvoyer({...jeu,
    annee: Number(jeu.annee),
    prix: Number(jeu.prix),
    remise: Number(jeu.remise),
    stock: Number(jeu.stock),
    });
} catch (err) {
setErreur(err);
setEnvoi(false);
}
}

// noValidate : c'est l'API qui décide si le jeu est valable, et qui dit pourquoi.
return (
<Card className="max-w-2xl p-6">
<form className="grid gap-5" onSubmit={envoyer} noValidate>
{erreur && <Refus>{erreur.message}</Refus>}
<div className="grid gap-2">
<Label htmlFor="titre">Titre</Label>
<Input type="text" {...champ('titre')} />
{message('titre')}
</div>
<div className="grid gap-5 sm:grid-cols-2">
<div className="grid gap-2">
<Label htmlFor="editeur">Éditeur</Label>
<Input type="text" {...champ('editeur')} />
{message('editeur')}
</div>
<div className="grid gap-2">
<Label htmlFor="annee">Année de sortie</Label>
<Input type="number" {...champ('annee')} />
{message('annee')}
</div>

<div className="grid gap-2">
<Label htmlFor="plateforme">Plateforme</Label>
<NativeSelect {...champ('plateforme')}>
<NativeSelectOption value="">Choisir une
plateforme</NativeSelectOption>
{(plateformes ?? []).map((p) => <NativeSelectOption key={p} value={p}>
{p}</NativeSelectOption>)}
</NativeSelect>
{message('plateforme')}
</div>
<div className="grid gap-2">
<Label htmlFor="genre">Genre</Label>
<NativeSelect {...champ('genre')}>
<NativeSelectOption value="">Choisir un genre</NativeSelectOption>
{(genres ?? []).map((g) => <NativeSelectOption key={g} value={g}>{g}

</NativeSelectOption>)}
</NativeSelect>
{message('genre')}
</div>
</div>
<div className="grid gap-5 sm:grid-cols-3">
<div className="grid gap-2">
<Label htmlFor="prix">Prix public, en euros</Label>
<Input type="number" step="0.01" {...champ('prix')} />
{message('prix')}
</div>
<div className="grid gap-2">
<Label htmlFor="remise">Remise, en %</Label>
<Input type="number" {...champ('remise')} />
{message('remise')}
</div>
<div className="grid gap-2">
<Label htmlFor="stock">Clés en stock</Label>
<Input type="number" {...champ('stock')} />
{message('stock')}
</div>
</div>

<div className="grid gap-2">
<Label htmlFor="description">Description</Label>
<Textarea {...champ('description')} rows="4" />
{message('description')}
</div>
<Button type="submit" className="justify-self-start" disabled={envoi}>
{envoi ? 'Enregistrement...' : libelle}
</Button>
</form>
</Card>
);
}