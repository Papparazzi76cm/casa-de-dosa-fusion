import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Star, Flame, Leaf, Wheat, Fish, Egg, Milk, Shell, Nut } from "lucide-react";
import platoJamonIberico from "@/assets/plato-jamon-iberico.png";
import platoEmbutidosIbericos from "@/assets/plato-embutidos-ibericos.png";

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
  // Tapas - Vegetal
  {
    id: 1001,
    name: "Patatas Bravas a Nuestro Estilo",
    description: "Con salsa especial",
    price: 6.50,
    category: "Tapas",
    isSpicy: true,
    isVegetarian: true,
    rating: 4.6,
    allergens: ["gluten"],
  },
  {
    id: 1002,
    name: "Masala Dosa",
    description: "Crepe salado de origen indio relleno de puré de patatas con salsa de verduras",
    price: 12.50,
    category: "Tapas",
    isVegetarian: true,
    rating: 4.8,
    allergens: ["gluten"],
  },
  {
    id: 1003,
    name: "Samosas Vegetales",
    description: "Triángulos crujientes rellenos de verduras especiadas (8 unidades)",
    price: 6.90,
    category: "Tapas",
    isVegetarian: true,
    rating: 4.6,
    allergens: ["gluten", "mostaza", "sesamo"],
  },
  // Tapas - Carne
  {
    id: 1004,
    name: "Lágrimas de Pollo con Salsa Miel y Mostaza",
    description: "Crujientes tiras de pollo acompañadas con salsa dulce de miel y mostaza",
    price: 7.20,
    category: "Tapas",
    rating: 4.7,
    allergens: ["gluten", "huevos", "mostaza"],
  },
  {
    id: 1005,
   name: "Gyoza de Ropa Vieja con Jugo Vegetal",
    description: "Gyoza con relleno de ropa vieja y jugo vegetal (4 unidades)",
    price: 9,
    category: "Entrantes",
    rating: 4.8,
    allergens: ["gluten", "soja", "huevos", "apio"],
  },
  {
    id: 1006,
    name: "Torrezno de Soria",
    description: "Tradicional torrezno crujiente, jugoso por dentro y dorado por fuera",
    price: 7,
    category: "Tapas",
    rating: 4.7,
    allergens: [],
  },
  {
    id: 1007,
    name: "Croquetas de Chorizo",
    description: "Cremosas croquetas artesanas con auténtico chorizo (6 unidades)",
    price: 5.90,
    category: "Tapas",
    rating: 4.6,
    allergens: ["gluten", "lacteos", "huevos"],
  },
  {
    id: 1008,
    name: "Croquetón de Pollo Mali",
    description: "Croqueta con receta especial de la casa (mínimo 2 unidades)",
    price: 3,
    category: "Tapas",
    rating: 4.8,
    allergens: ["gluten", "lacteos", "huevos"],
  },

  // Tapas - Del Mar
  {
    id: 1009,
    name: "Mini Burger de Atún Indio con Patatas Fritas",
    description: "Pequeña hamburguesa casera de atún con especias indias, acompañada de crujientes patatas fritas",
    price: 4.90,
    category: "Tapas",
    rating: 4.5,
    allergens: ["gluten", "huevos", "pescado", "mostaza", "sesamo"],
  },
  {
    id: 1010,
    name: "Rabas con Alioli",
    description: "Tiras de calamar rebozadas, fritas al estilo clásico y servidas con suave salsa alioli",
    price: 7.20,
    category: "Tapas",
    rating: 4.7,
    allergens: ["gluten", "moluscos", "huevos"],
  },
  {
    id: 1011,
    name: "Croquetas de Bacalao",
    description: "Deliciosas croquetas caseras de bacalao, doradas por fuera y cremosas por dentro (6 unidades)",
    price: 5.90,
    category: "Tapas",
    rating: 4.7,
    allergens: ["gluten", "lacteos", "huevos", "pescado"],
  },
  {
    id: 1012,
    name: "Albóndigas de Langostino con Salsa India con Pan",
    description: "Jugosas albóndigas elaboradas con langostino fresco, aromatizadas con especias indias, crujientes por fuera y tiernas por dentro",
    price: 8.50,
    category: "Tapas",
    rating: 4.8,
    allergens: ["crustaceos", "gluten", "huevos"],
  },

  // Embutidos y Quesos
  {
    id: 1,
    name: "Jamón Ibérico",
    description: "Jamón ibérico de bellota cortado a mano",
    price: 17,
    category: "Embutidos y Quesos",
    rating: 4.9,
    allergens: ["sulfitos"],
    image: platoJamonIberico,
  },
  {
    id: 2,
    name: "Selección de Ibéricos",
    description: "Salchichón / chorizo / lomo",
    price: 13,
    category: "Embutidos y Quesos",
    rating: 4.8,
    allergens: ["sulfitos"],
    image: platoEmbutidosIbericos,
  },
  {
    id: 3,
    name: "Selección de Quesos",
    description: "Tabla de quesos artesanales con mermeladas",
    price: 20,
    category: "Embutidos y Quesos",
    isVegetarian: true,
    rating: 4.7,
    allergens: ["lacteos"],
  },

  // Ensalada y Verduras
  {
    id: 4,
    name: "Burrata y Tartar de Pitahaya y Manzana",
    description: "Fresca combinación de burrata con pitahaya y manzana",
    price: 12,
    category: "Ensalada y Verduras",
    isVegetarian: true,
    rating: 4.8,
    allergens: ["lacteos"],
  },
  {
    id: 5,
    name: "Ensaladilla de Gamba con Mayonesa y Alioli",
    description: "Ensaladilla clásica con gambas frescas",
    price: 12,
    category: "Ensalada y Verduras",
    rating: 4.7,
    allergens: ["crustaceos", "huevos"],
  },
  {
    id: 6,
    name: "Crema de Batata",
    description: "Crema suave y reconfortante de batata",
    price: 8,
    category: "Ensalada y Verduras",
    isVegetarian: true,
    rating: 4.6,
    allergens: ["lacteos"],
  },

  // Entrantes
  {
    id: 7,
    name: "Hamburguesa de Vergara Beef con Yuca Frita",
    description: "Lechuga, tomate, cebolla caramelizada, huevos a la plancha, queso cheddar, mayonesa kewpie",
    price: 15,
    category: "Entrantes",
    rating: 4.8,
    allergens: ["gluten", "huevos", "lacteos", "mostaza", "sesamo"],
  },
  {
    id: 8,
    name: "Gyoza de Ropa Vieja con Jugo Vegetal",
    description: "Gyoza con relleno de ropa vieja y jugo vegetal (4 unidades)",
    price: 9,
    category: "Entrantes",
    rating: 4.8,
    allergens: ["gluten", "soja", "huevos", "apio"],
  },
  {
    id: 9,
    name: "Samosa de Verdura",
    description: "Samosas crujientes rellenas de verduras frescas (8 unidades)",
    price: 6.90,
    category: "Entrantes",
    isVegetarian: true,
    rating: 4.6,
    allergens: ["gluten", "mostaza", "sesamo"],
  },
  {
    id: 10,
    name: "Croqueta de Mango Kimchi - Media Ración",
    description: "Fusión única de sabores orientales y tropicales (4 unidades)",
    price: 4,
    category: "Entrantes",
    isVegetarian: true,
    rating: 4.7,
    allergens: ["gluten", "lacteos", "huevos", "soja", "pescado"],
  },
  {
    id: 11,
    name: "Croqueta de Mango Kimchi - Ración",
    description: "Fusión única de sabores orientales y tropicales (8 unidades)",
    price: 8,
    category: "Entrantes",
    isVegetarian: true,
    rating: 4.7,
    allergens: ["gluten", "lacteos", "huevos", "soja", "pescado"],
  },
  {
    id: 12,
    name: "Croquetón de Pollo Malai",
    description: "Croqueta con receta especial de la casa (mínimo 2 unidades)",
    price: 3,
    category: "Entrantes",
    rating: 4.8,
    allergens: ["gluten", "lacteos", "huevos"],
  },
  {
    id: 13,
    name: "Mini Burger",
    description: "Pequeña hamburguesa casera de atún con especial de India acompañada de crujientes patata fritas",
    price: 4.90,
    category: "Entrantes",
    rating: 4.5,
    allergens: ["gluten", "huevos", "pescado", "mostaza", "sesamo"],
  },
  {
    id: 14,
    name: "Patata Brava con Salsa Especial de Casa",
    description: "Patatas crujientes con nuestra salsa brava especial",
    price: 6.50,
    category: "Entrantes",
    isSpicy: true,
    isVegetarian: true,
    rating: 4.6,
    allergens: ["gluten", "huevos"],
  },
  {
    id: 15,
    name: "Torrezno de Soria",
    description: "Especialidad tradicional de Soria",
    price: 7,
    category: "Entrantes",
    rating: 4.7,
    allergens: ["gluten", "huevos", "lacteos"],
  },
  {
    id: 16,
    name: "Rabas con Alioli",
    description: "Calamares a la romana con alioli casero",
    price: 7.50,
    category: "Entrantes",
    rating: 4.7,
    allergens: ["gluten", "moluscos", "huevos"],
  },
  {
    id: 17,
    name: "Fingers de Pollo",
    description: "Tiras de pollo crujientes",
    price: 8,
    category: "Entrantes",
    rating: 4.6,
    allergens: ["gluten", "huevos"],
  },

  // Pescados
  {
    id: 18,
    name: "Tartar de Atún Rojo Sandía y Ponzu de Tomate",
    description: "Tartar de atún rojo fresco con sandía y ponzu de tomate",
    price: 15,
    category: "Pescados",
    rating: 4.8,
    allergens: ["pescado", "soja", "gluten", "sesamo"],
  },
  {
    id: 19,
    name: "Rodaballo con Puré de Coliflor y Salsa Ponzu",
    description: "Rodaballo fresco con puré cremoso de coliflor y salsa ponzu",
    price: 22,
    category: "Pescados",
    rating: 4.9,
    allergens: ["pescado", "lacteos", "soja"],
  },

  // Arroz
  {
    id: 20,
    name: "Arroz de Mariscos (2 personas)",
    description: "Arroz con pulpo, chipiron, langostino y mejillón",
    price: 25,
    category: "Arroz",
    rating: 4.8,
    allergens: ["crustaceos", "moluscos", "pescado", "apio"],
  },
  {
    id: 21,
    name: "Arroz de Mariscos (4 personas)",
    description: "Arroz con pulpo, chipiron, langostino y mejillón",
    price: 45,
    category: "Arroz",
    rating: 4.8,
    allergens: ["crustaceos", "moluscos", "pescado", "apio"],
  },

  // Carne
  {
    id: 22,
    name: "Entraña de Angus con Irish Champ con Salsa de Curry",
    description: "Entraña de Angus tierna con Irish champ y salsa de curry",
    price: 29,
    category: "Carne",
    rating: 4.9,
    allergens: ["lacteos", "apio"],
  },
  {
    id: 23,
    name: "Rulo de Lechazo Relleno de Duxelle y Jugo de Granada",
    description: "Rulo de lechazo relleno de champiñón y jugo de Granada",
    price: 20,
    category: "Carne",
    rating: 4.9,
    allergens: ["lacteos", "frutos_cascara", "sulfitos"],
  },

  // Guarniciones
  {
    id: 24,
    name: "Patata Frita",
    description: "Patatas fritas crujientes",
    price: 5,
    category: "Guarniciones",
    isVegetarian: true,
    rating: 4.5,
    allergens: [],
  },
  {
    id: 25,
    name: "Boniato Frito",
    description: "Boniato frito con toque dulce",
    price: 5,
    category: "Guarniciones",
    isVegetarian: true,
    rating: 4.6,
    allergens: [],
  },
  {
    id: 2501,
    name: "Pan",
    description: "Pan recién horneado",
    price: 1,
    category: "Guarniciones",
    isVegetarian: true,
    rating: 4.5,
    allergens: ["gluten"],
  },

  // Postres
  {
    id: 26,
    name: "Tarta de Queso con Helado de Café",
    description: "Tarta de queso cremosa acompañada de helado de café",
    price: 8,
    category: "Postres",
    isVegetarian: true,
    rating: 4.8,
    allergens: ["lacteos", "gluten", "huevos"],
  },
  {
    id: 27,
    name: "Torrija con Espuma de Coco y Helado Nocciola",
    description: "Torrija tradicional con espuma de coco y helado de avellana",
    price: 9,
    category: "Postres",
    isVegetarian: true,
    rating: 4.7,
    allergens: ["gluten", "lacteos", "huevos", "frutos_cascara"],
  },
  {
    id: 28,
    name: "Pannacotta de Lessy de Mango con Helado de Mango",
    description: "Pannacotta suave con chutney de mango y helado de mango",
    price: 10,
    category: "Postres",
    isVegetarian: true,
    rating: 4.7,
    allergens: ["lacteos"],
  },
  {
    id: 29,
    name: "Helado de Mango",
    description: "Helado cremoso de mango",
    price: 5,
    category: "Postres",
    isVegetarian: true,
    rating: 4.6,
    allergens: ["lacteos"],
  },
  {
    id: 30,
    name: "Helado de Café",
    description: "Helado cremoso de café",
    price: 5,
    category: "Postres",
    isVegetarian: true,
    rating: 4.6,
    allergens: ["lacteos"],
  },
  {
    id: 31,
    name: "Helado de Nutella",
    description: "Helado cremoso de Nutella",
    price: 5,
    category: "Postres",
    isVegetarian: true,
    rating: 4.6,
    allergens: ["lacteos", "frutos_cascara", "soja"],
  },

  // Desayunos - Croissant
  {
    id: 32,
    name: "Croissant con Mermelada y Mantequilla",
    description: "Incluye café y zumo natural",
    price: 3.50,
    category: "Desayunos",
    isVegetarian: true,
    rating: 4.6,
    allergens: ["gluten", "lacteos", "huevos"],
  },
  {
    id: 33,
    name: "Croissant con Bacon y Queso",
    description: "Incluye café y zumo natural",
    price: 4.50,
    category: "Desayunos",
    rating: 4.7,
    allergens: ["gluten", "lacteos", "huevos", "sulfitos"],
  },
  {
    id: 34,
    name: "Croissant con Jamón York/Serrano y Queso",
    description: "Incluye café y zumo natural",
    price: 4.50,
    category: "Desayunos",
    rating: 4.7,
    allergens: ["gluten", "lacteos", "huevos", "sulfitos"],
  },
  {
    id: 35,
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
    id: 36,
    name: "Tostada con Tomate, Aceite y Sal",
    description: "Incluye café y zumo natural",
    price: 3.90,
    category: "Desayunos",
    isVegetarian: true,
    rating: 4.5,
    allergens: ["gluten"],
  },
  {
    id: 37,
    name: "Tostada con Jamón York/Serrano, Tomate y Aceite",
    description: "Incluye café y zumo natural",
    price: 4.50,
    category: "Desayunos",
    rating: 4.6,
    allergens: ["gluten", "sulfitos"],
  },
  {
    id: 38,
    name: "Tostada con Aguacate, Tomate y Jamón York/Serrano",
    description: "Incluye café y zumo natural",
    price: 5.30,
    category: "Desayunos",
    rating: 4.8,
    allergens: ["gluten", "sulfitos"],
  },
  {
    id: 39,
    name: "Tostada con Tumaca",
    description: "Jamón serrano, tomate y orégano. Incluye café y zumo natural",
    price: 4.50,
    category: "Desayunos",
    rating: 4.7,
    allergens: ["gluten", "sulfitos"],
  },
  {
    id: 40,
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
    id: 41,
    name: "Pancakes con Sirope de Chocolate, Miel y Plátano",
    description: "Incluye café y zumo natural",
    price: 5.50,
    category: "Desayunos",
    isVegetarian: true,
    rating: 4.8,
    allergens: ["gluten", "lacteos", "huevos"],
  },
  // Desayunos - Otros
  {
    id: 42,
    name: "Pincho de Tortilla",
    description: "Incluye café y zumo natural",
    price: 3.50,
    category: "Desayunos",
    isVegetarian: true,
    rating: 4.6,
    allergens: ["huevos", "lacteos"],
  },
  {
    id: 43,
    name: "Omelette (Indian Tortilla)",
    description: "Tortilla india con cebolla y cilantro. Incluye café y zumo natural",
    price: 4.00,
    category: "Desayunos",
    isVegetarian: true,
    rating: 4.7,
    allergens: ["huevos"],
  },
];

const categories = ["Todos", "Tapas", "Desayunos", "Embutidos y Quesos", "Ensalada y Verduras", "Entrantes", "Pescados", "Arroz", "Carne", "Guarniciones", "Postres"];

const Menu = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  const filteredItems = selectedCategory === "Todos" 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    // Scroll al principio de la sección de items del menú
    setTimeout(() => {
      const menuItemsSection = document.getElementById('menu-items-section');
      if (menuItemsSection) {
        const yOffset = -100; // Offset para el navbar fijo
        const y = menuItemsSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }, 100);
  };

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
              onClick={() => handleCategoryChange(category)}
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
        <div id="menu-items-section" className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredItems.map((item) => (
            <Card 
              key={item.id} 
              className="shadow-elegant hover:shadow-golden transition-all duration-300 cursor-pointer"
              onClick={() => setSelectedItem(item)}
            >
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
          <Button 
            size="lg" 
            className="bg-golden hover:bg-golden-dark text-blue-grey-dark font-semibold"
            onClick={() => navigate('/reservas')}
          >
            Reservar Mesa Ahora
          </Button>
        </div>

        {/* Dialog para detalles del plato */}
        <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            {selectedItem && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
                    {selectedItem.name}
                    <span className="text-3xl font-bold text-golden ml-auto">
                      {selectedItem.price}€
                    </span>
                  </DialogTitle>
                </DialogHeader>
                
                <div className="space-y-6">
                  {/* Imagen del plato */}
                  <div className="w-full h-64 bg-muted rounded-lg overflow-hidden">
                    {selectedItem.image ? (
                      <img 
                        src={selectedItem.image} 
                        alt={selectedItem.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <span className="text-6xl">🍽️</span>
                      </div>
                    )}
                  </div>

                  {/* Badges de características */}
                  <div className="flex flex-wrap gap-2">
                    {selectedItem.isSpicy && (
                      <Badge variant="secondary" className="bg-red-100 text-red-700">
                        <Flame className="h-4 w-4 mr-1" />
                        Picante
                      </Badge>
                    )}
                    {selectedItem.isVegetarian && (
                      <Badge variant="secondary" className="bg-green-100 text-green-700">
                        <Leaf className="h-4 w-4 mr-1" />
                        Vegetariano
                      </Badge>
                    )}
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                      <Star className="h-4 w-4 mr-1 fill-golden text-golden" />
                      {selectedItem.rating}
                    </Badge>
                    <Badge variant="outline">
                      {selectedItem.category}
                    </Badge>
                  </div>

                  {/* Descripción */}
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Descripción</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {selectedItem.description}
                    </p>
                  </div>

                  {/* Alérgenos */}
                  {selectedItem.allergens && selectedItem.allergens.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-3">Alérgenos</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {selectedItem.allergens.map((allergen) => {
                          const info = allergenInfo[allergen];
                          const Icon = info.icon;
                          return (
                            <Badge 
                              key={allergen} 
                              variant="secondary" 
                              className={`${info.color} p-2 justify-start`}
                            >
                              <Icon className="h-4 w-4 mr-2" />
                              <span>{info.name}</span>
                            </Badge>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Menu;
