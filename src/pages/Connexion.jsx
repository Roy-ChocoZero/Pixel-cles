import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { seConnecter } from '@/services/api.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
export default function Connexion() {
const { connecter } = useAuth();
const [email, setEmail] = useState('');
const [motDePasse, setMotDePasse] = useState('');
const [erreur, setErreur] = useState('');
const [envoi, setEnvoi] = useState(false);
const navigate = useNavigate();
const location = useLocation();
async function envoyer(e) {

e.preventDefault();
setEnvoi(true);
setErreur('');
try {
// L'API vérifie le mot de passe, et renvoie un jeton et l'utilisateur.
const session = await seConnecter(email.trim(), motDePasse);
connecter(session);
// Retour à la page qui avait demandé la connexion, sinon au compte.
navigate(location.state?.depuis ?? '/compte', { replace: true });
} catch (err) {
setErreur(err.message);
setEnvoi(false);
}
}

return (
<>
<title>Connexion — Pixel Clés</title>
<h1 className="mb-6 text-3xl font-bold tracking-tight">Connexion</h1>
<Card className="max-w-md p-6">
<form className="grid gap-5" onSubmit={envoyer}>
{erreur && (
<Alert variant="destructive">
<AlertDescription>{erreur}</AlertDescription>
</Alert>
)}

<div className="grid gap-2">
<Label htmlFor="email">Adresse e-mail</Label>
<Input
type="email"
id="email"
autoComplete="email"
required
value={email}
onChange={(e) => setEmail(e.target.value)}
/>
</div>

<div className="grid gap-2">

<Label htmlFor="mot-de-passe">Mot de passe</Label>
<Input
type="password"
id="mot-de-passe"
autoComplete="current-password"
required
value={motDePasse}
onChange={(e) => setMotDePasse(e.target.value)}
/>
<p className="text-sm text-muted-foreground">Pour les essais :

lea.martin@exemple.fr, mot de passe « manette ».</p>
</div>

<Button type="submit" className="justify-self-start" disabled={envoi}>
{envoi ? 'Connexion...' : 'Se connecter'}
</Button>
</form>
</Card>
</>
);
}