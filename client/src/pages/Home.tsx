import { HeroSection } from "@/components/HeroSection";
import { FeaturedCocktails } from "@/components/FeaturedCocktails";
import { FeaturedBars } from "@/components/FeaturedBars";
import { HowItWorks } from "@/components/HowItWorks";
import { SpecialOffers } from "@/components/SpecialOffers";
import { PackagingShowcase } from "@/components/PackagingShowcase";
import { AppDownload } from "@/components/AppDownload";
import { PremiumServices } from "@/components/PremiumServices";
import { Helmet } from "react-helmet";

export default function Home() {
  return (
    <>
      <Helmet>
        <title>Mixtr - Top Shelf Cocktails Delivered</title>
        <meta
          name="description"
          content="Premium cocktails from the best bars in your city, delivered to your door."
        />
      </Helmet>
      
      <HeroSection />
      <FeaturedCocktails />
      <FeaturedBars />
      <HowItWorks />
      <PremiumServices /> {/* Added our new premium services showcase */}
      <SpecialOffers />
      <PackagingShowcase />
      <AppDownload />
    </>
  );
}
