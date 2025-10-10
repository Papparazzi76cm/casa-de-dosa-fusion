import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Flame, Leaf, Wheat, Fish, Egg, Milk, Shell, Nut } from "lucide-react";

type Allergen = "gluten" | "crustaceos" | "huevos" | "pescado" | "lacteos" | "frutos_cascara" | "soja" | "apio" | "mostaza" | "sesamo" | "sulfitos" | "moluscos";

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
  allergens?: Allergen[];
}

const allergenInfo: Record<Allergen, { name: string; icon: any; color: string }> = {
  gluten: { name: "Gluten", icon: Wheat, color: "bg-amber-100 text-amber-700" },
  crustaceos: { name: "Crustáceos", icon: Shell, color: "bg-orange-100 text-orange-700" },
  huevos: { name: "Huevos", icon: Egg, color: "bg-yellow-100 text-yellow-700" },
  pescado: { name: "Pescado", icon: Fish, color: "bg-blue-100 text-blue-700" },
  lacteos: { name: "Lácteos", icon: Milk, color: "bg-indigo-100 text-indigo-700" },
  frutos_cascara: { name: "Frutos de cáscara", icon: Nut, color: "bg-brown-100 text-brown-700" },
  soja: { name: "Soja", icon: Leaf, color: "bg-lime-100 text-lime-700" },
  apio: { name: "Apio", icon: Leaf, color: "bg-green-100 text-green-700" },
  mostaza: { name: "Mostaza", icon: Flame, color: "bg-yellow-200 text-yellow-800" },
  sesamo: { name: "Sésamo", icon: Wheat, color: "bg-stone-100 text-stone-700" },
  sulfitos: { name: "Sulfitos", icon: Star, color: "bg-purple-100 text-purple-700" },
  moluscos: { name: "Moluscos", icon: Shell, color: "bg-pink-100 text-pink-700" },
};

const menuItems: MenuItem[] = [
  // Embutidos y Quesos
  {
    id: 1,
    name: "Jamón Ibérico",
    description: "Jamón ibérico de bellota cortado a mano",
    price: 0,
    category: "Embutidos y Quesos",
    rating: 4.9,
    allergens: ["sulfitos"],
  },
  {
    id: 2,
    name: "Selección de Ibéricos",
    description: "Variedad de embutidos ibéricos premium",
    price: 0,
    category: "Embutidos y Quesos",
    rating: 4.8,
    allergens: ["sulfitos"],
  },
  {
    id: 3,
    name: "Selección de Quesos",
    description: "Tabla de quesos artesanales con mermeladas",
    price: 0,
    category: "Embutidos y Quesos",
    isVegetarian: true,
    rating: 4.7,
    allergens: ["lacteos", "frutos_cascara"],
  },

  // Fast Food
  {
    id: 4,
    name: "Hamburguesa de Buey",
    description: "Hamburguesa de carne de buey premium con guarnición",
    price: 0,
    category: "Fast Food",
    rating: 4.8,
    allergens: ["gluten", "huevos", "lacteos", "mostaza", "sesamo"],
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
    allergens: ["gluten", "huevos"],
  },
  {
    id: 6,
    name: "Mini Burger",
    description: "Mini hamburguesas perfectas para compartir",
    price: 0,
    category: "Fast Food",
    rating: 4.5,
    allergens: ["gluten", "huevos", "lacteos", "mostaza", "sesamo"],
  },
  {
    id: 7,
    name: "Torrenzo de Soria",
    description: "Especialidad tradicional de Soria",
    price: 0,
    category: "Fast Food",
    rating: 4.7,
    allergens: ["gluten", "huevos", "lacteos"],
  },
  {
    id: 8,
    name: "Croquetas de Pollo Curry Mali",
    description: "Croquetas cremosas de pollo con especias curry",
    price: 0,
    category: "Fast Food",
    rating: 4.8,
    allergens: ["gluten", "lacteos", "huevos"],
  },
  {
    id: 9,
    name: "Croquetas de Kimchi y Mango",
    description: "Fusión única de sabores orientales y tropicales",
    price: 0,
    category: "Fast Food",
    isVegetarian: true,
    rating: 4.7,
    allergens: ["gluten", "lacteos", "huevos", "soja", "pescado"],
  },
  {
    id: 10,
    name: "Samosas Vegetales",
    description: "Samosas crujientes rellenas de verduras frescas",
    price: 0,
    category: "Fast Food",
    isVegetarian: true,
    rating: 4.6,
    allergens: ["gluten", "mostaza", "sesamo"],
  },
  {
    id: 11,
    name: "Gyoza de Ropa Vieja",
    description: "Gyoza con relleno de ropa vieja y jugo vegetal",
    price: 0,
    category: "Fast Food",
    rating: 4.8,
    allergens: ["gluten", "soja", "huevos", "apio"],
  },

  // Carne
  {
    id: 12,
    name: "Onglet de Angus",
    description: "Onglet de angus con irish champ y jugo de carne",
    price: 0,
    category: "Carne",
    rating: 4.9,
    allergens: ["lacteos", "apio"],
  },
  {
    id: 13,
    name: "Rulo de Lechazo",
    description: "Rulo de lechazo con boletus y jugo de granada",
    price: 0,
    category: "Carne",
    rating: 4.9,
    allergens: ["lacteos", "frutos_cascara", "sulfitos"],
  },

  // Del Mar y los ríos
  {
    id: 14,
    name: "Tartar de Atún Rojo",
    description: "Tartar de atún rojo, sandía y ponzu de tomate",
    price: 0,
    category: "Del Mar",
    rating: 4.8,
    allergens: ["pescado", "soja", "gluten", "sesamo"],
  },
  {
    id: 15,
    name: "Rodaballo",
    description: "Rodaballo con puré de coliflor y salsa ponzu",
    price: 0,
    category: "Del Mar",
    rating: 4.9,
    allergens: ["pescado", "lacteos", "soja"],
  },

  // Arroz
  {
    id: 16,
    name: "Arroz de Marisco",
    description: "Arroz con una selección de mariscos frescos",
    price: 0,
    category: "Arroz",
    rating: 4.8,
    allergens: ["crustaceos", "moluscos", "pescado", "apio"],
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
    allergens: [],
  },
  {
    id: 18,
    name: "Boniato Frito",
    description: "Boniato frito con toque dulce",
    price: 0,
    category: "Guarniciones",
    isVegetarian: true,
    rating: 4.6,
    allergens: [],
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
    allergens: ["lacteos", "gluten", "huevos"],
  },
  {
    id: 20,
    name: "Torrija con Espuma de Vainilla",
    description: "Torrija tradicional con espuma de vainilla",
    price: 0,
    category: "Postres",
    isVegetarian: true,
    rating: 4.7,
    allergens: ["gluten", "lacteos", "huevos"],
  },
  {
    id: 21,
    name: "Pannacotta con Chutney de Mango",
    description: "Pannacotta suave con chutney de mango fresco",
    price: 0,
    category: "Postres",
    isVegetarian: true,
    rating: 4.7,
    allergens: ["lacteos"],
  },

  // Desayunos - Croissant
  {
    id: 22,
    name: "Croissant con Mermelada y Mantequilla",
    description: "Incluye café y zumo natural",
    price: 3.50,
    category: "Desayunos",
    isVegetarian: true,
    rating: 4.6,
    allergens: ["gluten", "lacteos", "huevos"],
  },
  {
    id: 23,
    name: "Croissant con Bacon y Queso",
    description: "Incluye café y zumo natural",
    price: 4.50,
    category: "Desayunos",
    rating: 4.7,
    allergens: ["gluten", "lacteos", "huevos", "sulfitos"],
  },
  {
    id: 24,
    name: "Croissant con Jamón York/Serrano y Queso",
    description: "Incluye café y zumo natural",
    price: 4.50,
    category: "Desayunos",
    rating: 4.7,
    allergens: ["gluten", "lacteos", "huevos", "sulfitos"],
  },
  {
    id: 25,
    name: "Croissant con Nutella",
    description: "Incluye café y zumo natural",
    price: 3.60,
    category: "Desayunos",
    isVegetarian: true,
    rating: 4.5,
    allergens: ["gluten", "lacteos", "huevos", "frutos_cascara", "soja"],
  },

  // Desayunos - Tostadas
  {
    id: 26,
    name: "Tostada con Tomate, Aceite y Sal",
    description: "Incluye café y zumo natural",
    price: 3.90,
    category: "Desayunos",
    isVegetarian: true,
    rating: 4.5,
    allergens: ["gluten"],
  },
  {
    id: 27,
    name: "Tostada con Jamón York/Serrano, Tomate y Aceite",
    description: "Incluye café y zumo natural",
    price: 4.50,
    category: "Desayunos",
    rating: 4.6,
    allergens: ["gluten", "sulfitos"],
  },
  {
    id: 28,
    name: "Tostada con Aguacate, Tomate y Jamón York/Serrano",
    description: "Incluye café y zumo natural",
    price: 5.30,
    category: "Desayunos",
    rating: 4.8,
    allergens: ["gluten", "sulfitos"],
  },
  {
    id: 29,
    name: "Tostada con Tumaca",
    description: "Jamón serrano, tomate y orégano. Incluye café y zumo natural",
    price: 4.50,
    category: "Desayunos",
    rating: 4.7,
    allergens: ["gluten", "sulfitos"],
  },
  {
    id: 30,
    name: "Tostada con Burrata y Mermelada",
    description: "Incluye café y zumo natural",
    price: 5.50,
    category: "Desayunos",
    isVegetarian: true,
    rating: 4.8,
    allergens: ["gluten", "lacteos"],
  },

  // Desayunos - Pancakes
  {
    id: 31,
    name: "Pancakes con Sirope de Chocolate, Miel y Plátano",
    description: "Incluye café y zumo natural",
    price: 5.50,
    category: "Desayunos",
    isVegetarian: true,
    rating: 4.8,
    allergens: ["gluten", "lacteos", "huevos"],
  },
  {
    id: 32,
    name: "Napolitano",
    description: "Incluye café y zumo natural",
    price: 3.00,
    category: "Desayunos",
    isVegetarian: true,
    rating: 4.5,
    allergens: ["gluten", "lacteos"],
  },

  // Desayunos - Otros
  {
    id: 33,
    name: "Pincho de Tortilla",
    description: "Incluye café y zumo natural",
    price: 3.50,
    category: "Desayunos",
    isVegetarian: true,
    rating: 4.6,
    allergens: ["huevos", "lacteos"],
  },
  {
    id: 34,
    name: "Omelette (Indian Tortilla)",
    description: "Tortilla india con cebolla y cilantro. Incluye café y zumo natural",
    price: 4.00,
    category: "Desayunos",
    isVegetarian: true,
    rating: 4.7,
    allergens: ["huevos"],
  },
];

const categories = ["Todos", "Desayunos", "Embutidos y Quesos", "Fast Food", "Carne", "Del Mar y los ríos", "Arroz", "Guarniciones", "Postres"];

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
                    <div className="flex items-center space-x-3 mb-3">
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
                    {item.allergens && item.allergens.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {item.allergens.map((allergen) => {
                          const info = allergenInfo[allergen];
                          const Icon = info.icon;
                          return (
                            <Badge 
                              key={allergen} 
                              variant="secondary" 
                              className={`text-xs ${info.color} p-1`}
                              title={info.name}
                            >
                              <Icon className="h-3 w-3" />
                            </Badge>
                          );
                        })}
                      </div>
                    )}
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

        {/* Información de Alérgenos */}
        <div className="mt-16 p-6 bg-card rounded-lg border border-border">
          <h3 className="text-xl font-display font-semibold text-card-foreground mb-4">
            Información sobre Alérgenos
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Según la normativa europea (Reglamento UE 1169/2011), indicamos la presencia de los 14 alérgenos principales en nuestros platos. 
            Si tienes alguna alergia o intolerancia alimentaria, por favor consulta con nuestro personal antes de realizar tu pedido.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {Object.entries(allergenInfo).map(([key, info]) => {
              const Icon = info.icon;
              return (
                <div key={key} className="flex items-center space-x-2 text-xs">
                  <Badge variant="secondary" className={`${info.color} flex items-center space-x-1`}>
                    <Icon className="h-3 w-3" />
                    <span>{info.name}</span>
                  </Badge>
                </div>
              );
            })}
          </div>
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
