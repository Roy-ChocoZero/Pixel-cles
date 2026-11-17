# Compte rendu de projet · Pixel Clés

*À remplir par l'équipe, à trois : les sprints 1 à 3 avant le point d'étape (vendredi 20 novembre), tout le projet avant le rendu final (vendredi 18 décembre). Destinataire : le lead dev. Il lit ce document avant d'ouvrir votre code : il doit savoir en cinq minutes ce qui est livré, ce qui ne l'est pas, et pourquoi. Écrivez des phrases courtes, à vous. Pas de copier-coller des fiches.*

- **Équipe** : A · … ; B · … ; C · …
- **Dépôt** : https://github.com/…
- **Date du compte rendu** : …

## 1 · En bref

*Trois à cinq lignes. Qu'est-ce qui marche ? Qu'est-ce qui manque ? Le lead dev peut-il montrer l'application au client demain ?*

…

## 2 · Le suivi des tickets

*Une ligne par ticket. Statut : livré (fusionné dans `main`), en cours (une branche existe), pas commencé. Temps : votre estimation honnête du temps réellement passé, à comparer à celle du lead dev (dans `TICKETS.md`).*

| Ticket | Responsable | Relu par | Statut | Pull request (lien) | Estimé | Réel |
|---|---|---|---|---|:--:|:--:|
| PIX-10 · L'équipe dans le README | A, B, C | | | | 15 min | |
| PIX-11 · Le relais et la couche de service | A | B | | | 25 min | |
| PIX-12 · Les requêtes, la fiche d'un jeu | B | C | | | 25 min | |
| PIX-13 · La vraie connexion | C | A | | | 20 min | |
| PIX-14 · Le catalogue et l'accueil | A | C | | | 25 min | |
| PIX-15 · Commander, mes commandes | B | A | | | 35 min | |
| PIX-16 · Le back-office : voir et ajouter | C | B | | | 50 min | |
| PIX-17 · Modifier, supprimer, les erreurs par champ | C | B | | | 35 min | |
| PIX-18 · Annuler une commande, le jeton périmé | B | A | | | 30 min | |
| PIX-19 · La recherche et les pages côté serveur | A | C | | | 30 min | |
| PIX-21 · Un catalogue plus rapide | A | B | | | 60 min | |
| PIX-22 · Charger moins | B | C | | | 45 min | |
| PIX-23 · En production, avec Docker et Nginx | C | A | | | 75 min | |
| PIX-30 · *(vos tickets du sprint 5)* | | | | | | |
| | | | | | | |
| | | | | | | |

## 3 · Ce que chacun a fait

*Chacun écrit son paragraphe, à la première personne : ce que j'ai codé, ce que j'ai appris, ce que je sais maintenant expliquer.*

**A** · …

**B** · …

**C** · …

## 4 · Les relectures

*Pour chaque sprint, une question posée en relecture (copiez-la depuis GitHub), la réponse de l'auteur, et ce qu'elle a changé dans le code (ou pourquoi rien).*

| Sprint | Relecteur → auteur | La question | La réponse | Ce qui a changé |
|---|---|---|---|---|
| 1 | | | | |
| 2 | | | | |
| 3 | | | | |
| 4 | | | | |
| 5 | | | | |

## 5 · Les conflits

*Chaque conflit rencontré : quel fichier, entre quelles branches, qui l'a résolu, comment (GitHub ou VS Code), et ce que vous avez gardé.*

…

## 5 bis · Les mesures (sprint 4)

*Les chiffres avant et après chaque optimisation (Profiler, onglet Réseau, `npm run build`), et l'audit de sécurité de B : que peut lire un visiteur dans `dist/` ?*

…

## 6 · Les difficultés

*Ce qui vous a bloqués, combien de temps, et comment vous vous êtes débloqués (la fiche, un collègue, le formateur, la console, l'onglet Réseau…).*

…

## 7 · Ce qui reste à faire

*Le reste du travail, comme des tickets : ce qui n'est pas fini, les bugs connus (comment les reproduire), ce que vous amélioreriez avec une journée de plus.*

| À faire | Pourquoi | Estimation |
|---|---|---|
| | | |

## 8 · La recette

*La liste « Contrôle final » du guide, vérifiée à trois sur `main` à jour. Cochez ce qui marche ; pour ce qui ne marche pas, une phrase.*

- [ ] Plus de `src/data/` ni de `public/jaquettes/` : tout vient de l'API
- [ ] Aucun `fetch` en dehors de `src/services/api.js`
- [ ] Aucun fichier CSS ajouté : tout passe par Tailwind et `src/components/ui/`
- [ ] Chaque page qui charge affiche le chargement, l'erreur et les données
- [ ] API arrêtée : des messages clairs, aucune page blanche
- [ ] Le catalogue : 8 jeux par page, filtres et page dans l'adresse
- [ ] Un client commande, voit ses clés, annule une commande ; les refus (409) sont expliqués
- [ ] L'admin ajoute, modifie, supprime un jeu ; un formulaire refusé dit quel champ est en faute
- [ ] Un jeton qui n'est plus bon ramène à la connexion
- [ ] Le back-office : une mise en page, des routes imbriquées
- [ ] Les mesures de performance, avant et après, dans le README
- [ ] `docker compose up --build` : la boutique sur http://localhost:8090
- [ ] La liste de souhaits et les avis (sprint 5)
- [ ] Aucune erreur JavaScript dans la console

## 8 bis · La démonstration au client (14 décembre)

*Ce que le client a vu, ses questions, ce qu'il a demandé de changer.*

…

## 9 · La rétrospective

*Une phrase chacun, pour chaque question.*

| | A | B | C |
|---|---|---|---|
| Ce qui a bien marché dans l'équipe | | | |
| Ce que je changerais la prochaine fois | | | |
| Ce que j'ai appris sur Git | | | |
| Tailwind et shadcn/ui : plus simple que le CSS ? Pourquoi ? | | | |
