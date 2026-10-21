import type { Metadata } from "next";
import { Questionnaire } from "@/components/questionnaire/Questionnaire";
import { GlowBackdrop } from "@/components/ui/GlowBackdrop";
import { questionnairePage as content } from "@/content/pages";

export const metadata: Metadata = {
  title: content.metaTitle,
  description: content.metaDescription,
  alternates: { canonical: "/questionnaire" },
};

export default function QuestionnairePage() {
  return (
    <div className="relative isolate">
      <GlowBackdrop />
      <Questionnaire />
    </div>
  );
}
