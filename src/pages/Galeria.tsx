import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import heroImage from "@/assets/gallery/jardin-terraza.jpg";
import fusionDosa from "@/assets/menu/croquetas-kimchi-mango.jpg";
import Paella from "@/assets/menu/arroz-mariscos.jpg";
import restaurantInterior from "@/assets/gallery/interior-rustico.jpg";
import ambienteInterior from "@/assets/gallery/bar-clientes.jpg;
import burguerAtun from "@/assets/menu/mini-burguer.jpeg;
import ruloLechazo from "@/assets/menu/rulo-lechazo.png;
import torrijaHelado from "@/assets/menu/torrija.png;

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  category: string;
}

const galleryImages: GalleryImage[] = [
  {
    id: 1,
    src: heroImage,
    alt: "Jardín terraza de nuestro restaurante",
    category: "Platos",
  },
  {
    id: 2,
    src: fusionDosa,
    alt: "Planto de croquetas kimchi y mango",
    category: "Platos",
  },
  {
    id: 3,
    src: Paella,
    alt: "Arroz con mariscos",
    category: "Platos",
  },
  {
    id: 4,
    src: restaurantInterior,
    alt: "Interior rústico",
    category: "Interior",
  },
  // Simulating more images for a complete gallery
  {
    id: 5,
    src: ambienteInterior,
    alt: "Clientes disfrutando en nuestra barra",
    category: "Ambiente",
  },
  {
    id: 6,
    src: burguerAtun,
    alt: "Mini burguer de atún con nuestra salsa de coco",
    category: "Entrantes",
  },
  {
    id: 7,
    src: ruloLechazo,
    alt: "Rulo de lechazo relleno de champiñón y jugo de granada",
    category: "Platos",
  },
  {
    id: 8,
    src: torrijaHelado,
    alt: "Torrija con helado de café",
    category: "Postres",
  },
];

const categories = ["Todos", "Platos", "Entrantes", "Principales", "Postres", "Ambiente"];

const Galeria = () => {
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  const filteredImages = selectedCategory === "Todos" 
    ? galleryImages 
    : galleryImages.filter(image => image.category === selectedCategory);

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-display font-bold text-foreground mb-6">
            Nuestra <span className="text-golden">Galería</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Descubre la belleza visual de nuestra cocina de fusión y el ambiente 
            elegante que caracteriza a Casa de Dosa
          </p>
        </div>

        {/* Filtros de categoría */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className={selectedCategory === category 
                ? "bg-gradient-golden hover:opacity-90" 
                : "border-golden text-golden hover:bg-golden hover:text-blue-grey-dark"
              }
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredImages.map((image) => (
            <div
              key={image.id}
              className="group relative aspect-square overflow-hidden rounded-lg shadow-elegant hover:shadow-golden transition-all duration-300 cursor-pointer"
              onClick={() => setSelectedImage(image)}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-grey-dark/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white text-sm font-medium">{image.alt}</p>
                  <p className="text-golden text-xs">{image.category}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal para imagen ampliada */}
        {selectedImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="relative max-w-4xl max-h-[90vh] mx-4">
              <Button
                variant="ghost"
                size="sm"
                className="absolute -top-12 right-0 text-white hover:text-golden"
                onClick={() => setSelectedImage(null)}
              >
                <X className="h-6 w-6" />
              </Button>
              <img
                src={selectedImage.src}
                alt={selectedImage.alt}
                className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-lg">
                <h3 className="text-white text-lg font-semibold mb-1">
                  {selectedImage.alt}
                </h3>
                <p className="text-golden text-sm">{selectedImage.category}</p>
              </div>
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-20 p-8 bg-gradient-elegant rounded-lg">
          <h2 className="text-3xl font-display font-bold text-white mb-4">
            ¿Te han gustado nuestros platos?
          </h2>
          <p className="text-blue-grey-light mb-6 text-lg">
            Ven y disfruta de una experiencia gastronómica única en persona
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-golden hover:bg-golden-dark text-blue-grey-dark font-semibold">
              Reservar Mesa
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-golden text-golden hover:bg-golden hover:text-blue-grey-dark"
            >
              Ver Menú Completo
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Galeria;
