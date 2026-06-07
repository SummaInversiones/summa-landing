import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Problem from "@/components/Problem";
import Pillars from "@/components/Pillars";
import CtaFinal from "@/components/CtaFinal";
import Footer from "@/components/Footer";
import { ClientEnhancements } from "@/app/_client/ClientEnhancements";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Marquee />
      <Problem />
      {/* Plan 2B: <Explore /> scanner cards */}
      <Pillars />
      {/* Plan 2B: <Calculator /> */}
      {/* Plan 2B: <Comparativa /> bento */}
      <CtaFinal />
      <Footer />
      {/* Plan 2B: <GradualBlur /> */}
      <ClientEnhancements />
    </>
  );
}
