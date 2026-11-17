import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
// Les messages de l'application, écrits une seule fois pour toutes les pages.
// Une requête en cours : un petit cercle qui tourne, et le texte.
export function Chargement({ texte = 'Chargement…' }) {
    return (
        <p className="flex items-center gap-3 text-muted-foreground" role="status">
            <span className="size-5 rounded-full border-2 border-muted border-t-primary motion-safe:animate-spin" aria-hidden="true" />
            {texte} </p>);
}
// Une requête qui a échoué : le message de l'API, et de quoi réessayer.
export function Erreur({ erreur, onReessayer }) {
    return (
        <Alert variant="destructive" className="mb-4">
            <AlertDescription>{erreur.message}</AlertDescription>
            {onReessayer && (
                <Button variant="outline" size="sm" className="col-start-2 mt-2 w-fit" onClick={onReessayer}>
                    Réessayer
                </Button>)}
        </Alert>);
}
// Une action réussie (une commande, un ajout) : un message vert.
export function Succes({ children }) {
    return (
        <Alert role="status" className="mb-4 border-success/40">
            <AlertDescription className="text-success">{children}</AlertDescription>
        </Alert>);
}
// Une action refusée par l'API (409, 422…) : un message rouge.
export function Refus({ children }) {
    return (<Alert variant="destructive" className="mb-4">
        <AlertDescription>{children}</AlertDescription>
    </Alert>);
}
