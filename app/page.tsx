import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Problem from "@/components/Problem";
import Explore from "@/components/Explore";
import Pillars from "@/components/Pillars";
import Calculator from "@/components/Calculator";
import Comparativa from "@/components/Comparativa";
import Footer from "@/components/Footer";
import { ClientEnhancements } from "@/app/_client/ClientEnhancements";
import CardAnimations from "@/components/CardAnimations";
import StructuredData from "@/components/StructuredData";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <StructuredData />
      <Navbar />
      <Hero />
      <Marquee />
      <Problem />
      <Explore />
      <Calculator />
      <Comparativa />
      <Pillars />
      <Footer />
      <ClientEnhancements />
      <CardAnimations />
    </>
  );
}
