// Le panier : au plus 5 jeux, chacun une seule fois (une clé par jeu).
export const MAXIMUM = 5;

// Un reducer : (état actuel, action) → nouvel état. Il ne modifie rien, il ne fait rien d'autre.
export function panierReducer(panier, action) {
  switch (action.type) {
    case 'ajouter': {
      const dejaLa = panier.some((j) => j.id === action.jeu.id);
      if (dejaLa || panier.length >= MAXIMUM) {
        return panier;
      }
      const { id, titre, plateforme, prix, remise } = action.jeu;
      return [...panier, { id, titre, plateforme, prix, remise }];
    }
    case 'retirer':
      return panier.filter((j) => j.id !== action.id);
    case 'vider':
      return [];
    default:
      throw new Error(`Action inconnue : ${action.type}`);
  }
}
