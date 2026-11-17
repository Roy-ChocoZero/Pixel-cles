// Tous les appels à l'API passent par ici : une seule adresse de base,
// une seule façon d'envoyer le jeton, une seule façon de traiter les erreurs.
const BASE = '/api/v1';
// Une erreur de l'API : le statut HTTP, le code, et un message par champ refusé (422).
export class ErreurApi extends Error {
  constructor(statut, code, message, details = {}) {
    super(message);
    this.name = 'ErreurApi';
    this.statut = statut;
    this.code = code;
    this.details = details;
  }
}

async function requete(chemin, { methode = 'GET', corps, jeton, signal } = {}) {
  const entetes = {}; if (corps) entetes['Content-Type'] = 'application/json';
  if (jeton) entetes.Authorization = `Bearer ${jeton}`;
  let reponse;
  try {
    reponse = await fetch(`${BASE}${chemin}`, {
      method: methode,

      headers: entetes, body: corps ? JSON.stringify(corps) : undefined, signal,
    });
  } catch (erreur) {
    if (erreur.name === 'AbortError') throw erreur;
    throw new ErreurApi(0, 'RESEAU', 'Le serveur ne répond pas. Réessayez dans un instant.');
  }
  // fetch ne lève PAS d'erreur sur un 404 ou un 500 : c'est à nous de regarder le statut. 
  if (!reponse.ok) {
    const json = await reponse.json().catch(() => null);
    if (!json?.error) {
      throw new ErreurApi(
        reponse.status, 'RESEAU', 'Le serveur ne répond pas. Réessayez dans un instant.'
      );
    }
    throw new ErreurApi(reponse.status, json.error.code, json.error.message, json.error.details);
  }
  // 204 : réussi, mais sans contenu. Sinon, la réponse entière : { data, meta }. 
  return reponse.status === 204 ? null : reponse.json();
}

// La plupart des appels ne veulent que ce qu'il y a dans « data ».
async function donnees(chemin, options) {
  const json = await requete(chemin, options);
  return json?.data ?? null;
}

// Les critères deviennent la fin de l'adresse : { genre: 'Action', page: 2 } → « ?genre=Action&page=2 ».
function enParametres(criteres) {
  const parametres = new URLSearchParams();
  for (const [cle, valeur] of Object.entries(criteres)) {
    if (valeur !== '' && valeur !== false && valeur !== undefined && valeur !== null) {
      parametres.set(cle, valeur);
    }
  }

  const texte = parametres.toString();
  return texte ? `?${texte}` : '';
}

// Le catalogue : les jeux, et ce que l'API dit de la page (total, page, pages).
export async function chargerJeux(criteres = {}, signal) {
  const { data, meta } = await requete(`/jeux${enParametres(criteres)}`, { signal });
  return { jeux: data, ...meta };
}

export const chargerJeu = (id, signal) => donnees(`/jeux/${encodeURIComponent(id)}`, { signal });
export const chargerGenres = (signal) => donnees('/genres', { signal });
export const chargerPlateformes = (signal) => donnees('/plateformes', { signal });
export const seConnecter = (email, motDePasse) => donnees('/auth/login', { methode: 'POST', corps: { email, motDePasse } });
export const chargerCommandes = (utilisateurId, jeton, signal) => donnees(`/utilisateurs/${utilisateurId}/commandes`, { jeton, signal });
export const commander = (jeuIds, jeton) => donnees('/commandes', { methode: 'POST', corps: { jeuIds }, jeton });
export const annulerCommande = (commandeId, jeton) => donnees(`/commandes/${commandeId}`, { methode: 'PATCH', corps: { statut: 'annulee' }, jeton });
export const creerJeu = (jeu, jeton) => donnees('/jeux', { methode: 'POST', corps: jeu, jeton });
export const modifierJeu = (id, jeu, jeton) => donnees(`/jeux/${encodeURIComponent(id)}`, { methode: 'PUT', corps: jeu, jeton });
export const supprimerJeu = (id, jeton) => donnees(`/jeux/${encodeURIComponent(id)}`, { methode: 'DELETE', jeton });