import { questionGroups } from "../content/questionnaire";
import { getFormule, type Format, type Niveau } from "../config/formules";

export type Answers = Record<string, string | string[]>;
export type FieldErrors = Record<string, string>;
export type QuestionnaireResult =
  | { status: "blocked"; reason: "age" | "reserve" | "budget" }
  | { status: "recommended"; formuleId: string; duration: string; reasons: string[]; notes: string[]; inPersonOption: boolean };

export function validateAnswers(answers: Answers, group?: number): FieldErrors {
  const errors: FieldErrors = {};
  const questions = group === undefined ? questionGroups.flat() : questionGroups[group] ?? [];
  for (const q of questions) {
    const value = answers[q.id];
    const array = q.type === "checkbox";
    if (array) {
      if (!Array.isArray(value) || value.some(v => typeof v !== "string" || !q.options?.some(o => o.value === v)) || new Set(value).size !== value.length) {
        if (q.required || value !== undefined) errors[q.id] = "Sélectionne une réponse valide.";
      } else if (q.required && !value.length) errors[q.id] = "Choisis au moins une réponse.";
      else if (q.id === "experience" && value.includes("none") && value.length > 1) errors[q.id] = "« Rien de tout ça » ne peut pas être combiné avec une autre réponse.";
      else if (q.id === "confirmations" && value.length !== q.options?.length) errors[q.id] = "Confirme les trois engagements pour continuer.";
    } else {
      if (value !== undefined && typeof value !== "string") { errors[q.id] = "Cette réponse n’est pas valide."; continue; }
      const text = typeof value === "string" ? value.trim() : "";
      if (q.required && !text) errors[q.id] = "Renseigne cette réponse pour continuer.";
      else if (text && q.options && !q.options.some(o => o.value === text)) errors[q.id] = "Choisis une réponse proposée.";
      else if (q.maxLength && text.length > q.maxLength) errors[q.id] = `Maximum ${q.maxLength} caractères.`;
      else if (q.id === "email" && text && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)) errors[q.id] = "Entre une adresse e-mail valide.";
      else if (q.id === "telegram" && text && !/^@?[a-zA-Z][a-zA-Z0-9_]{4,31}$/.test(text)) errors[q.id] = "Entre ton pseudo Telegram : 5 à 32 caractères, lettres, chiffres ou underscore.";
    }
  }
  return errors;
}

export function cleanAnswers(input: unknown): Answers | null {
  if (!input || typeof input !== "object" || Array.isArray(input)) return null;
  const source = input as Record<string, unknown>;
  const cleaned: Answers = {};
  for (const q of questionGroups.flat()) {
    const v = source[q.id];
    if (v === undefined) continue;
    if (typeof v === "string") cleaned[q.id] = v.trim();
    else if (Array.isArray(v) && v.length <= 10 && v.every(item => typeof item === "string" && item.length <= 100)) cleaned[q.id] = v;
    else return null;
  }
  return cleaned;
}

export function recommend(answers: Answers): QuestionnaireResult {
  if (answers.adult === "no") return { status: "blocked", reason: "age" };
  if (answers.reserve === "living") return { status: "blocked", reason: "reserve" };
  if (answers.budget === "under1200") return { status: "blocked", reason: "budget" };
  const beginner = answers.level === "new" || answers.level === "basics";
  const niveau: Niveau = beginner || answers.rhythm === "weekly" ? "complet" : "avance";
  let format: Format = answers.format === "presentiel" && answers.location === "idf" ? "presentiel" : "distance";
  let inPersonOption = answers.format === "presentiel" && format === "distance";
  const ceiling = answers.budget === "1200to1800" ? 1800 : answers.budget === "1800to2300" ? 2300 : Infinity;
  let formule = getFormule(niveau, format);
  let budgetFallback = false;
  if (formule.prix > ceiling && format === "presentiel") {
    format = "distance";
    formule = getFormule(niveau, format);
    inPersonOption = true;
    budgetFallback = true;
  }
  if (formule.prix > ceiling) return { status: "blocked", reason: "budget" };
  const reasons = [beginner
    ? "Le parcours Complet te permet de construire des bases solides, avec un suivi chaque semaine pendant six mois."
    : answers.rhythm === "weekly"
      ? "Tu souhaites un suivi chaque semaine : le parcours Complet correspond à ce rythme."
      : "Ton expérience et ton autonomie correspondent au parcours Avancé, avec une à deux rencontres par mois.",
    budgetFallback ? "Le format à distance conserve le bon niveau d’accompagnement et entre dans ta tranche de budget. Une séance présentielle reste possible en option."
      : format === "presentiel" ? "Tu souhaites un accompagnement en face à face et tu es en Île-de-France."
      : inPersonOption ? "Hors Île-de-France, le suivi se fait à distance. Une séance présentielle reste possible en option."
      : "Le format à distance correspond à ton choix d’un accompagnement en visio."];
  const notes: string[] = [];
  if (answers.money === "complicated") notes.push(formule.bonus
    ? "Le Kit Plan Financier Intérieur est recommandé pour toi et inclus dans cette formule."
    : "Le Kit Plan Financier Intérieur est recommandé pour toi. Tu peux le demander lors de notre échange.");
  if (answers.time === "under3") notes.push("Prévois au moins 3 h par semaine pour avancer au bon rythme.");
  if (answers.reserve === "building") notes.push("On commence par l’apprentissage. On reparle d’investir quand ta réserve sera prête.");
  if (answers.blocker === "discipline") notes.push("On travaillera en priorité le process et le mental check.");
  return { status: "recommended", formuleId: formule.id, duration: niveau === "complet" ? "6 mois" : answers.level === "intermediate" ? "4 mois" : "3 mois", reasons, notes, inPersonOption };
}

// La motivation reste à évaluer humainement : cette priorité est indicative.
export function leadPriority(answers: Answers): "A" | "B" | "C" {
  if (Number(answers.commitment) <= 5 || !String(answers.motivation ?? "").trim()) return "C";
  if (Number(answers.commitment) <= 7 || answers.reserve === "building" || answers.time === "under3") return "B";
  return "A";
}
