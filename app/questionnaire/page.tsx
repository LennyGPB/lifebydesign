import type { Metadata } from "next";
import { Questionnaire } from "@/components/questionnaire/Questionnaire";
import { QuestionnaireBackdrop } from "@/components/questionnaire/QuestionnaireBackdrop";
import { questionnairePage as content } from "@/content/pages";

export const metadata: Metadata = {
  title: content.metaTitle,
  description: content.metaDescription,
  alternates: { canonical: "/questionnaire" },
};

export default function QuestionnairePage() {
  return (
    <div className="relative isolate">
      <QuestionnaireBackdrop />
      <Questionnaire />
    </div>
  );
}
