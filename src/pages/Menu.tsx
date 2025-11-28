import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Star, Flame, Leaf, Wheat, Fish, Egg, Milk, Shell, Nut, X, Info } from "lucide-react";
import platoJamonIberico from "@/assets/plato-jamon-iberico.png";
import platoEmbutidosIbericos from "@/assets/plato-embutidos-ibericos.png";
import tartarAtun from "@/assets/menu/tartar-atun.jpg";
import masalaDosa from "@/assets/menu/masala-dosa.jpg";
import gyozaRopaVieja from "@/assets/menu/gyoza-ropa-vieja.jpg";
import rodaballo from "@/assets/menu/rodaballo.jpg";
import entraña from "@/assets/menu/entraña-angus.jpg";
import arrozMariscos from "@/assets/menu/arroz-mariscos.jpg";
import burrata from "@/assets/menu/burrata.jpg";
import croquetaMangoKimchi from "@/assets/menu/croquetas-kimchi-mango.jpg";
import pannacotta from "@/assets/menu/pannacotta.png";
import torrija from "@/assets/menu/torrija.png";
import cremaBatata from "@/assets/menu/crema-batata.png";
import ensaladilla from "@/assets/menu/ensaladilla.jpg";
import torreznoSoria from "@/assets/menu/torrezno-soria.png";
import ruloLechazo from "@/assets/menu/rulo-lechazo.png";
import seleccionQuesos from "@/assets/menu/seleccion-quesos.png";
import hamburguesa from "@/assets/menu/hamburguesa.png";
import miniBurguer from "@/assets/menu/mini-burguer.jpeg";
import samosasVegetales from "@/assets/menu/samosas-vegetales.png";
import rabas from "@/assets/menu/rabas.jpg";
import albondigas from "@/assets/menu/albondigas.jpg";
import tartaQueso from "@/assets/menu/tarta-queso.jpg";

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

const allergenInfo: Record<Allergen, { name: string; icon: any; color: string; description: string }> = {
  gluten: { 
    name: "Gluten", 
    icon: Wheat, 
    color: "bg-amber-100 text-amber-700",
    description: "Presente en cereales como trigo, centeno, cebada y avena. Se encuentra en pan, pasta, bollería y productos rebozados."
  },
  crustaceos: { 
    name: "Crustáceos", 
    icon: Shell, 
    color: "bg-orange-100 text-orange-700",
    description: "Incluye cangrejos, langostas, gambas, langostinos y similares. También productos derivados y caldos."
  },
  huevos: { 
    name: "Huevos", 
    icon: Egg, 
    color: "bg-yellow-100 text-yellow-700",
    description: "Huevos de gallina y productos que los contengan como mayonesa, alioli, rebozados y repostería."
  },
  pescado: { 
    name: "Pescado", 
    icon: Fish, 
    color: "bg-blue-100 text-blue-700",
    description: "Todo tipo de pescado y productos derivados. Incluye gelatinas y salsas a base de pescado."
  },
  lacteos: { 
    name: "Lácteos", 
    icon: Milk, 
    color: "bg-indigo-100 text-indigo-700",
    description: "Leche y productos lácteos: quesos, mantequilla, nata, yogur y derivados lácteos."
  },
  frutos_cascara: { 
    name: "Frutos de cáscara", 
    icon: Nut, 
    color: "bg-brown-100 text-brown-700",
    description: "Almendras, avellanas, nueces, anacardos, pistachos, nueces de Brasil, macadamia y productos que los contengan."
  },
  soja: { 
    name: "Soja", 
    icon: Leaf, 
    color: "bg-lime-100 text-lime-700",
    description: "Habas de soja y productos derivados como salsa de soja, tofu, tempeh y aceite de soja."
  },
  apio: { 
    name: "Apio", 
    icon: Leaf, 
    color: "bg-green-100 text-green-700",
    description: "Apio en rama, hojas, semillas y productos que lo contengan. Común en caldos, sopas y salsas."
  },
  mostaza: { 
    name: "Mostaza", 
    icon: Flame, 
    color: "bg-yellow-200 text-yellow-800",
    description: "Semillas de mostaza y productos derivados como salsas y aderezos que la contengan."
  },
  sesamo: { 
    name: "Sésamo", 
    icon: Wheat, 
    color: "bg-stone-100 text-stone-700",
    description: "Semillas de sésamo enteras o en pasta (tahini), presentes en panes, ensaladas y salsas asiáticas."
  },
  sulfitos: { 
    name: "Sulfitos", 
    icon: Star, 
    color: "bg-purple-100 text-purple-700",
    description: "Conservantes usados en vinos, cervezas, frutas deshidratadas, embutidos y conservas."
  },
  moluscos: { 
    name: "Moluscos", 
    icon: Shell, 
    color: "bg-pink-100 text-pink-700",
    description: "Caracoles, almejas, mejillones, ostras, calamares, pulpo, sepia y similares."
  },
};

const menuItems: MenuItem[] = [
  // Tapas
  {
    id: 1001,
    name: "Hamburguesa de Vergara Beef con Yuca Frita",
    description: "Con pan rojo, huevo a la plancha, lechuga, tomate, cebolla caramelizada",
    price: 15,
    category: "Tapas",
    rating: 4.8,
    image: hamburguesa,
    allergens: ["gluten"],
  },
  {
    id: 1002,
    name: "Gyoza de Ropa Vieja con Jugo Vegetal",
    description: "Rellenas de ropa vieja melosa (pollo, ternera, cordero, cerdo) fusionando con un toque asiático en cada bocado (4 unidades)",
    price: 9,
    category: "Tapas",
    rating: 4.8,
    image: gyozaRopaVieja,
    allergens: ["gluten", "soja", "huevos"],
  },
  {
    id: 1003,
    name: "Samosa de Verdura",
    description: "Crujiente masa rellena de verduras salteadas con especias suaves, aromático y lleno de frescura (8 unidades)",
    price: 7,
    category: "Tapas",
    isVegetarian: true,
    rating: 4.6,
    image: samosasVegetales,
    allergens: ["gluten"],
  },
  {
    id: 1004,
    name: "Croqueta de Mango Kimchi - Media Ración",
    description: "Bocado crujiente con relleno cremoso de mango y kimchi, dulce y ligeramente picante (4 unidades)",
    price: 5,
    category: "Tapas",
    isVegetarian: true,
    rating: 4.7,
    image: croquetaMangoKimchi,
    allergens: ["gluten", "huevos", "lacteos"],
  },
  {
    id: 1005,
    name: "Croqueta de Mango Kimchi - Ración",
    description: "Bocado crujiente con relleno cremoso de mango y kimchi, dulce y ligeramente picante (8 unidades)",
    price: 8,
    category: "Tapas",
    isVegetarian: true,
    rating: 4.7,
    image: croquetaMangoKimchi,
    allergens: ["gluten", "huevos", "lacteos"],
  },
  {
    id: 1006,
    name: "Masala Dosa",
    description: "Crepe crujiente de arroz y lentejas, rellena de patata especiada al estilo masala, servida con sambar aromático",
    price: 12.50,
    category: "Tapas",
    isVegetarian: true,
    rating: 4.8,
    image: masalaDosa,
    allergens: ["lacteos"],
  },
  {
    id: 1007,
    name: "Ensaladilla de Langostinos",
    description: "Mezcla cremosa de patata y verduras, con langostinos jugosos, ligada con alioli",
    price: 12,
    category: "Tapas",
    rating: 4.7,
    image: ensaladilla,
    allergens: ["huevos", "crustaceos"],
  },
  {
    id: 1008,
    name: "Croquetas de Bacalao",
    description: "Deliciosas croquetas caseras de bacalao, doradas por fuera y cremosas por dentro (6 unidades)",
    price: 5.90,
    category: "Tapas",
    rating: 4.7,
    allergens: ["gluten", "lacteos", "pescado", "huevos"],
  },
  {
    id: 1009,
    name: "Mini Burger de Atún con Patatas Fritas",
    description: "Medallón de atún marinado y marcado a la plancha, servido en pan tierno con guarnición de patatas fritas crujientes",
    price: 4.90,
    category: "Tapas",
    rating: 4.5,
    image: miniBurguer,
    allergens: ["gluten", "gluten", "huevos", "pescado"],
  },
  {
    id: 1010,
    name: "Croquetón de Pollo Malai",
    description: "Grande, cremoso y muy jugoso, elaborado con pollo marinado en especias suaves y nata (2 unidades)",
    price: 3,
    category: "Tapas",
    rating: 4.8,
    allergens: ["gluten", "huevos", "lacteos"],
  },
  {
    id: 1011,
    name: "Albóndigas de Langostino con Salsa de Coco",
    description: "Bocados tiernos de langostino en salsa cremosa de coco con un toque aromático (5 unidades)",
    price: 8.50,
    category: "Tapas",
    rating: 4.8,
    image: albondigas,
    allergens: ["crustaceos"],
  },
  {
    id: 1012,
    name: "Torrezno de Soria",
    description: "Tradicional torrezno crujiente, jugoso por dentro y dorado por fuera",
    price: 7,
    category: "Tapas",
    rating: 4.7,
    image: torreznoSoria,
    allergens: [],
  },
  {
    id: 1013,
    name: "Fingers de Pollo con Salsa de Miel y Mostaza",
    description: "Crujientes tiras de pollo marinadas y rebozadas, acompañadas de una suave y aromática salsa de miel y mostaza",
    price: 7.20,
    category: "Tapas",
    rating: 4.7,
    allergens: ["gluten", "huevos"],
  },
  {
    id: 1014,
    name: "Rabas con Alioli",
    description: "Tiras de calamar rebozadas, fritas al estilo clásico y servidas con suave salsa alioli",
    price: 7.50,
    category: "Tapas",
    rating: 4.7,
    image: rabas,
    allergens: ["gluten", "crustaceos", "huevos"],
  },
  {
    id: 1015,
    name: "Patata Brava con Salsa Especial de Casa",
    description: "Patatas fritas crujientes con salsa especial picante de la casa",
    price: 6.50,
    category: "Tapas",
    isVegetarian: true,
    rating: 4.6,
    allergens: ["huevos"],
  },
  {
    id: 1016,
    name: "Zamburiñas con Leche de Coco y Anacardo",
    description: "Delicadas zamburiñas bañadas en salsa cremosa de leche de coco, acompañadas de anacardos tostados (4 unidades)",
    price: 8,
    category: "Tapas",
    rating: 4.8,
    allergens: [],
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
    image: seleccionQuesos,
    allergens: ["lacteos"],
  },

  // Ensalada y Verduras
  {
    id: 4,
    name: "Burrata y Tartar de Pitahaya y Manzana",
    description: "Cremosa burrata servida sobre un fresco tartar de pitahaya y manzana, con un toque cítrico de notas suaves y afrutadas que realzan su textura sedosa",
    price: 12,
    category: "Ensalada y Verduras",
    isVegetarian: true,
    rating: 4.8,
    image: burrata,
    allergens: ["lacteos", "gluten"],
  },
  {
    id: 5,
    name: "Ensaladilla de Langostinos con Mayonesa y Alioli",
    description: "Mezcla cremosa de patata y verduras, con langostinos jugosos, ligada con alioli",
    price: 12,
    category: "Ensalada y Verduras",
    rating: 4.7,
    image: ensaladilla,
    allergens: ["crustaceos", "huevos"],
  },
  {
    id: 6,
    name: "Crema de Batata",
    description: "Crema suave de batata, sedosa y ligeramente dulce, elaborada con especias suaves y un toque de mantequilla para un final reconfortante",
    price: 8,
    category: "Ensalada y Verduras",
    isVegetarian: true,
    rating: 4.6,
    image: cremaBatata,
    allergens: ["lacteos"],
  },

  // Selección de Dosas
  {
    id: 50,
    name: "Masala Dosa",
    description: "Crepe crujiente de arroz y lentejas rellena de puré de patatas especiado al estilo del sur de India, acompañada de salsa tradicionales de verduras",
    price: 12.50,
    category: "Selección de Dosas",
    isVegetarian: true,
    rating: 4.8,
    image: masalaDosa,
    allergens: ["gluten"],
  },
  {
    id: 51,
    name: "Egg Dosa",
    description: "Fina y crujiente crepe de arroz y lentejas, rellena de huevo especiado, servida caliente y dorada",
    price: 13.50,
    category: "Selección de Dosas",
    rating: 4.7,
    allergens: ["gluten", "huevos"],
  },
  {
    id: 52,
    name: "Cheese Dosa",
    description: "Dosa crujiente rellena con una mezcla cremosa de quesos, fundida perfecta para un bocado reconfortante",
    price: 15.50,
    category: "Selección de Dosas",
    isVegetarian: true,
    rating: 4.8,
    allergens: ["gluten", "lacteos"],
  },
  {
    id: 53,
    name: "Nuttella Dosa",
    description: "Dosa fina y crujiente rellena de Nutella fundida, creando un bocado goloso y irresistible",
    price: 11.00,
    category: "Selección de Dosas",
    isVegetarian: true,
    rating: 4.7,
    allergens: ["gluten", "lacteos", "frutos_cascara", "soja"],
  },
  {
    id: 54,
    name: "Ghee Rost",
    description: "Dosa crujiente dorada en ghee, con aroma intenso y sabor profundo, ligera y deliciosa en cada bocado",
    price: 13.50,
    category: "Selección de Dosas",
    isVegetarian: true,
    rating: 4.8,
    allergens: ["gluten", "lacteos"],
  },
  {
    id: 55,
    name: "Uttapam Dosa",
    description: "Uttapam esponjoso y grueso, coronado con verduras frescas salteadas que aportan color, textura, sabor suave y reconfortante",
    price: 10.50,
    category: "Selección de Dosas",
    isVegetarian: true,
    rating: 4.7,
    allergens: ["gluten"],
  },

  // Entrantes
  {
    id: 8,
    name: "Gyoza de Ropa Vieja con Jugo Vegetal",
    description: "Rellenas de ropa vieja melosа(pollo,ternera,cordero,cerdo) fusionando con un toque asiático en cada bocado (4 unidades)",
    price: 9,
    category: "Entrantes",
    rating: 4.8,
    image: gyozaRopaVieja,
    allergens: ["gluten", "soja", "huevos", "apio"],
  },
  {
    id: 10,
    name: "Croqueta de Mango Kimchi - Media Ración",
    description: "Bocado crujiente con relleno cremoso de mango y kimchi, dulce y ligeramente picante (4 unidades)",
    price: 5,
    category: "Entrantes",
    isVegetarian: true,
    rating: 4.7,
    image: croquetaMangoKimchi,
    allergens: ["gluten", "lacteos", "huevos", "soja", "pescado"],
  },
  {
    id: 11,
    name: "Croqueta de Mango Kimchi - Ración",
    description: "Bocado crujiente con relleno cremoso de mango y kimchi, dulce y ligeramente picante (8 unidades)",
    price: 8,
    category: "Entrantes",
    isVegetarian: true,
    rating: 4.7,
    image: croquetaMangoKimchi,
    allergens: ["gluten", "lacteos", "huevos", "soja", "pescado"],
  },
  {
    id: 14,
    name: "Albóndigas de Langostino con Salsa de Coco",
    description: "Bocados tiernos de langostino en salsa cremosa de coco con un toque aromático",
    price: 8.50,
    category: "Entrantes",
    rating: 4.8,
    image: albondigas,
    allergens: ["crustaceos", "gluten", "huevos"],
  },
  {
    id: 12,
    name: "Croquetón de Pollo Malai",
    description: "Grande, cremoso y muy jugoso, elaborado con pollo marinado en especias suaves y nata (2 unidades)",
    price: 3,
    category: "Entrantes",
    rating: 4.8,
    allergens: ["gluten", "lacteos", "huevos"],
  },
  {
    id: 16,
    name: "Zamburiñas con Leche de Coco y Anacardo",
    description: "Delicadas zamburiñas bañadas en salsa cremosa leche de coco, acompañadas de anacardos tostados (4 unidades)",
    price: 8,
    category: "Entrantes",
    rating: 4.8,
    allergens: ["moluscos", "frutos_cascara"],
  },
  {
    id: 17,
    name: "Fingers de Pollo / Lágrimas de Pollo Con Miel y Mostaza",
    description: "Crujientes tiras de pollo marinadas y rebozadas, acompañadas de una suave y aromática salsa de miel y mostaza que equilibra dulce y umami",
    price: 7.20,
    category: "Entrantes",
    rating: 4.7,
    allergens: ["gluten", "huevos", "mostaza"],
  },

  // Pescados
  {
    id: 18,
    name: "Tartar de Atún Rojo Sandía y Ponzu de Tomate",
    description: "Cortes precisos de atún rojo fresco, servido con sandía y ponzu de tomate, equilibrando dulzor, acidez y umami en un bocado ligero y elegante",
    price: 15,
    category: "Pescados",
    rating: 4.8,
    image: tartarAtun,
    allergens: ["pescado", "frutos_cascara", "gluten"],
  },
  {
    id: 19,
    name: "Rodaballo con Puré de Coliflor y Salsa Ponzu",
    description: "Rodaballo fresco, jugoso y delicado, acompañado de un puré cremoso de coliflor y una salsa ponzu que aporta frescura y equilibrio",
    price: 22,
    category: "Pescados",
    rating: 4.9,
    image: rodaballo,
    allergens: ["pescado", "frutos_cascara", "gluten"],
  },

  // Arroz
  {
    id: 20,
    name: "Arroz de Mariscos (Por 2 personas)",
    description: "Arroz meloso de mariscos con pulpo tierno, chipiones, langostinos y mejillones, lleno de sabor marino y aroma a sofrito tradicional",
    price: 25,
    category: "Arroz",
    rating: 4.8,
    image: arrozMariscos,
    allergens: ["crustaceos", "moluscos", "pescado", "apio"],
  },
  {
    id: 21,
    name: "Arroz de Mariscos (Por 4 personas)",
    description: "Arroz meloso de mariscos con pulpo tierno, chipiones, langostinos y mejillones, lleno de sabor marino y aroma a sofrito tradicional",
    price: 45,
    category: "Arroz",
    rating: 4.8,
    image: arrozMariscos,
    allergens: ["crustaceos", "moluscos", "pescado", "apio"],
  },

  // Carne
  {
    id: 22,
    name: "Entraña de Angus con Irish Champ con Salsa de Curry",
    description: "Entraña de Angus, tiernamente sellada, servida sobre un Irish Champ cremoso de patata y cebolla, acompañada de una delicada salsa de curry que realza los sabores sin opacar la ternura de la carne",
    price: 29,
    category: "Carne",
    rating: 4.9,
    image: entraña,
    allergens: ["lacteos", "gluten"],
  },
  {
    id: 23,
    name: "Rulo de Lechazo Relleno de Duxelle y Jugo de Granada",
    description: "Rulo de lechazo tierno relleno de duxelle de champiñones, acompañado de un delicioso jugo de granada que aporta frescura y un toque afrutado al plato",
    price: 20,
    category: "Carne",
    rating: 4.9,
    image: ruloLechazo,
    allergens: ["lacteos", "frutos_cascara"],
  },
  {
    id: 60,
    name: "Hamburguesa de Vergara Beef con Yuca Frita",
    description: "Hamburguesa de Vergara Beef, jugosa y sabrosa, acompañada de crujientes y doradas yucas fritas",
    price: 15,
    category: "Carne",
    rating: 4.8,
    allergens: ["lacteos"],
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
    image: tartaQueso,
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
    image: torrija,
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
    image: pannacotta,
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

const barraCategories = ["Todos", "Tapas", "Desayunos"];
const comedorCategories = ["Todos", "Embutidos y Quesos", "Ensalada y Verduras", "Selección de Dosas", "Entrantes", "Pescados", "Arroz", "Carne", "Guarniciones", "Postres"];

const ALLERGEN_PREFERENCES_KEY = 'casa-dosa-allergen-preferences';

const Menu = () => {
  const navigate = useNavigate();
  const [selectedSection, setSelectedSection] = useState<"barra" | "comedor" | "menu-dia" | "menu-fin-semana" | "menu-navidad">("barra");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [excludedAllergens, setExcludedAllergens] = useState<Allergen[]>(() => {
    // Load preferences from localStorage on initial render
    try {
      const saved = localStorage.getItem(ALLERGEN_PREFERENCES_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading allergen preferences:', error);
      return [];
    }
  });

  const getFilteredItems = () => {
    // Don't return items if no category is selected
    if (!selectedCategory) {
      return [];
    }

    const sectionCategories = selectedSection === "barra" 
      ? ["Tapas", "Desayunos"]
      : ["Embutidos y Quesos", "Ensalada y Verduras", "Selección de Dosas", "Entrantes", "Pescados", "Arroz", "Carne", "Guarniciones", "Postres"];
    
    let items = menuItems.filter(item => sectionCategories.includes(item.category));
    
    if (selectedCategory !== "Todos") {
      items = items.filter(item => item.category === selectedCategory);
    }
    
    // Filter by allergens: exclude items that contain any of the excluded allergens
    if (excludedAllergens.length > 0) {
      items = items.filter(item => 
        !item.allergens?.some(allergen => excludedAllergens.includes(allergen))
      );
    }
    
    return items;
  };

  const getTotalItemsForSection = () => {
    const sectionCategories = selectedSection === "barra" 
      ? ["Tapas", "Desayunos"]
      : ["Embutidos y Quesos", "Ensalada y Verduras", "Selección de Dosas", "Entrantes", "Pescados", "Arroz", "Carne", "Guarniciones", "Postres"];
    
    let items = menuItems.filter(item => sectionCategories.includes(item.category));
    
    // Filter by allergens: exclude items that contain any of the excluded allergens
    if (excludedAllergens.length > 0) {
      items = items.filter(item => 
        !item.allergens?.some(allergen => excludedAllergens.includes(allergen))
      );
    }
    
    return items.length;
  };

  const filteredItems = getFilteredItems();

  const handleSectionChange = (section: "barra" | "comedor" | "menu-dia" | "menu-fin-semana" | "menu-navidad") => {
    setSelectedSection(section);
    setSelectedCategory(null);
    scrollToMenu();
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    if (category !== selectedCategory) {
      scrollToMenu();
    }
  };

  const scrollToMenu = () => {
    setTimeout(() => {
      const menuItemsSection = document.getElementById('menu-items-section');
      if (menuItemsSection) {
        const yOffset = -100;
        const y = menuItemsSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }, 100);
  };

  const toggleAllergen = (allergen: Allergen) => {
    setExcludedAllergens(prev => 
      prev.includes(allergen) 
        ? prev.filter(a => a !== allergen)
        : [...prev, allergen]
    );
  };

  const clearAllFilters = () => {
    setExcludedAllergens([]);
  };

  // Save allergen preferences to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(ALLERGEN_PREFERENCES_KEY, JSON.stringify(excludedAllergens));
    } catch (error) {
      console.error('Error saving allergen preferences:', error);
    }
  }, [excludedAllergens]);

  // Check if weekend menu should be visible (after January 7, 2026)
  const isWeekendMenuVisible = () => {
    const targetDate = new Date('2026-01-07');
    const currentDate = new Date();
    return currentDate >= targetDate;
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

        {/* Tabs de sección principal */}
        <Tabs value={selectedSection} onValueChange={(value) => handleSectionChange(value as "barra" | "comedor" | "menu-dia" | "menu-fin-semana" | "menu-navidad")} className="mb-8">
          <TabsList className={`flex flex-col md:grid w-full max-w-5xl mx-auto gap-2 md:gap-0 mb-8 h-auto md:h-auto bg-transparent md:bg-muted p-0 md:p-1 ${isWeekendMenuVisible() ? 'md:grid-cols-5' : 'md:grid-cols-4'}`}>
            <TabsTrigger value="barra" className="text-base md:text-lg w-full py-3 data-[state=active]:bg-gradient-golden">Barra</TabsTrigger>
            <TabsTrigger value="comedor" className="text-base md:text-lg w-full py-3 data-[state=active]:bg-gradient-golden">Comedor</TabsTrigger>
            <TabsTrigger value="menu-dia" className="text-base md:text-lg w-full py-3 data-[state=active]:bg-gradient-golden">Menú del Día</TabsTrigger>
            {isWeekendMenuVisible() && (
              <TabsTrigger value="menu-fin-semana" className="text-base md:text-lg w-full py-3 data-[state=active]:bg-gradient-golden">Menú de fin de Semana</TabsTrigger>
            )}
            <TabsTrigger value="menu-navidad" className="text-base md:text-lg w-full py-3 data-[state=active]:bg-gradient-golden">Menú de Navidad</TabsTrigger>
          </TabsList>

          <TabsContent value="barra">
            {/* Allergen Filters */}
            <div className="mb-8 p-6 bg-card rounded-lg border border-border">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-display font-semibold text-card-foreground">
                      Filtrar por Alérgenos
                    </h3>
                    <Badge variant="secondary" className="bg-golden/10 text-golden border-golden/20">
                      {selectedCategory ? (
                        <>{filteredItems.length} {filteredItems.length === 1 ? 'plato disponible' : 'platos disponibles'}</>
                      ) : (
                        <>{getTotalItemsForSection()} {getTotalItemsForSection() === 1 ? 'plato disponible' : 'platos disponibles'}</>
                      )}
                    </Badge>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button className="text-muted-foreground hover:text-foreground transition-colors">
                            <Info className="h-4 w-4" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p className="text-sm">
                            Pasa el cursor sobre cada alérgeno para ver información detallada. Los alérgenos seleccionados se excluirán de los resultados y se guardarán automáticamente para futuras visitas.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  {excludedAllergens.length > 0 && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={clearAllFilters}
                      className="text-golden hover:text-golden-dark"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Limpiar filtros
                    </Button>
                  )}
                </div>
                
                {selectedCategory && excludedAllergens.length > 0 && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/20 rounded-md border border-red-200 dark:border-red-900/30">
                    <span className="text-sm font-medium text-red-700 dark:text-red-300 whitespace-nowrap">
                      Evitando:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {excludedAllergens.map((allergen) => {
                        const info = allergenInfo[allergen];
                        const Icon = info.icon;
                        return (
                          <Badge
                            key={allergen}
                            variant="secondary"
                            className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-300 dark:border-red-800 flex items-center gap-1.5"
                          >
                            <Icon className="h-3.5 w-3.5" />
                            {info.name}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Selecciona los alérgenos que deseas evitar. Tus preferencias se guardarán automáticamente para futuras visitas.
              </p>
              <TooltipProvider>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(allergenInfo).map(([key, info]) => {
                    const Icon = info.icon;
                    const isSelected = excludedAllergens.includes(key as Allergen);
                    return (
                      <Tooltip key={key}>
                        <TooltipTrigger asChild>
                          <Button
                            variant={isSelected ? "default" : "outline"}
                            size="sm"
                            onClick={() => toggleAllergen(key as Allergen)}
                            className={isSelected 
                              ? "bg-red-500 hover:bg-red-600 text-white" 
                              : "border-border hover:bg-muted"
                            }
                          >
                            <Icon className="h-4 w-4 mr-2" />
                            {info.name}
                            {isSelected && <X className="h-3 w-3 ml-2" />}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p className="text-sm font-semibold mb-1">{info.name}</p>
                          <p className="text-xs text-muted-foreground">{info.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </div>
              </TooltipProvider>
              {selectedCategory && excludedAllergens.length > 0 && (
                <p className="text-sm text-muted-foreground mt-4">
                  Mostrando platos sin: <span className="font-semibold text-foreground">
                    {excludedAllergens.map(a => allergenInfo[a].name).join(', ')}
                  </span>
                </p>
              )}
            </div>

            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {barraCategories.map((category) => (
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
          </TabsContent>

          <TabsContent value="comedor">
            {/* Allergen Filters */}
            <div className="mb-8 p-6 bg-card rounded-lg border border-border">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-display font-semibold text-card-foreground">
                      Filtrar por Alérgenos
                    </h3>
                    <Badge variant="secondary" className="bg-golden/10 text-golden border-golden/20">
                      {selectedCategory ? (
                        <>{filteredItems.length} {filteredItems.length === 1 ? 'plato disponible' : 'platos disponibles'}</>
                      ) : (
                        <>{getTotalItemsForSection()} {getTotalItemsForSection() === 1 ? 'plato disponible' : 'platos disponibles'}</>
                      )}
                    </Badge>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button className="text-muted-foreground hover:text-foreground transition-colors">
                            <Info className="h-4 w-4" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p className="text-sm">
                            Pasa el cursor sobre cada alérgeno para ver información detallada. Los alérgenos seleccionados se excluirán de los resultados y se guardarán automáticamente para futuras visitas.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  {excludedAllergens.length > 0 && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={clearAllFilters}
                      className="text-golden hover:text-golden-dark"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Limpiar filtros
                    </Button>
                  )}
                </div>
                
                {selectedCategory && excludedAllergens.length > 0 && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/20 rounded-md border border-red-200 dark:border-red-900/30">
                    <span className="text-sm font-medium text-red-700 dark:text-red-300 whitespace-nowrap">
                      Evitando:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {excludedAllergens.map((allergen) => {
                        const info = allergenInfo[allergen];
                        const Icon = info.icon;
                        return (
                          <Badge
                            key={allergen}
                            variant="secondary"
                            className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-300 dark:border-red-800 flex items-center gap-1.5"
                          >
                            <Icon className="h-3.5 w-3.5" />
                            {info.name}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Selecciona los alérgenos que deseas evitar. Tus preferencias se guardarán automáticamente para futuras visitas.
              </p>
              <TooltipProvider>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(allergenInfo).map(([key, info]) => {
                    const Icon = info.icon;
                    const isSelected = excludedAllergens.includes(key as Allergen);
                    return (
                      <Tooltip key={key}>
                        <TooltipTrigger asChild>
                          <Button
                            variant={isSelected ? "default" : "outline"}
                            size="sm"
                            onClick={() => toggleAllergen(key as Allergen)}
                            className={isSelected 
                              ? "bg-red-500 hover:bg-red-600 text-white" 
                              : "border-border hover:bg-muted"
                            }
                          >
                            <Icon className="h-4 w-4 mr-2" />
                            {info.name}
                            {isSelected && <X className="h-3 w-3 ml-2" />}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p className="text-sm font-semibold mb-1">{info.name}</p>
                          <p className="text-xs text-muted-foreground">{info.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </div>
              </TooltipProvider>
              {selectedCategory && excludedAllergens.length > 0 && (
                <p className="text-sm text-muted-foreground mt-4">
                  Mostrando platos sin: <span className="font-semibold text-foreground">
                    {excludedAllergens.map(a => allergenInfo[a].name).join(', ')}
                  </span>
                </p>
              )}
            </div>

            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {comedorCategories.map((category) => (
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
          </TabsContent>

          <TabsContent value="menu-dia">
            <div id="menu-items-section" className="max-w-4xl mx-auto">
              <Card className="shadow-elegant hover:shadow-golden transition-all duration-300">
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <h2 className="text-4xl font-display font-bold text-golden mb-2">MENÚ DEL DÍA</h2>
                    <p className="text-sm text-muted-foreground">Disponible Lunes a Viernes</p>
                    <div className="text-5xl font-bold text-golden mt-4">20€</div>
                    <p className="text-sm text-muted-foreground mt-1">Por Persona</p>
                  </div>

                  <div className="space-y-8">
                    <div>
                      <h3 className="text-2xl font-display font-semibold text-foreground mb-4 border-b-2 border-golden pb-2">ENTRANTE</h3>
                      <div className="ml-4">
                        <h4 className="text-lg font-semibold text-card-foreground mb-2">Crema de calabaza y zanahoria</h4>
                        <p className="text-muted-foreground">Al Jengibre con aceite de trufa, ligera y aromática</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-2xl font-display font-semibold text-foreground mb-4 border-b-2 border-golden pb-2">PLATO PRINCIPAL</h3>
                      <div className="ml-4 space-y-4">
                        <div>
                          <h4 className="text-lg font-semibold text-card-foreground mb-2">Cachopo de Ternera</h4>
                          <p className="text-muted-foreground">Con Jamón y Queso fundido acompañado de patatas fritas, tradicional crujiente y sabroso</p>
                        </div>
                        <div className="text-center text-muted-foreground font-semibold">o</div>
                        <div>
                          <h4 className="text-lg font-semibold text-card-foreground mb-2">Gambas al ajillo</h4>
                          <p className="text-muted-foreground">Jugosas gambas salteadas en aceite de oliva con ajo laminado, guindilla y un toque de perejil, servidas bien calientes para disfrutar de todo su aroma</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-2xl font-display font-semibold text-foreground mb-4 border-b-2 border-golden pb-2">POSTRE</h3>
                      <div className="ml-4">
                        <h4 className="text-lg font-semibold text-card-foreground mb-2">Coulant de chocolate Negro/Blanco</h4>
                        <p className="text-muted-foreground">Bizcocho tibio de chocolate con corazón fundido, intenso y cremoso en cada bocado</p>
                      </div>
                    </div>

                    <div className="bg-muted/50 rounded-lg p-4 mt-6">
                      <p className="text-center text-card-foreground font-semibold">
                        Incluido: Agua / Vino de la Casa / Café
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {isWeekendMenuVisible() && (
            <TabsContent value="menu-fin-semana">
              <div id="menu-items-section" className="max-w-4xl mx-auto">
                <Card className="shadow-elegant hover:shadow-golden transition-all duration-300">
                  <CardContent className="p-8">
                    <div className="text-center mb-6">
                      <h2 className="text-4xl font-display font-bold text-golden mb-4">MENÚ</h2>
                      <div className="text-5xl font-bold text-golden">35€</div>
                      <p className="text-sm text-muted-foreground mt-1">Por Persona</p>
                    </div>

                    <div className="space-y-8">
                      <div>
                        <h3 className="text-2xl font-display font-semibold text-foreground mb-4 border-b-2 border-golden pb-2">ENTRANTES (A ELEGIR)</h3>
                        <div className="ml-4 space-y-4">
                          <div>
                            <h4 className="text-lg font-semibold text-card-foreground mb-2">Ensalada de pollo con mayonesa de kimchi</h4>
                            <p className="text-muted-foreground">Pollo desmenuzado con kimchi, mayonesa cremosa, tomate fresco y cebolla</p>
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold text-card-foreground mb-2">Crema de calabaza y zanahoria al jengibre con aceite de trufa</h4>
                            <p className="text-muted-foreground">(ligera y aromático)</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-2xl font-display font-semibold text-foreground mb-4 border-b-2 border-golden pb-2">PLATO PRINCIPAL (A ELEGIR)</h3>
                        <div className="ml-4 space-y-4">
                          <div>
                            <h4 className="text-lg font-semibold text-card-foreground mb-2">Solomillo de ternera con jugo de trufa</h4>
                            <p className="text-muted-foreground">Solomillo de ternera al punto, acompañado de un jugo de trufa intenso y aromático</p>
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold text-card-foreground mb-2">Merluza con chutney de tomate y bilbaína</h4>
                            <p className="text-muted-foreground">Merluza fresca a la plancha con chutney de tomate especiado y salsa bilbaína tradicional</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-2xl font-display font-semibold text-foreground mb-4 border-b-2 border-golden pb-2">POSTRE (A ELEGIR)</h3>
                        <div className="ml-4 space-y-4">
                          <div>
                            <h4 className="text-lg font-semibold text-card-foreground mb-2">Torrija moderna con espuma de coco</h4>
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold text-card-foreground mb-2">Helado</h4>
                          </div>
                        </div>
                      </div>

                      <div className="bg-muted/50 rounded-lg p-4 mt-6 space-y-2">
                        <p className="text-center text-card-foreground font-semibold">
                          Pan, Agua, vino Ribera y café incluidos
                        </p>
                        <div className="text-center text-sm text-muted-foreground space-y-1">
                          <p>*Menu Disponible por fin de Semanas y Festivos</p>
                          <p>*Grupo Mínimo de 6 personas</p>
                          <p>*Con Reserva</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          )}

          <TabsContent value="menu-navidad">
            <div id="menu-items-section" className="max-w-4xl mx-auto">
              <Card className="shadow-elegant hover:shadow-golden transition-all duration-300">
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <h2 className="text-4xl font-display font-bold text-golden mb-4">MENÚ NAVIDAD</h2>
                    <div className="text-5xl font-bold text-golden">45€</div>
                    <p className="text-sm text-muted-foreground mt-1">Por Persona</p>
                  </div>

                  <div className="space-y-8">
                    <div>
                      <h3 className="text-2xl font-display font-semibold text-foreground mb-4 border-b-2 border-golden pb-2">Aperitivo</h3>
                      <div className="ml-4">
                        <h4 className="text-lg font-semibold text-card-foreground mb-2">Coulant de batata</h4>
                        <p className="text-muted-foreground">Suave pastelito de batata con corazón cremoso, servido templado para abrir el apetito con un toque dulce y delicado</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-2xl font-display font-semibold text-foreground mb-4 border-b-2 border-golden pb-2">Primer plato</h3>
                      <div className="ml-4">
                        <h4 className="text-lg font-semibold text-card-foreground mb-2">Alcachofa con trufa rallada</h4>
                        <p className="text-muted-foreground">Corazón de alcachofa confitado con gamba salteada, acompañado de una ligera espuma de coco y piña que aporta frescura tropical. Terminado con trufa rallada para un aroma festivo y elegante</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-2xl font-display font-semibold text-foreground mb-4 border-b-2 border-golden pb-2">Plato principal a elegir</h3>
                      <div className="ml-4 space-y-4">
                        <div>
                          <h4 className="text-lg font-semibold text-card-foreground mb-2">Paletilla de lechazo con puré de yuca y salsa al Pedro Ximénez</h4>
                          <p className="text-muted-foreground">Paletilla de cordero lechal confitada lentamente hasta quedar melosa, acompañada de un cremoso puré de yuca y una salsa intensa de Pedro Ximénez</p>
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-card-foreground mb-2">Corvina a la plancha con espinacas salteadas y bisque de marisco</h4>
                          <p className="text-muted-foreground">Lomo de corvina marcado a la plancha para resaltar su textura y sabor, acompañado de espinacas salteadas y bisque de marisco aromático y concentrado</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-2xl font-display font-semibold text-foreground mb-4 border-b-2 border-golden pb-2">Postre</h3>
                      <div className="ml-4">
                        <h4 className="text-lg font-semibold text-card-foreground mb-2">Mousse de turrón</h4>
                        <p className="text-muted-foreground">Delicada mousse elaborada con turrón de coco, cremosa y suave, que combina tradición navideña con un toque exótico y fresco</p>
                      </div>
                    </div>

                    <div className="bg-muted/50 rounded-lg p-4 mt-6">
                      <p className="text-center text-card-foreground font-semibold">
                        Bebidas incluidas: Agua, vino y café incluidos
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Menu Items - Solo para Barra y Comedor */}
        {(selectedSection === "barra" || selectedSection === "comedor") && selectedCategory && (
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
        )}

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
