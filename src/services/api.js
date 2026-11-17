// BOUCHON, posé par le lead dev. A le remplace par le vrai fichier (ticket PIX-11).
// Il respecte le contrat de TICKETS.md, mais il ne parle à aucun serveur : les jeux
// viennent de src/data/jeux.js, et n'importe quelle adresse permet de se connecter.
import { jeux } from '@/data/jeux.js';

export class ErreurApi extends Error {
  constructor(statut, code, message, details = {}) {
    super(message);
    this.name = 'ErreurApi';
    this.statut = statut;
    this.code = code;
    this.details = details;
  }
}

// Comme un vrai serveur : la réponse met un peu de temps à arriver.
const attendre = () => new Promise((resolve) => setTimeout(resolve, 400));

export async function chargerJeu(id) {
  await attendre();
  const jeu = jeux.find((j) => j.id === id);
  if (!jeu) {
    throw new ErreurApi(404, 'NOT_FOUND', `Jeu « ${id} » introuvable.`);
  }
  return jeu;
}

export async function seConnecter(email) {
  await attendre();
  const admin = email.startsWith('claire');
  return {
    token: 'faux-jeton',
    utilisateur: admin
      ? { id: 4, nom: 'Claire Fontaine', email, role: 'admin' }
      : { id: 1, nom: 'Léa Martin', email, role: 'client' },
  };
}

// Le reste du contrat n'existe pas encore.
async function pasEncore() {
  await attendre();
  throw new ErreurApi(501, 'BOUCHON', 'Pas encore branché : c’est le ticket PIX-11.');
}

export const chargerJeux = pasEncore;
export const chargerGenres = pasEncore;
export const chargerPlateformes = pasEncore;
export const chargerCommandes = pasEncore;
export const commander = pasEncore;
export const annulerCommande = pasEncore;
export const creerJeu = pasEncore;
export const modifierJeu = pasEncore;
export const supprimerJeu = pasEncore;
