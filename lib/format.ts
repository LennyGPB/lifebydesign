// Intl fr-FR ne groupe pas les nombres à 4 chiffres (« 1500 € ») :
// on insère nous-mêmes une espace fine insécable entre les milliers.
export function formatPrix(montant: number): string {
  const groupes = Math.round(montant)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return `${groupes} €`;
}
