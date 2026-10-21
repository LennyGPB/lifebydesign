export type QuestionOption = { value: string; label: string };
export type Question = {
  id: string;
  number: number;
  label: string;
  type: "text" | "email" | "textarea" | "radio" | "checkbox" | "scale";
  required?: boolean;
  hint?: string;
  placeholder?: string;
  options?: QuestionOption[];
  maxLength?: number;
  autoComplete?: string;
};
export const questionnaireSteps = [
  { title: "Toi", description: "On fait connaissance." },
  { title: "Ton trading", description: "Ton expérience, sans filtre." },
  { title: "Ta situation", description: "Un accompagnement qui trouve sa place dans ta vie." },
  { title: "Ton engagement", description: "Les bonnes conditions pour commencer." },
  { title: "Validation", description: "Un dernier regard avant ta recommandation." },
];

export const questionGroups: Question[][] = [
  [
    { id: "firstName", number: 1, label: "Ton prénom", type: "text", required: true, maxLength: 80, autoComplete: "given-name" },
    { id: "email", number: 2, label: "Ton adresse e-mail", type: "email", required: true, maxLength: 254, autoComplete: "email" },
    { id: "telegram", number: 3, label: "Ton @ Telegram", type: "text", required: true, hint: "C’est le @ dans tes paramètres Telegram. Il me permettra de te recontacter.", placeholder: "@tonpseudo", maxLength: 33 },
    { id: "instagram", number: 4, label: "Ton Instagram", type: "text", placeholder: "@tonpseudo", maxLength: 100 },
    { id: "location", number: 5, label: "Tu habites où ?", type: "radio", required: true, options: [
      { value: "idf", label: "Paris / Île-de-France" }, { value: "france", label: "Ailleurs en France" }, { value: "abroad", label: "Hors de France" },
    ] },
    { id: "adult", number: 6, label: "Tu as 18 ans ou plus ?", type: "radio", required: true, options: [
      { value: "yes", label: "Oui" }, { value: "no", label: "Non" },
    ] },
  ],
  [
    { id: "level", number: 7, label: "Où en es-tu en trading ?", type: "radio", required: true, options: [
      { value: "new", label: "Je n’ai jamais tradé" }, { value: "basics", label: "J’ai des bases, mais fragiles" },
      { value: "intermediate", label: "Intermédiaire : de l’expérience, des résultats irréguliers" }, { value: "advanced", label: "Avancé : je veux une stratégie et un système solides" },
    ] },
    { id: "experience", number: 8, label: "Ton parcours jusqu’ici", type: "checkbox", required: true, hint: "Plusieurs réponses possibles.", options: [
      { value: "training", label: "J’ai déjà suivi une formation" }, { value: "plan", label: "J’ai un plan de trading écrit" },
      { value: "journal", label: "Je tiens un journal de trading" }, { value: "live", label: "J’ai déjà tradé en réel" },
      { value: "prop", label: "J’ai déjà passé un challenge prop firm" }, { value: "none", label: "Rien de tout ça pour l’instant" },
    ] },
    { id: "blocker", number: 9, label: "Qu’est-ce qui te bloque le plus aujourd’hui ?", type: "radio", required: true, options: [
      { value: "discipline", label: "Discipline et émotions : je sais quoi faire, je ne le fais pas" }, { value: "strategy", label: "Pas de stratégie claire" },
      { value: "risk", label: "La gestion du risque" }, { value: "information", label: "Trop d’infos, je ne sais pas par où commencer" }, { value: "time", label: "Le manque de temps" },
    ] },
    { id: "blockerDetails", number: 9, label: "Développe en une ou deux phrases", type: "textarea", maxLength: 1000 },
  ],
  [
    { id: "job", number: 10, label: "Ta situation pro", type: "radio", required: true, options: [
      { value: "employee", label: "Salarié à temps plein" }, { value: "freelance", label: "Freelance / entrepreneur" }, { value: "student", label: "Étudiant" }, { value: "other", label: "Autre" },
    ] },
    { id: "time", number: 11, label: "Combien de temps par semaine peux-tu consacrer au trading ?", type: "radio", required: true, options: [
      { value: "under3", label: "Moins de 3 h" }, { value: "3to6", label: "3 à 6 h" }, { value: "over6", label: "Plus de 6 h" },
    ] },
    { id: "format", number: 12, label: "Comment veux-tu être accompagné ?", type: "radio", required: true, options: [
      { value: "presentiel", label: "En face à face, à Paris / Île-de-France" }, { value: "distance", label: "En visio, à distance" },
    ] },
    { id: "rhythm", number: 13, label: "Quel rythme de rencontres te correspond ?", type: "radio", required: true, options: [
      { value: "weekly", label: "Je veux pouvoir te voir chaque semaine" }, { value: "monthly", label: "1 à 2 fois par mois me suffisent" },
    ] },
  ],
  [
    { id: "reserve", number: 14, label: "As-tu mis de côté de quoi te former, puis investir ?", type: "radio", required: true,
      hint: "Il faut une réserve pour te former, et une autre pour investir le moment venu, que tu peux te permettre de perdre.", options: [
      { value: "ready", label: "Oui, j’ai une réserve dédiée pour me former et pour investir" }, { value: "building", label: "Oui, pour me former ; la réserve pour investir est en cours" }, { value: "living", label: "Pas encore, j’ai besoin de cet argent pour vivre" },
    ] },
    { id: "budget", number: 15, label: "Quel budget as-tu prévu pour te former ?", type: "radio", required: true, options: [
      { value: "under1200", label: "Moins de 1 200 €" }, { value: "1200to1800", label: "1 200 à 1 800 €" }, { value: "1800to2300", label: "1 800 à 2 300 €" }, { value: "2300plus", label: "2 300 € et plus" },
    ] },
    { id: "commitment", number: 16, label: "À quel point es-tu prêt à t’engager, si ton profil est retenu ?", type: "scale", required: true, hint: "De 1 (peu engagé) à 10 (prêt à m’investir pleinement).", options: Array.from({ length: 10 }, (_, i) => ({ value: String(i + 1), label: String(i + 1) })) },
    { id: "motivation", number: 17, label: "Pourquoi toi ? Qu’est-ce qui fait que je devrais t’accompagner ?", type: "textarea", required: true, hint: "Pas besoin d’un roman. Sois direct.", maxLength: 3000 },
    { id: "money", number: 18, label: "Ton rapport à l’argent aujourd’hui ?", type: "radio", required: true, options: [
      { value: "calm", label: "Serein, je gère bien" }, { value: "complicated", label: "Compliqué, je veux travailler dessus" },
    ] },
    { id: "source", number: 19, label: "Comment m’as-tu connu ?", type: "radio", required: true, options: [
      { value: "instagram", label: "Instagram" }, { value: "word", label: "Bouche-à-oreille" }, { value: "meeting", label: "Rencontre en personne" }, { value: "alumni", label: "Ancien élève" }, { value: "other", label: "Autre" },
    ] },
  ],
  [
    { id: "confirmations", number: 20, label: "Je confirme", type: "checkbox", required: true, options: [
      { value: "skill", label: "Je cherche à apprendre une compétence, pas des signaux à copier." },
      { value: "education", label: "Je comprends qu’il s’agit de formation, pas de conseil en investissement." },
      { value: "coachable", label: "Je suis coachable : je suis prêt à appliquer un cadre et un process." },
    ] },
  ],
];
