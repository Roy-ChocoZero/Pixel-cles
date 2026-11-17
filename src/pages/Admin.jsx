import { Link, useLocation } from 'react-router';
import { chargerJeux } from '@/services/api.js';
import { useRequete } from '@/hooks/useRequete.js';
import { euros, prixFinal } from '@/utils/prix.js';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import { Chargement, Erreur, Succes } from '@/components/Etat.jsx';
export default function Admin() {
const location = useLocation();
const { chargement, erreur, donnees, recharger } = useRequete((signal) =>
chargerJeux({}, signal), []);
// Le message laissé par la page d'où l'on vient (« ... a été ajouté au catalogue.»).
const message = location.state?.message;
return (
<>
<title>Back-office — Pixel Clés</title>
<h1 className="mb-6 text-3xl font-bold tracking-tight">Back-office</h1>
{message && <Succes>{message}</Succes>}
<p className="mb-6">
<Button asChild>


<Link to="/admin/nouveau">Ajouter un jeu</Link>
</Button>
</p>
{chargement && <Chargement texte="Chargement du catalogue..." />}
{erreur && <Erreur erreur={erreur} onReessayer={recharger} />}
{donnees && (
<Table>
<TableCaption>{donnees.total} jeux au catalogue</TableCaption>
<TableHeader>
<TableRow>
<TableHead scope="col">Jeu</TableHead>
<TableHead scope="col">Plateforme</TableHead>
<TableHead scope="col">Prix</TableHead>
<TableHead scope="col">Remise</TableHead>
<TableHead scope="col">Stock</TableHead>
</TableRow>
</TableHeader>
<TableBody>

    {donnees.jeux.map((jeu) => (
    <TableRow key={jeu.id}>
        <TableCell>
        <Link to={`/jeux/${jeu.id}`} className="flex items-center gap-3 hover:underline">
            {jeu.jaquette && (
            <img
                src={jeu.jaquette}
                alt=""
                width={40}
                height={60}
                className="h-[60px] w-[40px] rounded object-cover"
            />
            )}
            {jeu.titre}
        </Link>
        </TableCell>

        <TableCell>{jeu.plateforme}</TableCell>
        <TableCell>{euros.format(prixFinal(jeu))}</TableCell>
        <TableCell>{jeu.remise} %</TableCell>
        <TableCell>
        {jeu.stock === 0 ? (
            <Badge variant="destructive">Rupture</Badge>
        ) : (
            jeu.stock
        )}
        </TableCell>
    </TableRow>
    ))}

</TableBody>
</Table>
)}
</>
);
}