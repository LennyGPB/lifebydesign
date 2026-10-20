import { Reveal } from "@/components/ui/Reveal";
import { constat } from "@/content/landing";

const cardAngles = [
  "[transform:translateY(0px)_rotateX(6deg)_rotateY(-10deg)_rotateZ(-4deg)] lg:[transform:translateY(10px)_rotateX(8deg)_rotateY(-12deg)_rotateZ(-5deg)]",
  "[transform:translateY(0px)_rotateX(-5deg)_rotateY(8deg)_rotateZ(3deg)] lg:[transform:translateY(-14px)_rotateX(-6deg)_rotateY(10deg)_rotateZ(4deg)]",
  "[transform:translateY(0px)_rotateX(5deg)_rotateY(-8deg)_rotateZ(-3deg)] lg:[transform:translateY(18px)_rotateX(7deg)_rotateY(-10deg)_rotateZ(-4deg)]",
  "[transform:translateY(0px)_rotateX(-4deg)_rotateY(10deg)_rotateZ(4deg)] lg:[transform:translateY(-6px)_rotateX(-5deg)_rotateY(12deg)_rotateZ(5deg)]",
];

export function Constat() {
  const titleId = `${constat.id}-title`;

  return (
    <section id={constat.id} aria-labelledby={titleId} className="py-24 md:py-36">
      <div className="shell">
        <Reveal className="max-w-3xl">
          <h2 id={titleId} className="font-display text-[clamp(2.125rem,4.8vw,3.75rem)] leading-[1.04] font-normal tracking-[-0.015em] text-balance">
            <span className="font-extralight italic">{constat.title.intro}</span>{" "}
            <span>{constat.title.conclusion}</span>
          </h2>
        </Reveal>

        <ul className="mt-20 grid gap-10 px-2 sm:grid-cols-2 md:mt-28 lg:grid-cols-4 lg:gap-8">
          {constat.items.map((item, index) => (
            <li key={item.title} className="group relative flex min-w-0 [perspective:1000px] hover:z-10">
              {index < constat.items.length - 1 ? (
                <span
                  aria-hidden="true"
                  className={`pointer-events-none absolute top-full left-1/2 h-10 w-px bg-linear-to-b from-[#77736d] via-[#aaa59b] to-[#77736d] sm:top-1/2 sm:left-full sm:h-px sm:w-10 sm:bg-linear-to-r lg:block lg:w-8 ${index % 2 === 0 ? "sm:block" : "sm:hidden"}`}
                />
              ) : null}
              {index < 2 ? (
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute top-full left-1/2 hidden h-10 w-px bg-linear-to-b from-[#77736d] via-[#aaa59b] to-[#77736d] sm:block lg:hidden"
                />
              ) : null}
              <Reveal variant="card" delay={index * 0.16} className="flex w-full [perspective:1000px]">
                <article className={`relative isolate flex w-full flex-col overflow-hidden rounded-2xl border border-white/20 bg-white/[0.1] backdrop-blur-md group-hover:border-white/30 group-hover:bg-white/[0.15] p-7 shadow-[inset_0_1px_0_#ffffff40,inset_1px_0_0_#ffffff15,inset_0_-2px_2px_#00000080,0_3px_1px_#0b0b0d,0_7px_2px_#09090b,0_12px_12px_-4px_#000000b3,0_28px_40px_-16px_#000000e6] transition-[transform,box-shadow,background-color,border-color] duration-[1200ms] ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:shadow-[inset_0_1px_0_#ffffff60,inset_1px_0_0_#ffffff20,inset_0_-2px_2px_#00000080,0_4px_2px_#0b0b0d,0_9px_3px_#09090b,0_20px_24px_-8px_#000000b3,0_40px_55px_-16px_#000000e6] group-hover:[transform:translateY(-10px)_rotateX(0deg)_rotateY(0deg)_rotateZ(0deg)] md:p-8 ${cardAngles[index]}`}>
                  <span aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 rounded-[inherit] opacity-0 transition-opacity duration-500 ease-calm group-hover:opacity-100 motion-reduce:transition-none">
                    <span className="glass-flow" />
                  </span>
                  <div aria-hidden="true" className="flex items-center justify-between gap-4">
                    <span className="font-display text-sm tracking-widest text-text-muted transition-colors duration-500 group-hover:text-text motion-reduce:transition-none">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="h-px w-10 bg-linear-to-r from-text/25 to-transparent" />
                  </div>
                  <h3 className="mt-10 font-display text-2xl leading-[1.15] tracking-[-0.015em] md:mt-14">
                    {item.title}
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-[#aaa69f] md:text-[0.95rem]">
                    {item.text}
                  </p>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
