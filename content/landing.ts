import { siteConfig } from "@/config/site";

const { routes, links } = siteConfig;

export type LinkItem = { label: string; href: string };

export const navigation = {
  homeLabel: "Life By Design, retour à l’accueil",
  links: [
    { label: "Méthode", href: "/#methode" },
    { label: "Formules", href: "/#formules" },
  ] satisfies LinkItem[],
  cta: { label: "Trouve ta formule", href: routes.questionnaire },
  menuOpen: "Ouvrir le menu",
  menuClose: "Fermer le menu",
  menuTitle: "Menu",
  mainLabel: "Navigation principale",
  mobileLabel: "Navigation mobile",
};

export const hero = {
  image: {
    src: "/images/fondtest8.png",
    alt: "Crique tropicale au coucher du soleil, un monolithe de verre dans la mer et un papillon translucide posé sur une pierre gravée",
    position: "70% center",
  },
  titleLines: ["Build a", "Life by Design"],
  subtitle:
    "Un accompagnement en tête-à-tête pour bâtir ta stratégie, ton process et ta discipline. En présentiel à Paris ou à distance.",
  primaryCta: { label: "Trouve ta formule", href: routes.questionnaire },
  secondaryCta: { label: "Voir les formules", href: "#formules" },
  stats: [
    { value: "1:1", label: "Accompagnement individuel" },
    { value: "1 h 30", label: "Par séance" },
    { value: "3 à 6 mois", label: "Selon ton niveau" },
  ],
  card: {
    text: "4 minutes de questionnaire. Une recommandation adaptée à ton profil.",
    link: { label: "Commencer", href: routes.questionnaire },
  },
};

export const constat = {
  id: "constat",
  title: {
    intro: "La plupart des traders ne manquent pas d’informations.",
    conclusion: "Ils manquent de cadre.",
  },
  items: [
    {
      title: "Discipline et émotions",
      text: "Tu sais quoi faire. Tu ne le fais pas. Le problème n’est pas technique, il est mental.",
    },
    {
      title: "Pas de stratégie claire",
      text: "Tu changes de méthode à chaque perte. Sans système, impossible de mesurer ce qui marche.",
    },
    {
      title: "Gestion du risque",
      text: "Une seule mauvaise position peut effacer des semaines de travail. Le risque se gère avant d’entrer, pas après.",
    },
    {
      title: "Trop d’informations",
      text: "Vidéos, signaux, indicateurs. Plus tu consommes, moins tu avances.",
    },
  ],
};

export const methode = {
  id: "methode",
  image: {
    src: "/images/panthere1.png",
    alt: "Panthère",
  },
  title: "Un cadre. Un process. Une discipline.",
  text: "Je ne te donne pas de signaux à copier. Je t’apprends une compétence : construire ta stratégie, l’appliquer avec rigueur, et rester maître de tes émotions.",
  piliers: [
    {
      title: "Stratégie & Blueprint",
      image: "/images/panthere1.png",
      text: "Une stratégie écrite, testée, adaptée à ton profil et à ton temps disponible.",
    },
    {
      title: "Gestion du risque",
      image: "/images/panthere2.png",
      text: "Taille de position, stop, exposition : des règles fixes, décidées à froid.",
    },
    {
      title: "Process & mental check",
      image: "/images/panthere3.png",
      text: "Une routine avant, pendant et après chaque session pour trader avec la tête froide.",
    },
    {
      title: "Plan et journal de trading",
      image: "/images/panthere4.png",
      text: "Tout est écrit, tout est mesuré. C’est ce qui transforme l’expérience en progression.",
    },
  ],
};

export const apropos = {
  id: "apropos",
  image: {
    src: "/images/jerry.webp",
    alt: "Portrait de Jerry",
  },
  title: "[Titre à compléter]",
  paragraphs: [
    "[Présentation du coach à compléter : parcours, expérience, pourquoi Life By Design.]",
  ],
};

export const formulesSection = {
  id: "formules",
  label: "Les formules",
  title: "Deux niveaux. Deux formats.",
  subtitle: "Le niveau dépend de ton expérience. Le format dépend de toi.",
  toggleLabel: "Choisis ton format",
  highlight: "Le plus complet",
  totalLabel: "Prix total de l’accompagnement",
  depositLabel: "à l’engagement (30 %)",
  cardCta: "Trouver ma formule",
  labels: {
    pourQui: "Pour qui",
    duree: "Durée",
    rythme: "Rythme",
    seances: "Séances",
    inclus: "Inclus",
  },
  notes: [
    "Tarifs de lancement. Le prix d’une formule est fixe. 30 % à l’engagement, et on démarre.",
    "Hors Île-de-France : formule à distance, avec une séance présentielle en option.",
  ],
  cta: { label: "Je ne sais pas laquelle choisir", href: routes.questionnaire },
};

export const processSection = {
  id: "process",
  label: "Comment ça se passe",
  title: "Quatre étapes, aucune surprise.",
  stepLabel: "Étape",
  ctaLabel: "Commencer le questionnaire",
  steps: [
    {
      title: "Le questionnaire",
      text: "4 minutes pour cerner ton niveau, ta situation et ton engagement.",
    },
    {
      title: "Ta recommandation",
      text: "La formule adaptée à ton profil s’affiche immédiatement.",
    },
    {
      title: "L’échange découverte",
      text: "On valide ensemble que c’est le bon moment et la bonne formule.",
    },
    {
      title: "On démarre",
      text: "30 % à l’engagement, et ta première séance est planifiée.",
    },
  ],
};

export const ctaFinal = {
  image: {
    src: "/images/cta.jpg",
    alt: "Vallée silencieuse au coucher du soleil, sous un ciel orangé",
  },
  title: "4 minutes pour savoir par où commencer.",
  text: "Réponds honnêtement. Je te recommande le bon niveau, sans te faire payer ce que tu maîtrises déjà.",
  primaryCta: { label: "Trouve ta formule", href: routes.questionnaire },
  secondaryLink: { label: "Me contacter sur Telegram", href: links.telegram },
};

export const footer = {
  social: [
    { label: "Telegram", href: links.telegram },
    { label: "Instagram", href: links.instagram },
  ] satisfies LinkItem[],
  legal: [
    { label: "Mentions légales", href: routes.mentionsLegales },
    { label: "Politique de confidentialité", href: routes.confidentialite },
  ] satisfies LinkItem[],
  socialLabel: "Réseaux sociaux",
  legalLabel: "Informations légales",
  disclaimer:
    "Le trading comporte un risque élevé de perte en capital. Life By Design propose de la formation, pas de conseil en investissement. Les performances passées ne préjugent pas des performances futures. N’investis que l’argent que tu peux te permettre de perdre.",
  copyright: (year: number) => `© ${year} ${siteConfig.name}`,
};

export const common = {
  newTab: "(nouvel onglet)",
};
