import { useState } from 'react';
import { Link } from 'react-router';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { usePanier } from '@/contexts/PanierContext.jsx';
import { useRequete } from '@/hooks/useRequete.js';
import { chargerCommandes } from '@/services/api.js';
import { euros } from '@/utils/prix.js';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Chargement, Erreur, Refus, Succes } from '@/components/Etat.jsx';

// « 2026-11-17 » → « 17 novembre 2026 »const dateFr = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long', timeZone: 'UTC' });

export default function Compte() {
  const { utilisateur,jeton } = useAuth();
  const { panier } = usePanier();
  const { chargement, erreur, donnees: commandes, recharger } = useRequete(
    (signal) => chargerCommandes(utilisateur.id, jeton, signal),
    [utilisateur.id, jeton],
  );
  const [message, setMessage] = useState('');
  const [erreurAction, setErreurAction] = useState('');
  const s = panier.length > 1 ? 'x' : '';

  return (
    <>
      <title>Mon compte — Pixel Clés</title>
      <h1 className="mb-6 text-3xl font-bold tracking-tight">Mon compte</h1>
      <p className="mb-2">Bonjour {utilisateur.nom}. Adresse de connexion : {utilisateur.email}.</p>
      <p className="mb-8 text-muted-foreground">
        {panier.length} jeu{s} dans <Link className="text-primary hover:underline" to="/panier">votre panier</Link>.
      </p>

      <h2 className="mb-4 text-2xl font-bold">Mes commandes</h2>
      {chargement && <Chargement texte="Chargement de vos commandes…" />}
      {erreur && <Erreur erreur={erreur} onReessayer={recharger} />}
      {message && <Succes>{message}</Succes>}
      {erreurAction && <Refus>{erreurAction}</Refus>}

      {commandes && commandes.length === 0 && (
        <p className="rounded-lg border border-dashed p-4">Aucune commande pour l'instant.</p>)}
      {commandes && commandes.length > 0 && (
        <ul className="grid gap-4">
          {commandes.map((commande) => (
            <li key={commande.id}>
              <Card className={`gap-3 p-5 ${commande.statut === 'annulee' ? 'opacity-60' : ''}`}>
                <p className="flex flex-wrap items-center gap-2">
                  <strong>Commande n° {commande.id}</strong>
                  <span className="text-muted-foreground">du {dateFr.format(new Date(commande.date))}</span>
                  <span>· {euros.format(commande.total)}</span>
                  {commande.statut === 'annulee' && <Badge variant="secondary">Annulée</Badge>}
                </p>
                <ul className="grid list-disc gap-1 pl-5">
                  {commande.lignes.map((ligne) => (
                    <li key={ligne.jeuId}>
                      <Link className="hover:text-primary" to={`/jeux/${ligne.jeuId}`}>{ligne.titre}</Link>
                      <span className="text-muted-foreground"> ({ligne.plateforme}) : </span>
                      {commande.statut === 'annulee' ? (
                        'clé désactivée'
                      ) : (
                        <code className="rounded bg-black/50 px-2 py-1 font-mono text-primary">{ligne.cle}</code>
                      )}
                    </li>
                  ))}
                </ul>
              </Card >
            </li >
          ))
          }
        </ul >
      )}
    </>
  );
}

