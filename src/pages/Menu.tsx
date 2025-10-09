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
  // Embutidos y Quesos
  {
    id: 1,
    name: "Jamón Ibérico",
    description: "Jamón ibérico de bellota cortado a mano",
    price: 0,
    category: "Embutidos y Quesos",
    rating: 4.9,
  },
  {
    id: 2,
    name: "Selección de Ibéricos",
    description: "Variedad de embutidos ibéricos premium",
    price: 0,
    category: "Embutidos y Quesos",
    rating: 4.8,
  },
  {
    id: 3,
    name: "Selección de Quesos",
    description: "Tabla de quesos artesanales con mermeladas",
    price: 0,
    category: "Embutidos y Quesos",
    isVegetarian: true,
    rating: 4.7,
  },

  // Fast Food
  {
    id: 4,
    name: "Hamburguesa de Buey",
    description: "Hamburguesa de carne de buey premium con guarnición",
    price: 0,
    category: "Fast Food",
    rating: 4.8,
  },
  {
    id: 5,
    name: "Patatas Bravas",
    description: "Patatas crujientes con salsa brava casera",
    price: 0,
    category: "Fast Food",
    isSpicy: true,
    isVegetarian: true,
    rating: 4.6,
  },
  {
    id: 6,
    name: "Mini Burger",
    description: "Mini hamburguesas perfectas para compartir",
    price: 0,
    category: "Fast Food",
    rating: 4.5,
  },
  {
    id: 7,
    name: "Torrenzo de Soria",
    description: "Especialidad tradicional de Soria",
    price: 0,
    category: "Fast Food",
    rating: 4.7,
  },
  {
    id: 8,
    name: "Croquetas de Pollo Curry Mali",
    description: "Croquetas cremosas de pollo con especias curry",
    price: 0,
    category: "Fast Food",
    rating: 4.8,
  },
  {
    id: 9,
    name: "Croquetas de Kimchi y Mango",
    description: "Fusión única de sabores orientales y tropicales",
    price: 0,
    category: "Fast Food",
    isVegetarian: true,
    rating: 4.7,
  },
  {
    id: 10,
    name: "Samosas Vegetales",
    description: "Samosas crujientes rellenas de verduras frescas",
    price: 0,
    category: "Fast Food",
    isVegetarian: true,
    rating: 4.6,
  },
  {
    id: 11,
    name: "Gyosa de Ropa Vieja",
    description: "Gyosa con relleno de ropa vieja y jugo vegetal",
    price: 0,
    category: "Fast Food",
    rating: 4.8,
  },

  // Carne
  {
    id: 12,
    name: "Onglet de Angus",
    description: "Onglet de angus con irish champ y jugo de carne",
    price: 0,
    category: "Carne",
    rating: 4.9,
  },
  {
    id: 13,
    name: "Rulo de Lechazo",
    description: "Rulo de lechazo con boletus y jugo de granada",
    price: 0,
    category: "Carne",
    rating: 4.9,
  },

  // Del Mar
  {
    id: 14,
    name: "Tartar de Atún Rojo",
    description: "Tartar de atún rojo, sandía y ponzu de tomate",
    price: 0,
    category: "Del Mar",
    rating: 4.8,
  },
  {
    id: 15,
    name: "Rodaballo",
    description: "Rodaballo con puré de coliflor y salsa ponzu",
    price: 0,
    category: "Del Mar",
    rating: 4.9,
  },

  // Arroz
  {
    id: 16,
    name: "Arroz de Marisco",
    description: "Arroz con una selección de mariscos frescos",
    price: 0,
    category: "Arroz",
    rating: 4.8,
  },

  // Guarniciones
  {
    id: 17,
    name: "Patatas Fritas",
    description: "Patatas fritas crujientes",
    price: 0,
    category: "Guarniciones",
    isVegetarian: true,
    rating: 4.5,
  },
  {
    id: 18,
    name: "Boniato Frito",
    description: "Boniato frito con toque dulce",
    price: 0,
    category: "Guarniciones",
    isVegetarian: true,
    rating: 4.6,
  },

  // Postres
  {
    id: 19,
    name: "Tarta de Quesos",
    description: "Tarta de queso cremosa con base de galleta",
    price: 0,
    category: "Postres",
    isVegetarian: true,
    rating: 4.8,
  },
  {
    id: 20,
    name: "Torrija con Espuma de Vainilla",
    description: "Torrija tradicional con espuma de vainilla",
    price: 0,
    category: "Postres",
    isVegetarian: true,
    rating: 4.7,
  },
  {
    id: 21,
    name: "Pannacotta con Chutney de Mango",
    description: "Pannacotta suave con chutney de mango fresco",
    price: 0,
    category: "Postres",
    isVegetarian: true,
    rating: 4.7,
  },
];

const categories = ["Todos", "Embutidos y Quesos", "Fast Food", "Carne", "Del Mar", "Arroz", "Guarniciones", "Postres"];

const Menu = () => {
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  const filteredItems = selectedCategory === "Todos" 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-display font-bold text-foreground mb-6">
            Nuestra <span className="text-golden">Carta</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Descubre nuestra selección de platos elaborados con productos de primera calidad
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
                      <h3 className="text-xl font-display font-semibold text-card-foreground">
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
                        <span className="text-sm font-medium text-card-foreground">
                          {item.rating}
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {item.category}
                      </span>
                    </div>
                  </div>
                  {item.price > 0 && (
                    <div className="text-right ml-4">
                      <div className="text-3xl font-bold text-golden">
                        {item.price}€
                      </div>
                    </div>
                  )}
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