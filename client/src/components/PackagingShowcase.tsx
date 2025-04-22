import { Snowflake, Droplet, Leaf } from "lucide-react";

export function PackagingShowcase() {
  const features = [
    {
      icon: <Snowflake className="text-xl text-primary" />,
      title: "Temperature Control",
      description: "Specialized containers maintain the perfect temperature for each cocktail type."
    },
    {
      icon: <Droplet className="text-xl text-primary" />,
      title: "Spill-Proof Design",
      description: "Securely sealed containers prevent spills and preserve carbonation."
    },
    {
      icon: <Leaf className="text-xl text-primary" />,
      title: "Eco-Friendly Materials",
      description: "Sustainable packaging that's good for your cocktails and the environment."
    }
  ];

  const images = [
    "https://images.unsplash.com/photo-1578305035108-1ef3bb6ebe75?ixlib=rb-4.0.3",
    "https://images.unsplash.com/photo-1609951651790-c8cbf9c69350?ixlib=rb-4.0.3",
    "https://images.unsplash.com/photo-1583225214464-9296029427aa?ixlib=rb-4.0.3",
    "https://images.unsplash.com/photo-1563223771-375783ee91ad?ixlib=rb-4.0.3"
  ];

  return (
    <section className="py-16 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <h2 className="font-serif font-bold text-3xl md:text-4xl mb-6">
              Premium Packaging for Perfect Delivery
            </h2>
            <div className="w-24 h-1 bg-accent mb-6"></div>
            <p className="text-muted-foreground mb-6">
              Our innovative packaging is designed to ensure your cocktails arrive in perfect condition, 
              maintaining the quality, taste, and presentation that you would expect in a top-tier bar.
            </p>
            
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start">
                  <div className="bg-muted rounded-full w-10 h-10 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="order-1 lg:order-2 grid grid-cols-2 gap-4">
            {images.map((image, index) => (
              <img 
                key={index}
                src={image} 
                alt={`Packaging Image ${index + 1}`}
                className="rounded-lg shadow-lg h-64 w-full object-cover" 
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
