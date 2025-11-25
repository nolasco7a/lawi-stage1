"use client";

import Navbar from "@/components/home/navbar";

import { CtaFinal } from "@/components/homepage/sections/cta-final";
import { FaqSection } from "@/components/homepage/sections/faq-section";
import { FooterSection } from "@/components/homepage/sections/footer-section";
import { HowItWorksSection } from "@/components/homepage/sections/how-it-works-section";
import { LawyerBenefitsSection } from "@/components/homepage/sections/lawyer-benefits-section";
import { MainSection } from "@/components/homepage/sections/main-section";
import { PlansPricesSection } from "@/components/homepage/sections/plans-prices-section";
import { TestimonialsSection } from "@/components/homepage/sections/testimonials-section";
import { UserBenefitsSection } from "@/components/homepage/sections/user-benefits-section";

export default function Home() {
  return (
    <div className="min-h-screen w-full">
      <Navbar />

      <MainSection />
      <HowItWorksSection />
      <UserBenefitsSection />
      <LawyerBenefitsSection />
      <TestimonialsSection />
      <PlansPricesSection />
      <FaqSection />
      <CtaFinal />
      <FooterSection />
    </div>
  );
}
