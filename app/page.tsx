import { APropos } from "@/components/landing/APropos";
import { Constat } from "@/components/landing/Constat";
import { CtaFinal } from "@/components/landing/CtaFinal";
import { Formules } from "@/components/landing/Formules";
import { Hero } from "@/components/landing/Hero";
import { Methode } from "@/components/landing/Methode";
import { Process } from "@/components/landing/Process";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Constat />
      <Methode />
      <APropos />
      <Formules />
      <Process />
      <CtaFinal />
    </>
  );
}
