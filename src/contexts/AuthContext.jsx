import { createContext, useContext, useEffect, useState } from 'react';
// Qui est connecté : une valeur que toute l'application peut lire, sans la passer de main en main.
const AuthContext = createContext(null);
const CLE = 'session';
// La session (le jeton et l'utilisateur) survit au rechargement, pas à la fermeture de l'onglet.
function charger() {
try {
return JSON.parse(sessionStorage.getItem(CLE));
} catch {
return null;
}
}
export function AuthProvider({ children }) {
const [session, setSession] = useState(charger);
useEffect(() => {
if (session) {
sessionStorage.setItem(CLE, JSON.stringify(session));
} else {
sessionStorage.removeItem(CLE);
}
}, [session]);
const utilisateur = session?.utilisateur ?? null;

const valeur = {
utilisateur,
jeton: session?.token ?? null,
estAdmin: utilisateur?.role === 'admin',
connecter: setSession,
deconnecter: () => setSession(null),
};
return <AuthContext value={valeur}>{children}</AuthContext>;
}
export function useAuth() {
const contexte = useContext(AuthContext);
if (!contexte) {
throw new Error('useAuth doit être utilisé dans un <AuthProvider>.');
}
return contexte;
}