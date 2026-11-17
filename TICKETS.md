# Les tickets

**La demande du client.** Pixel Clés vend des clés de jeux vidéo à prix réduit. Son site actuel (React, Tailwind, shadcn/ui) lit ses huit jeux dans un fichier : il a maintenant un **vrai serveur**, l'**API** du dossier `api/`, avec 24 jeux, des stocks, des comptes et des commandes. Il veut :

- que le catalogue vienne du serveur, avec ses vrais prix et ses vrais stocks, page par page ;
- que ses clients puissent **commander** leur panier, retrouver leurs **clés** dans leur compte, et **annuler** une commande récente ;
- que ses administrateurs gèrent le catalogue eux-mêmes, dans un **back-office** : ajouter, modifier, supprimer un jeu.

## Les rôles

Le lead dev a découpé le travail en **trois domaines**, un par développeur, sur **cinq sprints** : le 17 novembre (sprints 1 à 3), le 8 décembre (sprint 4 : rapide, et en ligne), le 14 décembre (sprint 5 : le client revient ; c'est vous qui écrirez ses tickets). Chacun est responsable du sien, du premier sprint au dernier : c'est lui qui le connaît le mieux, et qui l'explique aux autres.

| Rôle | Domaine | Au sprint 1 | Au sprint 2 | Au sprint 3 |
|---|---|---|---|---|
| **A** | le catalogue | la couche de service : tous les appels à l'API | le catalogue et l'accueil depuis l'API | la recherche, les filtres et les pages côté serveur |
| **B** | le compte client | le hook des requêtes, la fiche d'un jeu | commander le panier, mes commandes et mes clés | annuler une commande, le jeton périmé |
| **C** | le back-office | la vraie connexion, avec un jeton | le back-office : la liste des jeux, l'ajout | modifier, supprimer, les erreurs par champ, les routes imbriquées |

**A, le catalogue.** Vous écrivez le fichier par lequel passent **tous** les échanges avec le serveur : les autres s'en servent dès le sprint 2. Puis vous faites vivre la vitrine de la boutique : ce que voit un visiteur, ses filtres, ses pages. Vous pratiquez surtout `fetch`, les erreurs HTTP, les paramètres d'une adresse.

**B, le compte client.** Vous écrivez le hook qui gère l'attente et les erreurs de **toutes** les pages, puis tout ce qui suit l'achat : passer commande, afficher les clés, annuler. Vous pratiquez surtout `useEffect`, les envois avec un jeton (`POST`, `PATCH`), les refus du serveur (409, 401).

**C, le back-office.** Vous écrivez la connexion, dont tout le monde dépend, puis l'espace des administrateurs : une page réservée, un formulaire complet, l'ajout, la modification, la suppression. Vous pratiquez surtout les formulaires, `POST`, `PUT`, `DELETE`, et les erreurs de validation (422, 403).

## Les tickets

Dans chaque sprint, A, B et C travaillent **en même temps**, chacun sur sa branche. Chaque ticket est relu par un autre membre de l'équipe. L'**estimation** est celle du lead dev : comparez-la, dans votre compte rendu, au temps que vous y avez vraiment passé.

| Ticket | Sprint | Pour | Relu par | Branche | Estimé |
|---|:--:|:--:|:--:|---|:--:|
| PIX-10 · L'équipe dans le README | 0 | A, B, C | | `pix-10-equipe-a`, `-b`, `-c` | 15 min |
| PIX-11 · Le relais et la couche de service | 1 | A | B | `pix-11-service-api` | 25 min |
| PIX-12 · Les requêtes, et la fiche d'un jeu | 1 | B | C | `pix-12-requetes-fiche` | 25 min |
| PIX-13 · La vraie connexion | 1 | C | A | `pix-13-connexion` | 20 min |
| PIX-14 · Le catalogue et l'accueil depuis l'API | 2 | A | C | `pix-14-catalogue` | 25 min |
| PIX-15 · Commander, et mes commandes | 2 | B | A | `pix-15-commandes` | 35 min |
| PIX-16 · Le back-office : voir et ajouter | 2 | C | B | `pix-16-back-office` | 50 min |
| PIX-17 · Modifier, supprimer, les erreurs par champ | 3 | C | B | `pix-17-modifier` | 35 min |
| PIX-18 · Annuler une commande, et le jeton périmé | 3 | B | A | `pix-18-annuler` | 30 min |
| PIX-19 · La recherche et les pages côté serveur | 3 | A | C | `pix-19-pages` | 30 min |
| PIX-21 · Un catalogue plus rapide | 4 | A | B | `pix-21-performance` | 60 min |
| PIX-22 · Charger moins | 4 | B | C | `pix-22-chargement` | 45 min |
| PIX-23 · En production, avec Docker et Nginx | 4 | C | A | `pix-23-production` | 75 min |
| PIX-30 et suivants · le client revient | 5 | **à vous de les écrire** | | | |

---

## Le contrat de l'API

Lancée par `npm run api`. Préfixe : `/api/v1`. Réponses : `{ data, meta }`. Erreurs : `{ error: { code, message, details } }` ; le `message` est écrit pour être affiché ; `details` donne un message par champ refusé (422).

| Méthode et adresse | Qui | Réponse | Erreurs |
|---|---|---|---|
| `GET /jeux` · `?q=&genre=&plateforme=&disponible=true&tri=titre\|prix\|remise\|recents&page=&parPage=` | tout le monde | `200` · des jeux, et `meta: { total, page, pages, parPage }` | |
| `GET /jeux/:id` | tout le monde | `200` · un jeu | `404` |
| `GET /genres`, `GET /plateformes` | tout le monde | `200` · les listes | |
| `POST /auth/login` · `{ email, motDePasse }` | tout le monde | `200` · `{ token, utilisateur }` | `401`, `422` |
| `GET /utilisateurs/:id/commandes` | le client, avec son jeton | `200` · ses commandes, la plus récente d'abord | `401`, `403` |
| `POST /commandes` · `{ jeuIds: [...] }` | un client, avec son jeton | `201` · la commande, avec les clés | `401`, `404`, `409` déjà possédé ou rupture, `422` |
| `PATCH /commandes/:id` · `{ statut: "annulee" }` | le client | `200` · la commande annulée | `401`, `404`, `409` déjà annulée ou plus de 14 jours |
| `POST /jeux` · un jeu | un admin | `201` · le jeu | `401`, `403`, `409`, `422` |
| `PUT /jeux/:id` · un jeu | un admin | `200` · le jeu | `401`, `403`, `404`, `422` |
| `DELETE /jeux/:id` | un admin | `204` | `401`, `403`, `404`, `409` déjà vendu |

Un **jeu** : `{ id, titre, editeur, annee, genre, plateforme, prix, remise, stock, description, jaquette, disponible }` (`jaquette` : l'adresse de l'image, ou `null` ; `disponible` : `stock > 0`). Une **commande** : `{ id, date, statut, lignes: [{ jeuId, titre, plateforme, prix, cle }], total, annulable }`.

## Le contrat du front

Ce que les fichiers partagés promettent aux autres. Les noms ne se discutent pas.

| Fichier | Ce qu'il fournit |
|---|---|
| `src/services/api.js` | `ErreurApi` (avec `statut`, `code`, `message`, `details`) ; `chargerJeux(criteres, signal)`, qui renvoie `{ jeux, total, page, pages }` ; `chargerJeu(id, signal)` ; `chargerGenres(signal)` ; `chargerPlateformes(signal)` ; `seConnecter(email, motDePasse)` ; `chargerCommandes(utilisateurId, jeton, signal)` ; `commander(jeuIds, jeton)` ; `annulerCommande(commandeId, jeton)` ; `creerJeu(jeu, jeton)` ; `modifierJeu(id, jeu, jeton)` ; `supprimerJeu(id, jeton)` |
| `src/hooks/useRequete.js` | `useRequete(charger, dependances)`, qui renvoie `{ chargement, erreur, donnees, recharger }` |
| `src/components/Etat.jsx` | `<Chargement texte="…" />`, `<Erreur erreur={…} onReessayer={…} />`, `<Succes>…</Succes>` et `<Refus>…</Refus>` |
| `src/contexts/AuthContext.jsx` | `useAuth()`, qui renvoie `{ utilisateur, jeton, estAdmin, connecter(session), deconnecter() }` |

---

## Jour 1 · La mise en route

### PIX-10 · L'équipe dans le README (A, B, C)

**Pourquoi.** Chacun doit savoir faire le trajet complet, du commit à la fusion, et savoir résoudre un conflit.

**À faire.** Chacun remplit **sa** ligne du tableau « L'équipe » de `README.md`, sur sa branche, puis ouvre une pull request.

**Fichiers touchés.** `README.md`, pour les trois : c'est voulu. Vos trois branches touchent le même tableau, et Git vous demandera de choisir. C'est l'exercice.

**C'est fini quand :**
- [ ] Les trois pull requests sont fusionnées
- [ ] Le tableau de `main` contient les trois noms

---

## Sprint 1 · Brancher l'API

### PIX-11 · Le relais et la couche de service (A)

**Pourquoi.** Aucun composant ne doit appeler `fetch` lui-même : une seule adresse, une seule façon d'envoyer le jeton, une seule façon de traiter les erreurs.

**À faire.** Le relais de Vite vers l'API. Remplacer le bouchon `src/services/api.js` par le vrai fichier, avec **toutes** les fonctions du contrat. Étapes 1 et 2 de la fiche.

**Fichiers touchés.** `vite.config.js`, `src/services/api.js`.

**C'est fini quand :**
- [ ] http://localhost:5173/api/v1/jeux affiche les 24 jeux
- [ ] Dans la console : `await (await import('/src/services/api.js')).chargerJeu('xyz')` lève une `ErreurApi` de statut 404

### PIX-12 · Les requêtes, et la fiche d'un jeu (B)

**Pourquoi.** Chaque page qui charge doit montrer le chargement, l'erreur et les données. On l'écrit une fois.

**À faire.** Le hook `useRequete`, les messages `Chargement`, `Erreur`, `Succes` et `Refus`, puis la fiche d'un jeu qui s'en sert, avec sa jaquette. Étapes 3 et 4 de la fiche.

**Fichiers touchés.** `src/hooks/useRequete.js` (nouveau), `src/components/Etat.jsx` (nouveau), `src/pages/FicheJeu.jsx`.

**C'est fini quand :**
- [ ] Avec le bouchon : la fiche de *Hades* s'affiche après « Chargement de la fiche… »
- [ ] `/jeux/xyz` affiche « Jeu introuvable »

### PIX-13 · La vraie connexion (C)

**Pourquoi.** Les mots de passe ne doivent pas être écrits dans le front. C'est le serveur qui les vérifie, et qui donne un jeton.

**À faire.** La session (le jeton et l'utilisateur) dans le contexte de connexion, gardée dans `sessionStorage`. La page de connexion appelle `seConnecter`. Étapes 5 et 6 de la fiche.

**Fichiers touchés.** `src/contexts/AuthContext.jsx`, `src/pages/Connexion.jsx`, et `src/data/clients.js`, supprimé.

**C'est fini quand :**
- [ ] Avec le bouchon : on se connecte, et on reste connecté après `F5`
- [ ] `useAuth()` renvoie les cinq valeurs du contrat

---

## Sprint 2 · Un domaine chacun

### PIX-14 · Le catalogue et l'accueil depuis l'API (A)

**Pourquoi.** Le catalogue doit montrer les 24 jeux du serveur, avec leurs vrais prix et leurs vrais stocks.

**À faire.** Le catalogue, les cartes (la jaquette vient de l'API) et l'accueil passent à l'API. Les données locales disparaissent. Étapes 7 et 8 de la fiche.

**Fichiers touchés.** `src/pages/Catalogue.jsx`, `src/components/CarteJeu.jsx`, `src/pages/Accueil.jsx`, et `src/data/`, `public/jaquettes/`, supprimés.

**C'est fini quand :**
- [ ] « 24 jeux affichés sur 24 », avec leurs jaquettes
- [ ] Plus de dossier `src/data/`

### PIX-15 · Commander, et mes commandes (B)

**Pourquoi.** Le panier doit devenir une vraie commande, enregistrée par la boutique, avec une clé par jeu.

**À faire.** « Commander » sur la page du panier, avec la confirmation ou le refus du serveur. « Mes commandes » sur le compte, avec la date, le total et les clés. Étapes 9 et 10 de la fiche.

**Fichiers touchés.** `src/pages/Panier.jsx`, `src/pages/Compte.jsx`.

**C'est fini quand :**
- [ ] Léa commande deux jeux ; la commande et ses deux clés apparaissent dans son compte
- [ ] Inès commande *Hades*, qu'elle possède déjà : le refus de l'API s'affiche

### PIX-16 · Le back-office : voir et ajouter (C)

**Pourquoi.** Les administrateurs veulent ajouter les nouveautés sans appeler l'agence.

**À faire.** Une page « Back-office », réservée aux administrateurs, avec le tableau de tous les jeux et leur stock. Un lien dans le menu, pour eux seuls. Un formulaire pour ajouter un jeu. Étapes 11, 12 et 13 de la fiche.

**Fichiers touchés.** `src/pages/Admin.jsx` (nouveau), `src/components/FormulaireJeu.jsx` (nouveau), `src/pages/AjoutJeu.jsx` (nouveau), `src/components/RouteProtegee.jsx`, `src/components/MiseEnPage.jsx`, `src/App.jsx`.

**C'est fini quand :**
- [ ] Claire voit « Back-office » dans le menu ; Léa ne le voit pas, et `/admin` lui répond « Accès réservé »
- [ ] Claire ajoute un jeu : il apparaît dans le tableau, et dans le catalogue

---

## Sprint 3 · Aller plus loin

### PIX-17 · Modifier, supprimer, les erreurs par champ (C)

**Pourquoi.** Un prix se corrige, un stock se recharge. Et un formulaire refusé doit dire quel champ est en faute.

**À faire.** Sous chaque champ refusé, le message de l'API. Une page pour modifier un jeu. Un bouton « Supprimer », avec confirmation. Une mise en page commune aux pages du back-office, avec des **routes imbriquées**. Étapes 14 et 15 de la fiche.

**Fichiers touchés.** `src/components/FormulaireJeu.jsx`, `src/pages/ModificationJeu.jsx` (nouveau), `src/components/MiseEnPageAdmin.jsx` (nouveau), `src/pages/Admin.jsx`, `src/App.jsx`.

**C'est fini quand :**
- [ ] Un formulaire vide affiche un message sous six champs
- [ ] Supprimer *Hades* (déjà vendu) est refusé, avec le message de l'API
- [ ] Les trois pages du back-office ont le même menu latéral ; `RouteProtegee role="admin"` n'apparaît qu'une fois dans `App.jsx`

### PIX-18 · Annuler une commande, et le jeton périmé (B)

**Pourquoi.** Un client a 14 jours pour changer d'avis. Et une session expirée ne doit pas laisser une page en panne.

**À faire.** Un bouton « Annuler la commande » sur chaque commande payée, et la règle des 14 jours dans le pied de page. Quand l'API répond 401, on se déconnecte et on revient à la connexion. Étapes 16 et 17 de la fiche.

**Fichiers touchés.** `src/pages/Compte.jsx`, `src/pages/Panier.jsx`, `src/components/MiseEnPage.jsx` (une ligne du pied de page).

**C'est fini quand :**
- [ ] Inès annule sa commande : elle passe « Annulée »
- [ ] API relancée pendant qu'on est connecté : retour à la connexion, sans page en panne

### PIX-19 · La recherche et les pages côté serveur (A)

**Pourquoi.** Le catalogue va grandir. On ne peut pas tout charger pour filtrer dans le navigateur.

**À faire.** Les filtres, le tri et la page sont envoyés à l'API, et écrits dans l'adresse. Huit jeux par page, avec « Précédente » et « Suivante ». Un lien vers les plus grosses remises dans le pied de page. Étape 18 de la fiche.

**Fichiers touchés.** `src/pages/Catalogue.jsx`, `src/components/Pagination.jsx` (nouveau), `src/components/MiseEnPage.jsx` (une ligne du pied de page).

**C'est fini quand :**
- [ ] « Page 1 sur 3 » ; « Suivante » mène à la page 2, et l'adresse finit par `?page=2`
- [ ] Taper « zelda » ou « hades » envoie la recherche à l'API (onglet *Réseau*)

**Attention, conflit prévu.** PIX-18 et PIX-19 ajoutent tous les deux une ligne au même endroit du pied de page. **A fusionne avant B.** B met ensuite sa branche à jour, et résout le conflit en gardant les deux lignes.

---

## Sprint 4 · Rapide, et en ligne (8 décembre)

### PIX-21 · Un catalogue plus rapide (A)

**Pourquoi.** Le client ouvre la boutique au public : chaque lettre tapée ne doit pas lancer une requête, et rien ne doit être téléchargé deux fois.

**À faire.** Mesurer, puis : `memo` sur les cartes, une recherche qui attend la fin de la frappe, un cache des genres et des plateformes, des images chargées à la demande. Mesurer à nouveau, et écrire les mesures dans le README. Étape 19 du guide.

**Fichiers touchés.** `src/components/CarteJeu.jsx`, `src/pages/Catalogue.jsx`, `src/services/api.js`, `README.md` (une partie à la fin).

**C'est fini quand :**
- [ ] « hades » tapé d'un trait ne lance qu'une requête
- [ ] le README a son tableau de mesures, avant et après

### PIX-22 · Charger moins (B)

**Pourquoi.** Un visiteur ne doit pas télécharger le code du back-office.

**À faire.** Les pages du compte et du back-office chargées à la demande, avec un message pendant le chargement. Mesurer le build avant et après ; un audit de sécurité de `dist/` dans le compte rendu. Étape 20 du guide.

**Fichiers touchés.** `src/App.jsx`, `src/components/MiseEnPage.jsx`.

**C'est fini quand :**
- [ ] `npm run build` produit un fichier par page chargée à la demande
- [ ] aucune page blanche pendant un chargement

### PIX-23 · En production, avec Docker et Nginx (C)

**Pourquoi.** Le client veut voir sa boutique comme chez son hébergeur.

**À faire.** Un `Dockerfile` en deux temps, une configuration Nginx (repli des SPA, relais de l'API, cache, en-têtes de sécurité), un `compose.yaml` (port 8090), un `.dockerignore`, et une partie « Mise en production » à la fin du README. Étape 21 du guide.

**Fichiers touchés.** `Dockerfile`, `nginx.conf`, `securite.conf` (ou équivalent), `compose.yaml`, `.dockerignore` (nouveaux), `README.md` (une partie à la fin).

**C'est fini quand :**
- [ ] `docker compose up --build` lance la boutique sur http://localhost:8090
- [ ] `/catalogue` rechargé marche ; les en-têtes de sécurité sont sur chaque réponse

**Attention, conflit prévu.** PIX-21 et PIX-23 ajoutent chacun une partie à la fin du README. **C fusionne avant A.** A met ensuite sa branche à jour, et résout le conflit en gardant les deux parties.

---

## Sprint 5 · Le client revient (14 décembre)

**La demande, le contrat de l'API et les critères d'acceptation sont dans le guide complet (partie 5).** Ici, c'est **vous** qui écrivez les tickets, à la suite : `PIX-30`, `PIX-31`…, sur le modèle de ceux du dessus (pourquoi, à faire, fichiers touchés, critères, estimation, responsable, relecteur). Ajoutez-les aussi au tableau en haut de ce fichier.

*(vos tickets ici)*

---

## Le rendu · le compte rendu pour le lead dev

L'équipe remplit **`COMPTE-RENDU.md`**, à la racine du projet, et le pousse sur `main` par une pull request relue par les deux autres : pour les sprints 1 à 3 avant le **point d'étape du vendredi 20 novembre** (`pix-20-compte-rendu`), puis en entier avant le **rendu final du vendredi 18 décembre** (`pix-40-compte-rendu`). C'est ce document que le lead dev lit en premier.
