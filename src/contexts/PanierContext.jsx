import { createContext, useContext, useEffect, useReducer } from 'react';
import { panierReducer, MAXIMUM } from '@/contexts/panierReducer.js';
import { prixFinal } from '@/utils/prix.js';

const PanierContext = createContext(null);
const CLE = 'panier';

// Au premier affichage, on relit le panier enregistré ; s'il est absent ou abîmé, panier vide.
function charger() {
  try {
    return JSON.parse(localStorage.getItem(CLE)) ?? [];
  } catch {
    return [];
  }
}

export function PanierProvider({ children }) {
  const [panier, dispatch] = useReducer(panierReducer, [], charger);

  // Après chaque changement du panier, on l'enregistre.
  useEffect(() => {
    localStorage.setItem(CLE, JSON.stringify(panier));
  }, [panier]);

  const valeur = {
    panier,
    plein: panier.length >= MAXIMUM,
    total: panier.reduce((somme, jeu) => somme + prixFinal(jeu), 0),
    contient: (id) => panier.some((j) => j.id === id),
    ajouter: (jeu) => dispatch({ type: 'ajouter', jeu }),
    retirer: (id) => dispatch({ type: 'retirer', id }),
    vider: () => dispatch({ type: 'vider' }),
  };

  return <PanierContext value={valeur}>{children}</PanierContext>;
}

export function usePanier() {
  const contexte = useContext(PanierContext);
  if (!contexte) {
    throw new Error('usePanier doit être utilisé dans un <PanierProvider>.');
  }
  return contexte;
}
