export type Niveau = "complet" | "avance";
export type Format = "presentiel" | "distance";

export type Formule = {
  id: string; // ex. "complet-presentiel"
  niveau: Niveau;
  format: Format;
  nom: string;
  prix: number;
  duree: string;
  rythme: string;
  pourQui: string;
  inclus: string[];
  bonus?: string;
};

export const niveaux: readonly Niveau[] = ["complet", "avance"];
export const formats: readonly Format[] = ["presentiel", "distance"];

export const niveauLabels: Record<Niveau, string> = {
  complet: "Complet",
  avance: "Avancé · Stratégie & Blueprint",
};

export const formatLabels: Record<Format, string> = {
  presentiel: "Présentiel",
  distance: "À distance",
};

export const dureeSeance = "1 h 30";

const inclusComplet = [
  "Stratégie et blueprint",
  "Gestion du risque",
  "Process et mental check",
  "Plan et journal de trading",
];

const inclusAvance = [
  "Stratégie et blueprint",
  "Gestion du risque",
  "Process et mental check",
];

const pourQuiComplet =
  "Tu débutes, tu as des bases fragiles, ou tu veux un suivi chaque semaine.";
const pourQuiAvance =
  "Tu as de l’expérience et tu veux une stratégie et un système solides.";

export const formules: readonly Formule[] = [
  {
    id: "complet-presentiel",
    niveau: "complet",
    format: "presentiel",
    nom: "Présentiel complet · Sur mesure",
    prix: 2300,
    duree: "6 mois",
    rythme: "Chaque semaine",
    pourQui: pourQuiComplet,
    inclus: inclusComplet,
    bonus: "Kit Plan Financier Intérieur inclus",
  },
  {
    id: "complet-distance",
    niveau: "complet",
    format: "distance",
    nom: "À distance complet",
    prix: 1800,
    duree: "6 mois",
    rythme: "Chaque semaine",
    pourQui: pourQuiComplet,
    inclus: inclusComplet,
  },
  {
    id: "avance-presentiel",
    niveau: "avance",
    format: "presentiel",
    nom: "Présentiel avancé · Stratégie & Blueprint",
    prix: 1500,
    duree: "3 à 4 mois selon ton niveau",
    rythme: "1 à 2 fois par mois",
    pourQui: pourQuiAvance,
    inclus: inclusAvance,
  },
  {
    id: "avance-distance",
    niveau: "avance",
    format: "distance",
    nom: "À distance avancé · Stratégie & Blueprint",
    prix: 1200,
    duree: "3 à 4 mois selon ton niveau",
    rythme: "1 à 2 fois par mois",
    pourQui: pourQuiAvance,
    inclus: inclusAvance,
  },
];

export function getFormule(niveau: Niveau, format: Format): Formule {
  const formule = formules.find(
    (f) => f.niveau === niveau && f.format === format,
  );
  if (!formule) {
    throw new Error(`Formule introuvable : ${niveau} / ${format}`);
  }
  return formule;
}

export function getFormuleById(id: string): Formule | undefined {
  return formules.find((f) => f.id === id);
}
