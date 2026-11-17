// L'API de Pixel Clés : la boutique de clés de jeux vidéo de la séance 4.
// FOURNIE : vous n'avez pas à la modifier, ni à la lire. Son contrat est dans TICKETS.md.
//
// Même contrat que l'API du Bloc 2 (module API REST) : préfixe /api/v1,
// réponses { data, meta }, erreurs { error: { code, message, details } }, jeton
// « Bearer » pour ce qui concerne un utilisateur. Aucune dépendance : Node 22+.
//
//   npm run api          → http://localhost:3000/api/v1/jeux
//
// Les données vivent en mémoire : un redémarrage remet tout à zéro, et
// efface les jetons (utile pour tester un jeton qui n'est plus valable).
// Les jaquettes (dossier jaquettes/) appartiennent à leurs éditeurs : usage pédagogique seulement.

import { createServer } from 'node:http';
import { randomUUID, createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';

const PORT = Number(process.env.PORT ?? 3000);
const LATENCE = Number(process.env.LATENCE ?? 400);          // ms : pour voir les chargements
const ORIGINES = (process.env.ORIGINES ?? 'http://localhost:5173').split(',');
const DUREE_JETON = 30 * 60 * 1000;                          // 30 minutes
const DELAI_ANNULATION = 14;                                 // jours
const GENRES = ['Action', 'Aventure', 'Course', 'Gestion', 'Horreur', 'Jeu de rôle', 'Plateforme', 'Réflexion', 'Tir'];
const PLATEFORMES = ['Nintendo Switch', 'PC', 'PlayStation 5', 'Xbox Series'];

const jeux = [
  ['elden-ring', 'Elden Ring', 'Bandai Namco', 2022, 'Jeu de rôle', 'PC', 59.99, 45, 40,
    'Un monde ouvert immense, des boss redoutables : devenez le seigneur de l’Entre-terre.'],
  ['cyberpunk-2077', 'Cyberpunk 2077', 'CD Projekt', 2020, 'Jeu de rôle', 'PC', 59.99, 60, 25,
    'Night City, 2077 : un mercenaire cherche l’implant qui le rendra immortel.'],
  ['the-witcher-3', 'The Witcher 3 : Wild Hunt', 'CD Projekt', 2015, 'Jeu de rôle', 'PC', 29.99, 75, 50,
    'Geralt de Riv, chasseur de monstres, part à la recherche de sa fille adoptive.'],
  ['hades', 'Hades', 'Supergiant Games', 2020, 'Action', 'Nintendo Switch', 24.99, 40, 30,
    'Le fils du dieu des Enfers tente de s’en échapper, encore et encore.'],
  ['hollow-knight', 'Hollow Knight', 'Team Cherry', 2017, 'Plateforme', 'Nintendo Switch', 14.99, 30, 0,
    'Un petit chevalier explore un royaume d’insectes en ruine.'],
  ['stardew-valley', 'Stardew Valley', 'ConcernedApe', 2016, 'Gestion', 'PC', 13.99, 20, 60,
    'Vous héritez de la ferme de votre grand-père : à vous de la faire revivre.'],
  ['celeste', 'Celeste', 'Maddy Makes Games', 2018, 'Plateforme', 'PC', 19.99, 50, 12,
    'Madeline gravit une montagne, et affronte ses propres angoisses.'],
  ['red-dead-redemption-2', 'Red Dead Redemption 2', 'Rockstar Games', 2018, 'Aventure', 'Xbox Series', 59.99, 67, 18,
    'Arthur Morgan, hors-la-loi, voit disparaître l’Ouest sauvage.'],
  ['baldurs-gate-3', 'Baldur’s Gate 3', 'Larian Studios', 2023, 'Jeu de rôle', 'PlayStation 5', 69.99, 15, 22,
    'Un jeu de rôle tiré de Donjons et Dragons, où chaque choix compte.'],
  ['portal-2', 'Portal 2', 'Valve', 2011, 'Réflexion', 'PC', 9.99, 80, 99,
    'Un pistolet à portails, une intelligence artificielle sarcastique, et des énigmes.'],
  ['terraria', 'Terraria', 'Re-Logic', 2011, 'Aventure', 'PC', 9.99, 50, 70,
    'Creusez, construisez, combattez : un monde en deux dimensions à explorer.'],
  ['god-of-war', 'God of War', 'Sony', 2018, 'Action', 'PlayStation 5', 49.99, 55, 15,
    'Kratos et son fils traversent les terres des dieux nordiques.'],
  ['spider-man', 'Marvel’s Spider-Man Remastered', 'Sony', 2022, 'Action', 'PlayStation 5', 59.99, 40, 9,
    'Peter Parker protège New York, de toit en toit.'],
  ['forza-horizon-5', 'Forza Horizon 5', 'Microsoft', 2021, 'Course', 'Xbox Series', 59.99, 50, 30,
    'Des centaines de voitures, et tout le Mexique comme terrain de jeu.'],
  ['it-takes-two', 'It Takes Two', 'Electronic Arts', 2021, 'Aventure', 'PlayStation 5', 39.99, 62, 14,
    'Un couple transformé en poupées doit coopérer pour redevenir humain.'],
  ['dead-cells', 'Dead Cells', 'Motion Twin', 2018, 'Action', 'Nintendo Switch', 24.99, 35, 20,
    'Mourir, recommencer, apprendre : un château qui change à chaque partie.'],
  ['disco-elysium', 'Disco Elysium', 'ZA/UM', 2019, 'Jeu de rôle', 'PC', 39.99, 70, 11,
    'Un policier amnésique enquête sur un meurtre, en dialoguant avec ses propres pensées.'],
  ['sekiro', 'Sekiro : Shadows Die Twice', 'Activision', 2019, 'Action', 'PC', 59.99, 50, 0,
    'Un shinobi manchot cherche à sauver son jeune seigneur, dans un Japon imaginaire.'],
  ['doom-eternal', 'Doom Eternal', 'Bethesda', 2020, 'Tir', 'Xbox Series', 39.99, 75, 26,
    'Le Doom Slayer repousse l’invasion des démons sur Terre, à toute vitesse.'],
  ['persona-5-royal', 'Persona 5 Royal', 'Atlus', 2022, 'Jeu de rôle', 'Nintendo Switch', 59.99, 30, 0,
    'Lycéens le jour, voleurs de cœurs la nuit, à Tokyo.'],
  ['resident-evil-4', 'Resident Evil 4', 'Capcom', 2023, 'Horreur', 'PlayStation 5', 39.99, 45, 16,
    'Leon Kennedy part sauver la fille du président, dans un village inquiétant.'],
  ['outer-wilds', 'Outer Wilds', 'Annapurna', 2019, 'Aventure', 'PC', 24.99, 40, 8,
    'Un système solaire, une boucle de vingt-deux minutes, et un mystère à percer.'],
  ['balatro', 'Balatro', 'Playstack', 2024, 'Réflexion', 'PC', 14.99, 10, 45,
    'Un jeu de cartes où l’on construit des mains de poker impossibles.'],
  ['death-stranding', 'Death Stranding Director’s Cut', '505 Games', 2022, 'Aventure', 'PC', 39.99, 65, 13,
    'Sam Porter Bridges livre des colis, et relie une Amérique en morceaux.'],
].map(([id, titre, editeur, annee, genre, plateforme, prix, remise, stock, description]) =>
  ({ id, titre, editeur, annee, genre, plateforme, prix, remise, stock, description, jaquette: true }));

// Mots de passe en clair : c'est une maquette. Une vraie API stocke une empreinte (bcrypt).
const utilisateurs = [
  { id: 1, nom: 'Léa Martin', email: 'lea.martin@exemple.fr', motDePasse: 'manette', role: 'client' },
  { id: 2, nom: 'Karim Benali', email: 'karim.benali@exemple.fr', motDePasse: 'manette', role: 'client' },
  { id: 3, nom: 'Inès Morel', email: 'ines.morel@exemple.fr', motDePasse: 'manette', role: 'client' },
  { id: 4, nom: 'Claire Fontaine', email: 'claire.fontaine@exemple.fr', motDePasse: 'manette', role: 'admin' },
];

// Une fausse clé d'activation, toujours la même pour une commande et un jeu donnés.
const cle = (commandeId, jeuId) => {
  const h = createHash('sha1').update(`${commandeId}-${jeuId}`).digest('hex').toUpperCase().replace(/[^A-Z0-9]/g, '');
  return `PXC-${h.slice(0, 4)}-${h.slice(4, 8)}-${h.slice(8, 12)}`;
};
const prixFinal = (jeu) => Math.round(jeu.prix * (100 - jeu.remise)) / 100;
const ligne = (commandeId, jeu) => ({ jeuId: jeu.id, titre: jeu.titre, plateforme: jeu.plateforme, prix: prixFinal(jeu), cle: cle(commandeId, jeu.id) });

// Inès a une commande récente (annulable) ; Karim, une commande trop ancienne pour être annulée.
let prochaineCommande = 3;
const commandes = [
  { id: 1, utilisateurId: 3, date: '2026-11-10', statut: 'payee',
    lignes: ['hades', 'stardew-valley'].map((id) => ligne(1, jeux.find((j) => j.id === id))) },
  { id: 2, utilisateurId: 2, date: '2026-10-20', statut: 'payee',
    lignes: ['portal-2'].map((id) => ligne(2, jeux.find((j) => j.id === id))) },
];
const jetons = new Map();   // jeton → { utilisateurId, expire }

// La liste de souhaits de chaque client : des identifiants de jeux. Léa en a déjà deux.
const souhaits = new Map([[1, ['elden-ring', 'hollow-knight']]]);

// Les avis des joueurs. Seul un joueur qui possède le jeu (une commande payée) peut le noter.
let prochainAvis = 3;
const avis = [
  { id: 1, jeuId: 'hades', utilisateurId: 3, note: 5, commentaire: 'Chaque partie est différente. Impossible de s’arrêter.', date: '2026-11-12' },
  { id: 2, jeuId: 'portal-2', utilisateurId: 2, note: 4, commentaire: 'Des énigmes malines, et beaucoup d’humour.', date: '2026-10-25' },
];
const possede = (utilisateurId, jeuId) => commandes.some((c) => c.utilisateurId === utilisateurId && c.statut === 'payee'
  && c.lignes.some((l) => l.jeuId === jeuId));
const avisDetaille = (a) => ({ id: a.id, jeuId: a.jeuId, auteur: utilisateurs.find((u) => u.id === a.utilisateurId).nom.split(' ')[0],
  note: a.note, commentaire: a.commentaire, date: a.date });

// ------------------------------------------------------------------ outils

const versJeu = (jeu) => ({
  ...jeu,
  jaquette: jeu.jaquette ? `/api/v1/jaquettes/${jeu.id}.jpg` : null,
  disponible: jeu.stock > 0,
});
// AUJOURDHUI=2026-11-17 : une date fixe (captures d'écran de la fiche, démonstrations)
const aujourdHui = () => process.env.AUJOURDHUI ?? new Date().toISOString().slice(0, 10);
const joursDepuis = (date) => Math.round((new Date(aujourdHui()) - new Date(date)) / 86400000);
const sansAccent = (texte) => texte.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const identifiant = (titre) => sansAccent(titre).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const arrondi = (n) => Math.round(n * 100) / 100;

function commandeDetaillee(c) {
  return { id: c.id, date: c.date, statut: c.statut, lignes: c.lignes,
    total: arrondi(c.lignes.reduce((s, l) => s + l.prix, 0)),
    annulable: c.statut === 'payee' && joursDepuis(c.date) <= DELAI_ANNULATION };
}

class ErreurApi extends Error {
  constructor(statut, code, message, details) {
    super(message);
    this.statut = statut;
    this.code = code;
    this.details = details;
  }
}

function lireCorps(req) {
  return new Promise((ok, echec) => {
    let texte = '';
    req.on('data', (morceau) => { texte += morceau; });
    req.on('end', () => {
      if (!texte) return ok({});
      try { ok(JSON.parse(texte)); } catch { echec(new ErreurApi(400, 'BAD_JSON', 'Le corps de la requête n’est pas du JSON valide.')); }
    });
  });
}

// Le jeton envoyé dans « Authorization: Bearer … » : à qui est-il, et est-il encore valable ?
function utilisateurDuJeton(req) {
  const entete = req.headers.authorization ?? '';
  const jeton = entete.startsWith('Bearer ') ? entete.slice(7) : null;
  if (!jeton) throw new ErreurApi(401, 'NO_TOKEN', 'Authentification requise.');
  const session = jetons.get(jeton);
  if (!session) throw new ErreurApi(401, 'INVALID_TOKEN', 'Jeton inconnu : reconnectez-vous.');
  if (session.expire < Date.now()) {
    jetons.delete(jeton);
    throw new ErreurApi(401, 'TOKEN_EXPIRED', 'Session expirée : reconnectez-vous.');
  }
  return utilisateurs.find((u) => u.id === session.utilisateurId);
}

function adminDuJeton(req) {
  const utilisateur = utilisateurDuJeton(req);
  if (utilisateur.role !== 'admin') throw new ErreurApi(403, 'FORBIDDEN', 'Réservé aux administrateurs de la boutique.');
  return utilisateur;
}

// Les règles d'un jeu envoyé par un administrateur : un message par champ en faute.
function valider(corps) {
  const details = {};
  const texte = (v) => String(v ?? '').trim();
  const titre = texte(corps.titre);
  const editeur = texte(corps.editeur);
  const description = texte(corps.description);
  const { annee, prix, remise, stock, genre, plateforme } = corps;
  const anneeMax = Number(aujourdHui().slice(0, 4)) + 1;
  if (!titre) details.titre = 'Le titre est obligatoire.';
  else if (titre.length > 80) details.titre = 'Le titre fait 80 caractères au plus.';
  if (!editeur) details.editeur = 'L’éditeur est obligatoire.';
  if (!Number.isInteger(annee) || annee < 1970 || annee > anneeMax) details.annee = `L’année est un nombre entier, entre 1970 et ${anneeMax}.`;
  if (!GENRES.includes(genre)) details.genre = 'Choisissez un genre dans la liste.';
  if (!PLATEFORMES.includes(plateforme)) details.plateforme = 'Choisissez une plateforme dans la liste.';
  if (typeof prix !== 'number' || !(prix >= 0.01 && prix <= 200)) details.prix = 'Le prix est un nombre, entre 0,01 et 200 €.';
  if (!Number.isInteger(remise) || remise < 0 || remise > 90) details.remise = 'La remise est un nombre entier, entre 0 et 90 %.';
  if (!Number.isInteger(stock) || stock < 0 || stock > 9999) details.stock = 'Le stock est un nombre entier, entre 0 et 9 999.';
  if (description.length > 600) details.description = 'La description fait 600 caractères au plus.';
  if (Object.keys(details).length) {
    throw new ErreurApi(422, 'VALIDATION', 'Le jeu n’a pas été enregistré : corrigez les champs signalés.', details);
  }
  return { titre, editeur, annee, genre, plateforme, prix: arrondi(prix), remise, stock, description };
}

const TRIS = {
  titre: (a, b) => a.titre.localeCompare(b.titre, 'fr'),
  prix: (a, b) => prixFinal(a) - prixFinal(b) || TRIS.titre(a, b),
  remise: (a, b) => b.remise - a.remise || TRIS.titre(a, b),
  recents: (a, b) => b.annee - a.annee || TRIS.titre(a, b),
};

// ------------------------------------------------------------------ les routes

const routes = [
  // ?q=texte &genre=Action &plateforme=PC &promo=true &disponible=true &tri=titre|prix|remise|recents &page=1 &parPage=8
  ['GET', /^\/api\/v1\/jeux$/, (req, url) => {
    const p = url.searchParams;
    const q = sansAccent((p.get('q') ?? '').trim());
    let resultat = jeux
      .map(versJeu)
      .filter((j) => !q || sansAccent(`${j.titre} ${j.editeur}`).includes(q))
      .filter((j) => !p.get('genre') || j.genre === p.get('genre'))
      .filter((j) => !p.get('plateforme') || j.plateforme === p.get('plateforme'))
      .filter((j) => p.get('promo') !== 'true' || j.remise > 0)
      .filter((j) => p.get('disponible') !== 'true' || j.disponible)
      .sort(TRIS[p.get('tri')] ?? TRIS.titre);
    const total = resultat.length;
    const parPage = Math.max(1, Math.min(50, Number(p.get('parPage')) || total || 1));
    const pages = Math.max(1, Math.ceil(total / parPage));
    const page = Math.min(pages, Math.max(1, Number(p.get('page')) || 1));
    resultat = resultat.slice((page - 1) * parPage, page * parPage);
    return [200, { data: resultat, meta: { total, page, pages, parPage } }];
  }],

  ['GET', /^\/api\/v1\/genres$/, () => [200, { data: GENRES, meta: { total: GENRES.length } }]],
  ['GET', /^\/api\/v1\/plateformes$/, () => [200, { data: PLATEFORMES, meta: { total: PLATEFORMES.length } }]],

  ['GET', /^\/api\/v1\/jeux\/([\w-]+)$/, (req, url, [id]) => {
    const jeu = jeux.find((j) => j.id === id);
    if (!jeu) throw new ErreurApi(404, 'NOT_FOUND', `Jeu « ${id} » introuvable.`);
    return [200, { data: versJeu(jeu) }];
  }],

  ['POST', /^\/api\/v1\/jeux$/, async (req) => {
    adminDuJeton(req);
    const champs = valider(await lireCorps(req));
    const id = identifiant(champs.titre);
    if (jeux.some((j) => j.id === id)) {
      throw new ErreurApi(409, 'ALREADY_EXISTS', `La boutique vend déjà « ${champs.titre} ».`, { titre: 'Ce titre existe déjà.' });
    }
    const jeu = { id, ...champs, jaquette: false };
    jeux.push(jeu);
    return [201, { data: versJeu(jeu) }];
  }],

  ['PUT', /^\/api\/v1\/jeux\/([\w-]+)$/, async (req, url, [id]) => {
    adminDuJeton(req);
    const jeu = jeux.find((j) => j.id === id);
    if (!jeu) throw new ErreurApi(404, 'NOT_FOUND', `Jeu « ${id} » introuvable.`);
    Object.assign(jeu, valider(await lireCorps(req)));   // l'identifiant ne change pas
    return [200, { data: versJeu(jeu) }];
  }],

  ['DELETE', /^\/api\/v1\/jeux\/([\w-]+)$/, (req, url, [id]) => {
    adminDuJeton(req);
    const i = jeux.findIndex((j) => j.id === id);
    if (i === -1) throw new ErreurApi(404, 'NOT_FOUND', `Jeu « ${id} » introuvable.`);
    if (commandes.some((c) => c.lignes.some((l) => l.jeuId === id))) {
      throw new ErreurApi(409, 'ALREADY_SOLD', `« ${jeux[i].titre} » a déjà été vendu : mettez son stock à 0 plutôt que de le supprimer.`);
    }
    jeux.splice(i, 1);
    return [204, null];
  }],

  ['POST', /^\/api\/v1\/auth\/login$/, async (req) => {
    const { email, motDePasse } = await lireCorps(req);
    if (!email || !motDePasse) throw new ErreurApi(422, 'VALIDATION', 'L’adresse et le mot de passe sont obligatoires.');
    const u = utilisateurs.find((x) => x.email === String(email).trim() && x.motDePasse === motDePasse);
    if (!u) throw new ErreurApi(401, 'BAD_CREDENTIALS', 'Adresse ou mot de passe incorrect.');
    const token = randomUUID();
    jetons.set(token, { utilisateurId: u.id, expire: Date.now() + DUREE_JETON });
    return [200, { data: { token, utilisateur: { id: u.id, nom: u.nom, email: u.email, role: u.role } } }];
  }],

  ['GET', /^\/api\/v1\/utilisateurs\/(\d+)\/commandes$/, (req, url, [id]) => {
    const utilisateur = utilisateurDuJeton(req);
    if (utilisateur.id !== Number(id)) throw new ErreurApi(403, 'FORBIDDEN', 'Ces commandes ne sont pas les vôtres.');
    const liste = commandes.filter((c) => c.utilisateurId === utilisateur.id).map(commandeDetaillee).reverse();
    return [200, { data: liste, meta: { total: liste.length } }];
  }],

  // Une commande : { "jeuIds": ["hades", "celeste"] }. Tout passe, ou rien.
  ['POST', /^\/api\/v1\/commandes$/, async (req) => {
    const utilisateur = utilisateurDuJeton(req);
    const { jeuIds } = await lireCorps(req);
    if (!Array.isArray(jeuIds) || jeuIds.length === 0) throw new ErreurApi(422, 'VALIDATION', 'Le panier est vide.');
    const choisis = [...new Set(jeuIds)].map((id) => {
      const jeu = jeux.find((j) => j.id === id);
      if (!jeu) throw new ErreurApi(404, 'NOT_FOUND', `Jeu « ${id} » introuvable.`);
      return jeu;
    });
    const possedes = new Set(commandes.filter((c) => c.utilisateurId === utilisateur.id && c.statut === 'payee')
      .flatMap((c) => c.lignes.map((l) => l.jeuId)));
    const deja = choisis.find((j) => possedes.has(j.id));
    if (deja) throw new ErreurApi(409, 'ALREADY_OWNED', `Vous possédez déjà « ${deja.titre} ». Retirez-le du panier.`);
    const rupture = choisis.find((j) => j.stock === 0);
    if (rupture) throw new ErreurApi(409, 'OUT_OF_STOCK', `« ${rupture.titre} » est en rupture de stock. Retirez-le du panier.`);
    const id = prochaineCommande++;
    choisis.forEach((j) => { j.stock -= 1; });
    const commande = { id, utilisateurId: utilisateur.id, date: aujourdHui(), statut: 'payee', lignes: choisis.map((j) => ligne(id, j)) };
    commandes.push(commande);
    return [201, { data: commandeDetaillee(commande) }];
  }],

  // ---------- la liste de souhaits (sprint 5)
  ['GET', /^\/api\/v1\/utilisateurs\/(\d+)\/souhaits$/, (req, url, [id]) => {
    const utilisateur = utilisateurDuJeton(req);
    if (utilisateur.id !== Number(id)) throw new ErreurApi(403, 'FORBIDDEN', 'Cette liste n’est pas la vôtre.');
    const liste = (souhaits.get(utilisateur.id) ?? []).map((jid) => jeux.find((j) => j.id === jid)).filter(Boolean).map(versJeu);
    return [200, { data: liste, meta: { total: liste.length } }];
  }],

  // Ajouter un jeu à sa liste : PUT, car l'ajouter deux fois ne change rien (idempotent).
  ['PUT', /^\/api\/v1\/utilisateurs\/(\d+)\/souhaits\/([\w-]+)$/, (req, url, [id, jeuId]) => {
    const utilisateur = utilisateurDuJeton(req);
    if (utilisateur.id !== Number(id)) throw new ErreurApi(403, 'FORBIDDEN', 'Cette liste n’est pas la vôtre.');
    if (!jeux.some((j) => j.id === jeuId)) throw new ErreurApi(404, 'NOT_FOUND', `Jeu « ${jeuId} » introuvable.`);
    const liste = souhaits.get(utilisateur.id) ?? [];
    if (liste.length >= 20 && !liste.includes(jeuId)) throw new ErreurApi(409, 'LIMIT_REACHED', '20 jeux au plus dans une liste de souhaits.');
    if (!liste.includes(jeuId)) souhaits.set(utilisateur.id, [...liste, jeuId]);
    return [200, { data: { jeuId, souhaite: true } }];
  }],

  ['DELETE', /^\/api\/v1\/utilisateurs\/(\d+)\/souhaits\/([\w-]+)$/, (req, url, [id, jeuId]) => {
    const utilisateur = utilisateurDuJeton(req);
    if (utilisateur.id !== Number(id)) throw new ErreurApi(403, 'FORBIDDEN', 'Cette liste n’est pas la vôtre.');
    souhaits.set(utilisateur.id, (souhaits.get(utilisateur.id) ?? []).filter((j) => j !== jeuId));
    return [204, null];
  }],

  // ---------- les avis (sprint 5)
  ['GET', /^\/api\/v1\/jeux\/([\w-]+)\/avis$/, (req, url, [jeuId]) => {
    if (!jeux.some((j) => j.id === jeuId)) throw new ErreurApi(404, 'NOT_FOUND', `Jeu « ${jeuId} » introuvable.`);
    const liste = avis.filter((a) => a.jeuId === jeuId).map(avisDetaille).reverse();
    const moyenne = liste.length ? Math.round((liste.reduce((s, a) => s + a.note, 0) / liste.length) * 10) / 10 : null;
    return [200, { data: liste, meta: { total: liste.length, moyenne } }];
  }],

  ['POST', /^\/api\/v1\/jeux\/([\w-]+)\/avis$/, async (req, url, [jeuId]) => {
    const utilisateur = utilisateurDuJeton(req);
    const jeu = jeux.find((j) => j.id === jeuId);
    if (!jeu) throw new ErreurApi(404, 'NOT_FOUND', `Jeu « ${jeuId} » introuvable.`);
    const { note, commentaire } = await lireCorps(req);
    const details = {};
    if (!Number.isInteger(note) || note < 1 || note > 5) details.note = 'Choisissez une note de 1 à 5.';
    const texte = String(commentaire ?? '').trim();
    if (texte.length < 10) details.commentaire = 'Le commentaire fait 10 caractères au moins.';
    else if (texte.length > 500) details.commentaire = 'Le commentaire fait 500 caractères au plus.';
    if (Object.keys(details).length) throw new ErreurApi(422, 'VALIDATION', 'L’avis n’a pas été publié : corrigez les champs signalés.', details);
    if (!possede(utilisateur.id, jeuId)) throw new ErreurApi(403, 'NOT_OWNER', `Seuls les joueurs qui possèdent « ${jeu.titre} » peuvent le noter.`);
    if (avis.some((a) => a.jeuId === jeuId && a.utilisateurId === utilisateur.id)) {
      throw new ErreurApi(409, 'ALREADY_REVIEWED', `Vous avez déjà donné votre avis sur « ${jeu.titre} ».`);
    }
    const nouveau = { id: prochainAvis++, jeuId, utilisateurId: utilisateur.id, note, commentaire: texte, date: aujourdHui() };
    avis.push(nouveau);
    return [201, { data: avisDetaille(nouveau) }];
  }],

  // Annuler : { "statut": "annulee" }. Dans les 14 jours, une seule fois. Les clés sont désactivées.
  ['PATCH', /^\/api\/v1\/commandes\/(\d+)$/, async (req, url, [id]) => {
    const utilisateur = utilisateurDuJeton(req);
    const corps = await lireCorps(req);
    const commande = commandes.find((c) => c.id === Number(id) && c.utilisateurId === utilisateur.id);
    if (!commande) throw new ErreurApi(404, 'NOT_FOUND', `Commande ${id} introuvable.`);
    if (corps.statut !== 'annulee') throw new ErreurApi(422, 'VALIDATION', 'Envoyez { "statut": "annulee" }.');
    if (commande.statut === 'annulee') throw new ErreurApi(409, 'ALREADY_CANCELLED', `La commande n° ${id} est déjà annulée.`);
    if (joursDepuis(commande.date) > DELAI_ANNULATION) {
      throw new ErreurApi(409, 'TOO_LATE', `La commande n° ${id} date de plus de ${DELAI_ANNULATION} jours : elle ne peut plus être annulée.`);
    }
    commande.statut = 'annulee';
    commande.lignes.forEach((l) => { const jeu = jeux.find((j) => j.id === l.jeuId); if (jeu) jeu.stock += 1; });
    return [200, { data: commandeDetaillee(commande) }];
  }],
];

// ------------------------------------------------------------------ le serveur

const serveur = createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const origine = req.headers.origin;
  if (origine && ORIGINES.includes(origine)) {
    res.setHeader('Access-Control-Allow-Origin', origine);
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Vary', 'Origin');
  }
  if (req.method === 'OPTIONS') {
    res.writeHead(204).end();
    return;
  }

  // Les jaquettes : un nom simple seulement (hades.jpg), jamais un chemin.
  const image = /^\/api\/v1\/jaquettes\/([a-z0-9-]+)\.jpg$/.exec(url.pathname);
  if (req.method === 'GET' && image) {
    try {
      const contenu = await readFile(new URL(`./jaquettes/${image[1]}.jpg`, import.meta.url));
      res.writeHead(200, { 'Content-Type': 'image/jpeg', 'Cache-Control': 'max-age=3600' }).end(contenu);
    } catch {
      res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' })
        .end(JSON.stringify({ error: { code: 'NOT_FOUND', message: `Jaquette « ${image[1]} » introuvable.` } }));
    }
    return;
  }

  let statut = 500;
  let corps = { error: { code: 'SERVER_ERROR', message: 'Erreur interne.' } };
  try {
    const route = routes.find(([m, motif]) => m === req.method && motif.test(url.pathname));
    if (!route) {
      const autre = routes.some(([, motif]) => motif.test(url.pathname));
      throw autre
        ? new ErreurApi(405, 'METHOD_NOT_ALLOWED', `${req.method} n’est pas accepté sur ${url.pathname}.`)
        : new ErreurApi(404, 'NOT_FOUND', `Aucune route ${req.method} ${url.pathname}.`);
    }
    await new Promise((r) => setTimeout(r, LATENCE));
    [statut, corps] = await route[2](req, url, url.pathname.match(route[1]).slice(1));
  } catch (e) {
    if (e instanceof ErreurApi) {
      statut = e.statut;
      corps = { error: { code: e.code, message: e.message, ...(e.details ? { details: e.details } : {}) } };
    } else {
      console.error(e);
    }
  }
  if (statut === 204) res.writeHead(204).end();
  else res.writeHead(statut, { 'Content-Type': 'application/json; charset=utf-8' }).end(JSON.stringify(corps));
  console.log(`${req.method.padEnd(6)} ${url.pathname}${url.search}  →  ${statut}`);
});

serveur.listen(PORT, () => {
  console.log(`API Pixel Clés : http://localhost:${PORT}/api/v1/jeux`);
});
