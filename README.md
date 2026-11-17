# Pixel Clés

La boutique en ligne de **Pixel Clés**, en React, Tailwind CSS et shadcn/ui, qui vend des clés de jeux vidéo à prix réduit, pour PC et consoles : le catalogue, le panier, les commandes des clients, et le back-office des administrateurs. Les données viennent de l'**API de la boutique** (dossier `api/`).

## L'équipe

| Rôle | Nom | Identifiant GitHub |
|---|---|---|
| A · le catalogue | | |
| B · le compte client et les commandes | | |
| C · le back-office | Responsable du back-office | Camus Martin | Martin00007 |

Dépôt : *(l'adresse de votre dépôt GitHub)*

## Lancer le projet

Il faut Node.js 24 (ou 22.22 et plus). Dans VS Code, installez l'extension **Tailwind CSS IntelliSense**. Pour le design, deux guides de référence sont sur le Drive (dossier **Ressources**) : le **PDF Tailwind** et le **PDF shadcn/ui**. **Deux terminaux**, dans le dossier du projet :

```bash
npm install
npm run api
```

```bash
npm run dev
```

L'application s'ouvre sur http://localhost:5173, l'API répond sur http://localhost:3000/api/v1/jeux.

| Compte de test | Mot de passe | Rôle |
|---|---|---|
| `lea.martin@exemple.fr` | `manette` | cliente, aucune commande |
| `karim.benali@exemple.fr` | `manette` | client, une commande trop ancienne pour être annulée |
| `ines.morel@exemple.fr` | `manette` | cliente, une commande récente (*Hades*, *Stardew Valley*) |
| `claire.fontaine@exemple.fr` | `manette` | administratrice de la boutique |

L'API garde tout en mémoire : l'arrêter et la relancer remet le catalogue, les stocks et les commandes à zéro.

## Où est quoi

| Dossier | Contenu |
|---|---|
| `api/` | L'API, **fournie** : on la lance, on ne la modifie pas |
| `src/pages/` | Une page par adresse |
| `src/components/` | Les composants de la boutique |
| `src/components/ui/` | Les composants **shadcn/ui** (bouton, carte, champ, tableau…), écrits en Tailwind. Ils sont à nous : on peut les lire et les modifier |
| `src/index.css` | Le seul CSS du projet : Tailwind, et les couleurs de la boutique |
| `src/lib/utils.js` | `cn()`, qui assemble des classes Tailwind |
| `src/contexts/` | La connexion et le panier, partagés par toute l'application |
| `src/services/` | Les appels à l'API. **Un bouchon** vous y attend : c'est le ticket PIX-11 |
| `src/utils/` | Le calcul du prix remisé, le format des euros |
| `src/data/` | Les données écrites dans le front : elles disparaîtront |

## Comment on travaille ici

1. **`main` fonctionne toujours.** On ne pousse jamais directement dessus.
2. **Un ticket, une branche.** Son nom reprend le ticket : `pix-11-service-api`.
3. **Des messages de commit qui disent quoi** : `PIX-11 : la couche de service`.
4. **Une pull request par ticket**, relue par un autre membre de l'équipe avant d'être fusionnée. Personne ne fusionne une pull request que personne n'a approuvée.
5. **Après chaque fusion**, tout le monde se remet à jour : `git switch main`, puis `git pull`.
6. **Un conflit n'est pas une panne** : on le résout, sans effacer le travail de l'autre.
7. **À la fin**, l'équipe remplit `COMPTE-RENDU.md` pour le lead dev.

Les tickets sont dans [TICKETS.md](TICKETS.md).

*Ce README est tenu à jour par l'équipe.*
