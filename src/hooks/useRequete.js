import { useEffect, useState } from 'react';
// Les trois états d'une requête : en cours, en erreur, ou arrivée.
// « charger » reçoit un signal d'annulation ; « dependances » dit quand recharger.
export function useRequete(charger, dependances) {
    const [etat, setEtat] = useState({
        chargement: true, erreur: null, donnees: null
    });
    const [essai, setEssai] = useState(0);
    useEffect(() => {
        const controleur = new AbortController();
        setEtat((precedent) => ({ ...precedent, chargement: true, erreur: null }));
        charger(controleur.signal)
            .then((donnees) => setEtat({ chargement: false, erreur: null, donnees }))
            .catch((erreur) => {
                // Une requête annulée n'est pas une erreur : plus personne n'attend sa réponse. 
                if (erreur.name !== 'AbortError') { setEtat({ chargement: false, erreur, donnees: null }); }
            });
        // Le nettoyage : si le composant disparaît, ou si les dépendances changent, on annule. 
        return () => controleur.abort();
    }, [...dependances, essai]);
    return { ...etat, recharger: () => setEssai((n) => n + 1) };
}