import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Flame, Leaf } from "lucide-react";

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  isSpicy?: boolean;
  isVegetarian?: boolean;
  rating: number;
  image?: string;
}

const menuItems: MenuItem[] = [
  // Entrantes
  {
    id: 1,
    name: "Samosas de Jamón Ibérico",
    description: "Crujientes samosas rellenas de jamón ibérico y cebolla caramelizada con chutney de tomate",
    price: 12,
    category: "Entrantes",
    rating: 4.8,
  },
  {
    id: 2,
    name: "Pappadums con Tapenade",
    description: "Pappadums caseros servidos con tapenade de aceitunas españolas y hummus de garbanzos",
    price: 8,
    category: "Entrantes",
    isVegetarian: true,
    rating: 4.5,
  },
  {
    id: 3,
    name: "Croquetas de Curry",
    description: "Croquetas cremosas de pollo al curry con salsa de yogur y menta",
    price: 10,
    category: "Entrantes",
    rating: 4.7,
  },
  
  // Principales
  {
    id: 4,
    name: "Dosa Ibérico",
    description: "Dosa tradicional relleno de jamón ibérico, queso manchego y chutney de pimiento del piquillo",
    price: 18,
    category: "Principales",
    rating: 4.9,
  },
  {
    id: 5,
    name: "Paella Curry",
    description: "Arroz basmati con azafrán, mariscos del Mediterráneo y especias de Mumbai",
    price: 24,
    category: "Principales",
    isSpicy: true,
    rating: 4.8,
  },
  {
    id: 6,
    name: "Cordero Tandoor Andaluz",
    description: "Cordero marinado en yogur y especias, asado en tandoor con salsa romesco",
    price: 26,
    category: "Principales",
    isSpicy: true,
    rating: 4.9,
  },
  {
    id: 7,
    name: "Biryani Valenciano",
    description: "Arroz basmati aromático con verduras de temporada, azafrán y almendras",
    price: 16,
    category: "Principales",
    isVegetarian: true,
    rating: 4.6,
  },

  // Postres
  {
    id: 8,
    name: "Gulab Jamun con Crema Catalana",
    description: "Dulce tradicional indio bañado en almíbar con crema catalana y pistachos",
    price: 8,
    category: "Postres",
    isVegetarian: true,
    rating: 4.7,
  },
  {
    id: 9,
    name: "Kulfi de Turrón",
    description: "Helado tradicional indio con sabor a turrón de Jijona y miel de azahar",
    price: 7,
    category: "Postres",
    isVegetarian: true,
    rating: 4.5,
  },

  // Bebidas
  {
    id: 10,
    name: "Lassi de Sangría",
    description: "Bebida refrescante de yogur con frutas de temporada y un toque de vino tinto",
    price: 6,
    category: "Bebidas",
    isVegetarian: true,
    rating: 4.4,
  },
  {
    id: 11,
    name: "Chai Andaluz",
    description: "Té especiado tradicional con leche de almendras y miel de azahar",
    price: 4,
    category: "Bebidas",
    isVegetarian: true,
    rating: 4.6,
  },
];

const categories = ["Todos", "Entrantes", "Principales", "Postres", "Bebidas"];

const Menu = () => {
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  const filteredItems = selectedCategory === "Todos" 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-display font-bold text-foreground mb-6">
            Nuestra <span className="text-golden">Carta</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Descubre una experiencia gastronómica única donde la tradición culinaria 
            india se fusiona armoniosamente con los sabores auténticos de España
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

        {/* Menu Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredItems.map((item) => (
            <Card key={item.id} className="shadow-elegant hover:shadow-golden transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-xl font-display font-semibold text-foreground">
                        {item.name}
                      </h3>
                      <div className="flex space-x-1">
                        {item.isSpicy && (
                          <Badge variant="secondary" className="bg-red-100 text-red-700">
                            <Flame className="h-3 w-3 mr-1" />
                            Picante
                          </Badge>
                        )}
                        {item.isVegetarian && (
                          <Badge variant="secondary" className="bg-green-100 text-green-700">
                            <Leaf className="h-3 w-3 mr-1" />
                            Vegetariano
                          </Badge>
                        )}
                      </div>
                    </div>
                    <p className="text-muted-foreground mb-3 leading-relaxed">
                      {item.description}
                    </p>
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-golden text-golden" />
                        <span className="text-sm font-medium text-foreground">
                          {item.rating}
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {item.category}
                      </span>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-3xl font-bold text-golden">
                      {item.price}€
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16 p-8 bg-gradient-elegant rounded-lg">
          <h2 className="text-3xl font-display font-bold text-white mb-4">
            ¿Te ha gustado lo que has visto?
          </h2>
          <p className="text-blue-grey-light mb-6 text-lg">
            Reserva tu mesa y disfruta de una experiencia culinaria inolvidable
          </p>
          <Button size="lg" className="bg-golden hover:bg-golden-dark text-blue-grey-dark font-semibold">
            Reservar Mesa Ahora
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Menu;