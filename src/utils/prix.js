// Le prix après remise, au centime : 59,99 € à -45 % → 32,99 €.
export function prixFinal(jeu) {
  return Math.round(jeu.prix * (100 - jeu.remise)) / 100;
}

// 32.99 → « 32,99 € » : le format français, une fois pour toute l'application.
export const euros = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' });
