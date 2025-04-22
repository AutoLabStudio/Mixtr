import { Snowflake, Droplet, Leaf, ImageOff } from "lucide-react";
import { useState } from "react";

export function PackagingShowcase() {
  const [imageErrors, setImageErrors] = useState<boolean[]>([false, false, false, false]);
  
  const handleImageError = (index: number) => {
    const newErrors = [...imageErrors];
    newErrors[index] = true;
    setImageErrors(newErrors);
  };
  
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
    "https://images.pexels.com/photos/5947019/pexels-photo-5947019.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/4021983/pexels-photo-4021983.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/5336951/pexels-photo-5336951.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/4021939/pexels-photo-4021939.jpeg?auto=compress&cs=tinysrgb&w=600"
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
              <div key={index} className="relative rounded-lg shadow-lg h-64 w-full overflow-hidden">
                {imageErrors[index] ? (
                  <div className="h-full w-full bg-muted flex flex-col items-center justify-center text-muted-foreground">
                    <ImageOff className="h-8 w-8 mb-2" />
                    <p className="text-sm">Premium Packaging</p>
                  </div>
                ) : (
                  <img 
                    src={image} 
                    alt={`Packaging Image ${index + 1}`}
                    className="h-full w-full object-cover"
                    onError={() => handleImageError(index)}
                    loading="lazy"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
