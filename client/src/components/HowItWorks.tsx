import { Search, ShoppingCart, GlassWater } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      icon: <Search className="h-8 w-8 text-primary" />,
      title: "Browse & Select",
      description: "Explore our curated selection of cocktails from top local bars and add your favorites to cart."
    },
    {
      icon: <ShoppingCart className="h-8 w-8 text-primary" />,
      title: "Order & Pay",
      description: "Complete your order securely, select your delivery time, and pay online with ease."
    },
    {
      icon: <GlassWater className="h-8 w-8 text-primary" />,
      title: "Receive & Enjoy",
      description: "Your cocktails arrive in specially designed packaging to maintain quality and freshness."
    }
  ];

  return (
    <section className="py-16 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-serif font-bold text-3xl md:text-4xl mb-4">How Mixtr Works</h2>
          <div className="w-24 h-1 bg-primary mx-auto"></div>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Your favorite cocktails from the best bars, delivered in just a few simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="bg-muted rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg">
                {step.icon}
              </div>
              <h3 className="font-serif font-semibold text-xl mb-3">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
