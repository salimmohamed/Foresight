import BlurFade from "@/components/magicui/blur-fade";
import BlurFadeText from "@/components/magicui/blur-fade-text";
import { DATA } from "@/data/resume";

const BLUR_FADE_DELAY = 0.04;

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <section id="hero">
        <BlurFade delay={BLUR_FADE_DELAY}>
          <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
            {DATA.name}
          </h1>
        </BlurFade>
        <BlurFadeText
          className="text-xl text-muted-foreground"
          text={DATA.description}
          delay={BLUR_FADE_DELAY * 2}
        />
      </section>
    </main>
  );
}