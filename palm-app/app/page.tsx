import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Problem from "@/components/Problem";
import Explore from "@/components/Explore";
import Pillars from "@/components/Pillars";
import Calculator from "@/components/Calculator";
import Comparativa from "@/components/Comparativa";
import CtaFinal from "@/components/CtaFinal";
import Footer from "@/components/Footer";
import { ClientEnhancements } from "@/app/_client/ClientEnhancements";
import CardAnimations from "@/components/CardAnimations";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Marquee />
      <Problem />
      <Explore />
      <Calculator />
      <Comparativa />
      <Pillars />
      <CtaFinal />
      <Footer />
      <ClientEnhancements />
      <CardAnimations />
    </>
  );
}
