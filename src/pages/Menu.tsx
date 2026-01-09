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
import vicaralEspumoso from "@/assets/wines/vicaral-espumoso.jpg";
import vicaralVerdejo from "@/assets/wines/vicaral-verdejo.jpg";
import martivilli from "@/assets/wines/martivilli.jpg";
import josePariente from "@/assets/wines/jose-pariente.png";
import alanDeVal from "@/assets/wines/alan-de-val.png";
import vinaPicota from "@/assets/wines/vina-picota.jpg";
import salvueros from "@/assets/wines/salvueros.jpg";
import viyuelaBarrica from "@/assets/wines/viyuela-barrica.png";
import lagrimaNegra from "@/assets/wines/lagrima-negra.jpg";
import conventoOreja from "@/assets/wines/convento-oreja.png";
import pruno from "@/assets/wines/pruno.jpg";
import tintoCrianza from "@/assets/wines/tinto-crianza.jpg";
import cruzDeAlba from "@/assets/wines/cruz-de-alba.png";
import cuatroRayasFrizzante from "@/assets/wines/cuatro-rayas-frizzante.png";
import dulce from "@/assets/wines/dulce.jpg";
import zamburinas from "@/assets/menu/zamburinas.jpg";
import casaDeDosaTinto from "@/assets/wines/casa-de-dosa-tinto.jpg";
import aliyo from "@/assets/wines/aliyo.jpg";
import laCasonaVid from "@/assets/wines/la-casona-vid-5v.jpg";
import queulat from "@/assets/wines/queulat.webp";
import descarte from "@/assets/wines/descarte.webp";
import vizcarra from "@/assets/wines/vizcarra.jpg";
import robatie from "@/assets/wines/robatie.webp";
import altaPavina from "@/assets/wines/alta-pavina.webp";
import astobiza from "@/assets/wines/astobiza.jpg";
import caraballas from "@/assets/wines/caraballas.jpg";

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
    image: zamburinas,
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
    image: zamburinas,
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

  // Vinos - Espumosos
  {
    id: 700,
    name: "Vicaral espumoso",
    description: "D.O. Rueda - Serrada | 🍇 Verdejo | Método tradicional",
    price: 18,
    category: "Vinos",
    rating: 4.8,
    allergens: ["sulfitos"],
  },

  // Vinos - Blancos
  {
    id: 701,
    name: "Vicaral 2024",
    description: "D.O. Rueda - Serrada | 🍇 Verdejo",
    price: 15,
    category: "Vinos",
    rating: 4.7,
    allergens: ["sulfitos"],
  },
  {
    id: 702,
    name: "Martivilli 2024",
    description: "D.O. Rueda - Pozaldez | 🍇 Verdejo",
    price: 16,
    category: "Vinos",
    rating: 4.7,
    allergens: ["sulfitos"],
  },
  {
    id: 703,
    name: "José Pariente 2024",
    description: "D.O. Rueda - La Seca | 🍇 Verdejo",
    price: 20,
    category: "Vinos",
    rating: 4.9,
    allergens: ["sulfitos"],
  },
  {
    id: 704,
    name: "Alan de Val 2024",
    description: "D.O. Valdehorras - A Rúa Orense | 🍇 Godello",
    price: 18,
    category: "Vinos",
    rating: 4.8,
    allergens: ["sulfitos"],
  },

  // Vinos - Rosados
  {
    id: 705,
    name: "Viña Picota 2024",
    description: "D.O. Cigales - Corcos del Valle | 🍇 Tempranillo, Verdejo y Albillo",
    price: 14,
    category: "Vinos",
    rating: 4.6,
    allergens: ["sulfitos"],
  },
  {
    id: 706,
    name: "Salvueros 2024",
    description: "D.O. Cigales - Mucientes | 🍇 Tempranillo, Verdejo y Albillo",
    price: 15,
    category: "Vinos",
    rating: 4.7,
    allergens: ["sulfitos"],
  },

  // Vinos - Tintos Roble
  {
    id: 707,
    name: "Viyuela barrica 2023",
    description: "D.O. Ribera del Duero - Boada de Roa | 🍇 Tinto Fino",
    price: 15,
    category: "Vinos",
    rating: 4.7,
    allergens: ["sulfitos"],
  },
  {
    id: 708,
    name: "Lágrima Negra 2024",
    description: "D.O. Ribera del Duero - Pesquera | 🍇 Tinto Fino",
    price: 15,
    category: "Vinos",
    rating: 4.7,
    allergens: ["sulfitos"],
  },
  {
    id: 709,
    name: "Convento Oreja Roble 2024",
    description: "D.O. Ribera del Duero - Peñafiel | 🍇 Tinto Fino",
    price: 16,
    category: "Vinos",
    rating: 4.8,
    allergens: ["sulfitos"],
  },

  // Vinos - Tintos Crianza
  {
    id: 710,
    name: "Vino de la Casa de Dosa 2022",
    description: "Valtiendas - Segovia | 🍇 Tempranillo",
    price: 12,
    category: "Vinos",
    rating: 4.5,
    allergens: ["sulfitos"],
    image: casaDeDosaTinto,
  },
  {
    id: 711,
    name: "Ajechao 2023",
    description: "Sierra de Salamanca - Sotoserrano | 🍇 Rufete y Tempranillo",
    price: 18,
    category: "Vinos",
    rating: 4.8,
    allergens: ["sulfitos"],
    image: aliyo,
  },
  {
    id: 712,
    name: "Pruno 2022",
    description: "D.O. Ribera del Duero - Valbuena de Duero | 🍇 Tinto Fino y Cabernet Sauvignon",
    price: 19,
    category: "Vinos",
    rating: 4.9,
    allergens: ["sulfitos"],
  },
  {
    id: 713,
    name: "Cruz de Alba 2022",
    description: "D.O. Ribera del Duero - Finca los Hoyales | 🍇 Tinto Fino",
    price: 24,
    category: "Vinos",
    rating: 4.9,
    allergens: ["sulfitos"],
  },

  // Vinos - Dulces
  {
    id: 714,
    name: "4 Rayas Frizzante",
    description: "La Seca - Valladolid | 🍇 Verdejo",
    price: 14,
    category: "Vinos",
    rating: 4.6,
    allergens: ["sulfitos"],
  },
];

const barraCategories = ["Todos", "Tapas", "Desayunos"];
const comedorCategories = ["Todos", "Embutidos y Quesos", "Ensalada y Verduras", "Selección de Dosas", "Entrantes", "Pescados", "Arroz", "Carne", "Guarniciones", "Postres", "Vinos"];

const ALLERGEN_PREFERENCES_KEY = 'casa-dosa-allergen-preferences';

// Wine pairing recommendations with images
const winePairings = [
  {
    dish: "Jamón Ibérico",
    wine: "Vicaral espumoso",
    reason: "La efervescencia del espumoso limpia el paladar entre bocados del jamón graso, mientras sus notas frescas realzan los matices dulces de la bellota.",
    image: platoJamonIberico
  },
  {
    dish: "Tartar de Atún Rojo Sandía y Ponzu de Tomate",
    wine: "José Pariente 2024",
    reason: "La mineralidad y frescura del verdejo complementa perfectamente la textura del atún crudo, mientras su acidez equilibra el ponzu.",
    image: tartarAtun
  },
  {
    dish: "Rodaballo con Puré de Coliflor y Salsa Ponzu",
    wine: "Alan de Val 2024",
    reason: "El godello aporta estructura y complejidad que eleva el rodaballo, con notas herbáceas que armonizan con la coliflor.",
    image: rodaballo
  },
  {
    dish: "Gyoza de Ropa Vieja con Jugo Vegetal",
    wine: "Viña Picota 2024",
    reason: "El rosado cigaleño equilibra los sabores intensos de la ropa vieja, aportando frescura sin dominar el plato.",
    image: gyozaRopaVieja
  },
  {
    dish: "Burrata y Tartar de Pitahaya y Manzana",
    wine: "Martivilli 2024",
    reason: "Un verdejo joven y fresco que no compite con la cremosidad de la burrata, realzando las notas frutales del tartar.",
    image: burrata
  },
  {
    dish: "Ensaladilla de Langostinos",
    wine: "Vicaral 2024",
    reason: "La acidez del verdejo corta la cremosidad del alioli, mientras su frescura resalta el sabor de los langostinos.",
    image: ensaladilla
  },
  {
    dish: "Entraña de Angus con Irish Champ",
    wine: "Pruno 2022",
    reason: "Un crianza con cuerpo y estructura tánica que complementa la jugosidad de la entraña, con notas especiadas que dialogan con el curry.",
    image: entraña
  },
  {
    dish: "Rulo de Lechazo Relleno de Duxelle",
    wine: "Cruz de Alba 2022",
    reason: "La elegancia de este crianza eleva el lechazo tierno, con taninos sedosos que no opacan la delicadeza de la carne.",
    image: ruloLechazo
  },
  {
    dish: "Arroz de Mariscos",
    wine: "Salvueros 2024",
    reason: "El rosado cigaleño con su acidez y frescura es ideal para el sabor intenso del mar y el sofrito tradicional.",
    image: arrozMariscos
  },
  {
    dish: "Masala Dosa",
    wine: "Vicaral 2024",
    reason: "Un blanco versátil que refresca el paladar ante las especias del masala, sin perder protagonismo.",
    image: masalaDosa
  },
  {
    dish: "Croqueta de Mango Kimchi",
    wine: "Martivilli 2024",
    reason: "La frescura frutal del verdejo equilibra el picante del kimchi y realza el dulzor del mango.",
    image: croquetaMangoKimchi
  },
  {
    dish: "Albóndigas de Langostino con Salsa de Coco",
    wine: "Alan de Val 2024",
    reason: "El godello con su textura sedosa complementa la cremosidad del coco, aportando notas cítricas que refrescan.",
    image: albondigas
  },
  {
    dish: "Zamburiñas con Leche de Coco y Anacardo",
    wine: "José Pariente 2024",
    reason: "Un blanco con estructura que eleva las zamburiñas, equilibrando la cremosidad del coco con su acidez elegante.",
    image: zamburinas
  },
  {
    dish: "Hamburguesa de Vergara Beef",
    wine: "Viyuela barrica 2023",
    reason: "Un roble joven con taninos suaves que complementa la jugosidad de la carne sin dominarla.",
    image: hamburguesa
  },
  {
    dish: "Torrezno de Soria",
    wine: "Lágrima Negra 2024",
    reason: "El roble con su frescura corta la grasa del torrezno, mientras sus notas frutales aportan complejidad.",
    image: torreznoSoria
  },
  {
    dish: "Rabas con Alioli",
    wine: "Vicaral 2024",
    reason: "La acidez del verdejo limpia el paladar del alioli, realzando la textura tierna del calamar.",
    image: rabas
  },
  {
    dish: "Selección de Quesos",
    wine: "Convento Oreja Roble 2024",
    reason: "Un roble versátil que se adapta a diferentes quesos, con taninos suaves que no dominan los sabores lácteos.",
    image: seleccionQuesos
  },
  {
    dish: "Crema de Batata",
    wine: "Viña Picota 2024",
    reason: "El rosado con sus notas frutales complementa la dulzura natural de la batata sin añadir pesadez.",
    image: cremaBatata
  },
  {
    dish: "Tarta de Queso con Helado de Café",
    wine: "4 Rayas Frizzante",
    reason: "Las burbujas y el dulzor ligero del frizzante equilibran la cremosidad de la tarta y el amargor del café.",
    image: tartaQueso
  },
  {
    dish: "Torrija con Espuma de Coco",
    wine: "4 Rayas Frizzante",
    reason: "Un vino dulce que no compite con el postre, sino que aporta frescura y ligereza al final de la comida.",
    image: torrija
  },
  {
    dish: "Pannacotta de Mango",
    wine: "4 Rayas Frizzante",
    reason: "La efervescencia del frizzante limpia el paladar de la cremosidad, mientras realza las notas frutales del mango.",
    image: pannacotta
  },
  {
    dish: "Samosa de Verdura",
    wine: "Caraballas 2022 (Ecológico)",
    reason: "El sauvignon blanc ecológico aporta frescura y notas herbáceas que complementan las especias suaves de la samosa vegetariana.",
    image: samosasVegetales
  },
  {
    dish: "Croquetón de Pollo Malai",
    wine: "Astobiza 2024",
    reason: "El txakoli vasco con su acidez vibrante corta la cremosidad del pollo malai, aportando un final limpio y refrescante.",
    image: croquetaMangoKimchi
  },
  {
    dish: "Mini Burger de Atún",
    wine: "Alta Pavina 2023",
    reason: "El pinot noir castellano con su elegancia y taninos sedosos realza el atún sin dominarlo, creando un maridaje sofisticado.",
    image: miniBurguer
  },
  {
    dish: "Selección de Ibéricos",
    wine: "Robatie 2022",
    reason: "El tempranillo riojano con su estructura y notas de fruta madura complementa perfectamente los sabores intensos del ibérico curado.",
    image: platoEmbutidosIbericos
  },
  {
    dish: "Entraña de Angus con Irish Champ",
    wine: "Vizcarra 2022",
    reason: "Un ribera del duero con cuerpo y taninos maduros que se funden con la jugosidad de la entraña, aportando notas especiadas.",
    image: entraña
  },
  {
    dish: "Rulo de Lechazo Relleno de Duxelle",
    wine: "Descarte 2018",
    reason: "La potencia y profundidad del tinta de toro reserva eleva la delicadeza del lechazo con sus notas de fruta negra y especias.",
    image: ruloLechazo
  },
  {
    dish: "Fingers de Pollo con Miel y Mostaza",
    wine: "Queulat 2021",
    reason: "El gran reserva chileno con su complejidad de carmenere, syrah y petit verdot crea un contraste sofisticado con el dulce de la miel.",
    image: hamburguesa
  },
  {
    dish: "Tarta de Queso con Helado de Café",
    wine: "La Casona de la Vid 5.5 2024",
    reason: "El moscato italiano con su dulzura aromática y burbujas delicadas realza la cremosidad de la tarta y equilibra el amargor del café.",
    image: tartaQueso
  }
];

const Menu = () => {
  const navigate = useNavigate();
  const [selectedSection, setSelectedSection] = useState<"barra" | "comedor" | "carta-vinos" | "maridajes">("barra");
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

  const handleSectionChange = (section: "barra" | "comedor" | "carta-vinos" | "maridajes") => {
    setSelectedSection(section);
    setSelectedCategory(null);
    scrollToMenu();
  };

  const openMenuDelMes = () => {
    const link = document.createElement('a');
    link.href = '/menu-del-mes.pdf';
    link.download = 'Menu-del-Mes-Casa-de-Dosa.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
        <Tabs value={selectedSection} onValueChange={(value) => handleSectionChange(value as "barra" | "comedor" | "carta-vinos" | "maridajes")} className="mb-8">
          <TabsList className="flex flex-col md:grid w-full max-w-4xl mx-auto gap-2 md:gap-0 mb-8 h-auto md:h-auto bg-transparent md:bg-muted p-0 md:p-1 md:grid-cols-5">
            <TabsTrigger value="barra" className="text-base md:text-lg w-full py-3 data-[state=active]:bg-gradient-golden">Barra</TabsTrigger>
            <TabsTrigger value="comedor" className="text-base md:text-lg w-full py-3 data-[state=active]:bg-gradient-golden">Comedor</TabsTrigger>
            <TabsTrigger value="carta-vinos" className="text-base md:text-lg w-full py-3 data-[state=active]:bg-gradient-golden">Carta de Vinos</TabsTrigger>
            <TabsTrigger value="maridajes" className="text-base md:text-lg w-full py-3 data-[state=active]:bg-gradient-golden">Maridajes</TabsTrigger>
            <button 
              onClick={openMenuDelMes}
              className="text-base md:text-lg w-full py-3 bg-muted hover:bg-gradient-golden transition-all rounded-md font-medium"
            >
              Menú del Mes
            </button>
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

          <TabsContent value="carta-vinos">
            <div id="menu-items-section" className="max-w-5xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-display font-bold text-golden mb-2">Carta de Vinos</h2>
                <p className="text-muted-foreground">Selección de vinos de la región</p>
              </div>

              <div className="space-y-8">
                {/* ESPUMOSOS */}
                <Card className="shadow-elegant">
                  <CardContent className="p-6">
                    <h3 className="text-2xl font-display font-semibold text-foreground mb-6 border-b-2 border-golden pb-2">ESPUMOSOS</h3>
                    <div className="space-y-4">
                      <div className="flex gap-4 items-start border-b border-border pb-4">
                        <div className="w-24 h-32 flex-shrink-0">
                          <img 
                            src={vicaralEspumoso} 
                            alt="Vicaral espumoso" 
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-card-foreground mb-1">Vicaral espumoso</h4>
                          <p className="text-sm text-muted-foreground">D.O. Rueda - Serrada</p>
                          <p className="text-sm text-muted-foreground">🍇 Verdejo</p>
                          <p className="text-sm text-muted-foreground italic">Método tradicional</p>
                        </div>
                        <div className="text-2xl font-bold text-golden ml-4">18€</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* BLANCOS */}
                <Card className="shadow-elegant">
                  <CardContent className="p-6">
                    <h3 className="text-2xl font-display font-semibold text-foreground mb-6 border-b-2 border-golden pb-2">BLANCOS</h3>
                    <div className="space-y-4">
                      <div className="flex gap-4 items-start border-b border-border pb-4">
                        <div className="w-24 h-32 flex-shrink-0">
                          <img 
                            src={vicaralVerdejo} 
                            alt="Vicaral 2024" 
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-card-foreground mb-1">Vicaral 2024</h4>
                          <p className="text-sm text-muted-foreground">D.O. Rueda - Serrada</p>
                          <p className="text-sm text-muted-foreground">🍇 Verdejo</p>
                        </div>
                        <div className="text-2xl font-bold text-golden ml-4">15€</div>
                      </div>
                      <div className="flex gap-4 items-start border-b border-border pb-4">
                        <div className="w-24 h-32 flex-shrink-0">
                          <img 
                            src={martivilli} 
                            alt="Martivilli 2024" 
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-card-foreground mb-1">Martivilli 2024</h4>
                          <p className="text-sm text-muted-foreground">D.O. Rueda - Pozaldez</p>
                          <p className="text-sm text-muted-foreground">🍇 Verdejo</p>
                        </div>
                        <div className="text-2xl font-bold text-golden ml-4">16€</div>
                      </div>
                      <div className="flex gap-4 items-start border-b border-border pb-4">
                        <div className="w-24 h-32 flex-shrink-0">
                          <img 
                            src={caraballas} 
                            alt="Caraballas 2022" 
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-1 mb-1">
                            <h4 className="text-lg font-semibold text-card-foreground">Caraballas 2022</h4>
                            <Badge className="bg-green-600 hover:bg-green-700 text-white text-[10px] px-1.5 py-0">
                              <Leaf className="w-2.5 h-2.5 mr-0.5" />
                              Eco
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">V.T. Castilla y León - Medina del Campo</p>
                          <p className="text-sm text-muted-foreground">🍇 Sauvignon Blanc</p>
                        </div>
                        <div className="text-2xl font-bold text-golden ml-4 flex-shrink-0">22€</div>
                      </div>
                      <div className="flex gap-4 items-start border-b border-border pb-4">
                        <div className="w-24 h-32 flex-shrink-0">
                          <img 
                            src={astobiza} 
                            alt="Astobiza 2024" 
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-card-foreground mb-1">Astobiza 2024</h4>
                          <p className="text-sm text-muted-foreground">D.O. Txakoli de Álava - Okondo</p>
                          <p className="text-sm text-muted-foreground">🍇 Hondarrabi Zuri</p>
                        </div>
                        <div className="text-2xl font-bold text-golden ml-4">18€</div>
                      </div>
                      <div className="flex gap-4 items-start border-b border-border pb-4">
                        <div className="w-24 h-32 flex-shrink-0">
                          <img 
                            src={josePariente} 
                            alt="José Pariente 2024" 
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-card-foreground mb-1">José Pariente 2024</h4>
                          <p className="text-sm text-muted-foreground">D.O. Rueda - La Seca</p>
                          <p className="text-sm text-muted-foreground">🍇 Verdejo</p>
                        </div>
                        <div className="text-2xl font-bold text-golden ml-4">20€</div>
                      </div>
                      <div className="flex gap-4 items-start border-b border-border pb-4">
                        <div className="w-24 h-32 flex-shrink-0">
                          <img 
                            src={alanDeVal} 
                            alt="Alan de Val 2024" 
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-card-foreground mb-1">Alan de Val 2024</h4>
                          <p className="text-sm text-muted-foreground">D.O. Valdehorras - A Rúa Orense</p>
                          <p className="text-sm text-muted-foreground">🍇 Godello</p>
                        </div>
                        <div className="text-2xl font-bold text-golden ml-4">18€</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* ROSADOS */}
                <Card className="shadow-elegant">
                  <CardContent className="p-6">
                    <h3 className="text-2xl font-display font-semibold text-foreground mb-6 border-b-2 border-golden pb-2">ROSADOS</h3>
                    <div className="space-y-4">
                      <div className="flex gap-4 items-start border-b border-border pb-4">
                        <div className="w-24 h-32 flex-shrink-0">
                          <img 
                            src={vinaPicota} 
                            alt="Viña Picota 2024" 
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-card-foreground mb-1">Viña Picota 2024</h4>
                          <p className="text-sm text-muted-foreground">D.O. Cigales - Corcos del Valle</p>
                          <p className="text-sm text-muted-foreground">🍇 Tempranillo, Verdejo y Albillo</p>
                        </div>
                        <div className="text-2xl font-bold text-golden ml-4">14€</div>
                      </div>
                      <div className="flex gap-4 items-start border-b border-border pb-4">
                        <div className="w-24 h-32 flex-shrink-0">
                          <img 
                            src={salvueros} 
                            alt="Salvueros 2024" 
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-card-foreground mb-1">Salvueros 2024</h4>
                          <p className="text-sm text-muted-foreground">D.O. Cigales - Mucientes</p>
                          <p className="text-sm text-muted-foreground">🍇 Tempranillo, Verdejo y Albillo</p>
                        </div>
                        <div className="text-2xl font-bold text-golden ml-4">15€</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* TINTOS ROBLE */}
                <Card className="shadow-elegant">
                  <CardContent className="p-6">
                    <h3 className="text-2xl font-display font-semibold text-foreground mb-6 border-b-2 border-golden pb-2">TINTOS ROBLE</h3>
                    <div className="space-y-4">
                      <div className="flex gap-4 items-start border-b border-border pb-4">
                        <div className="w-24 h-32 flex-shrink-0">
                          <img 
                            src={viyuelaBarrica} 
                            alt="Viyuela barrica 2023" 
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-card-foreground mb-1">Viyuela barrica 2023</h4>
                          <p className="text-sm text-muted-foreground">D.O. Ribera del Duero - Boada de Roa</p>
                          <p className="text-sm text-muted-foreground">🍇 Tinto Fino</p>
                        </div>
                        <div className="text-2xl font-bold text-golden ml-4">15€</div>
                      </div>
                      <div className="flex gap-4 items-start border-b border-border pb-4">
                        <div className="w-24 h-32 flex-shrink-0">
                          <img 
                            src={lagrimaNegra} 
                            alt="Lágrima Negra 2024" 
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-card-foreground mb-1">Lágrima Negra 2024</h4>
                          <p className="text-sm text-muted-foreground">D.O. Ribera del Duero - Pesquera</p>
                          <p className="text-sm text-muted-foreground">🍇 Tinto Fino</p>
                        </div>
                        <div className="text-2xl font-bold text-golden ml-4">15€</div>
                      </div>
                      <div className="flex gap-4 items-start border-b border-border pb-4">
                        <div className="w-24 h-32 flex-shrink-0">
                          <img 
                            src={conventoOreja} 
                            alt="Convento Oreja Roble 2024" 
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-card-foreground mb-1">Convento Oreja Roble 2024</h4>
                          <p className="text-sm text-muted-foreground">D.O. Ribera del Duero - Peñafiel</p>
                          <p className="text-sm text-muted-foreground">🍇 Tinto Fino</p>
                        </div>
                        <div className="text-2xl font-bold text-golden ml-4">16€</div>
                      </div>
                      <div className="flex gap-4 items-start border-b border-border pb-4">
                        <div className="w-24 h-32 flex-shrink-0">
                          <img 
                            src={altaPavina} 
                            alt="Alta Pavina 2023" 
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-card-foreground mb-1">Alta Pavina 2023</h4>
                          <p className="text-sm text-muted-foreground">V.T. Castilla y León - La Parrilla</p>
                          <p className="text-sm text-muted-foreground">🍇 Pinot Noir</p>
                        </div>
                        <div className="text-2xl font-bold text-golden ml-4">18€</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* TINTOS CRIANZA */}
                <Card className="shadow-elegant">
                  <CardContent className="p-6">
                    <h3 className="text-2xl font-display font-semibold text-foreground mb-6 border-b-2 border-golden pb-2">TINTOS CRIANZA</h3>
                    <div className="space-y-4">
                      <div className="flex gap-4 items-start border-b border-border pb-4">
                        <div className="w-24 h-32 flex-shrink-0">
                          <img 
                            src={casaDeDosaTinto} 
                            alt="Vino de la Casa de Dosa 2022" 
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-card-foreground mb-1">Vino de la "Casa de Dosa" 2022</h4>
                          <p className="text-sm text-muted-foreground">Valtiendas - Segovia</p>
                          <p className="text-sm text-muted-foreground">🍇 Tempranillo</p>
                        </div>
                        <div className="text-2xl font-bold text-golden ml-4">12€</div>
                      </div>
                      <div className="flex gap-4 items-start border-b border-border pb-4">
                        <div className="w-24 h-32 flex-shrink-0">
                          <img 
                            src={aliyo} 
                            alt="Ajechao 2023" 
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-card-foreground mb-1">Ajechao 2023</h4>
                          <p className="text-sm text-muted-foreground">Sierra de Salamanca - Sotoserrano</p>
                          <p className="text-sm text-muted-foreground">🍇 Rufete y Tempranillo</p>
                        </div>
                        <div className="text-2xl font-bold text-golden ml-4">18€</div>
                      </div>
                      <div className="flex gap-4 items-start border-b border-border pb-4">
                        <div className="w-24 h-32 flex-shrink-0">
                          <img 
                            src={robatie} 
                            alt="Robatie 2022" 
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-card-foreground mb-1">Robatie 2022</h4>
                          <p className="text-sm text-muted-foreground">D.O.Ca. Rioja - Baños de Ebro - Álava</p>
                          <p className="text-sm text-muted-foreground">🍇 Tempranillo</p>
                        </div>
                        <div className="text-2xl font-bold text-golden ml-4">18€</div>
                      </div>
                      <div className="flex gap-4 items-start border-b border-border pb-4">
                        <div className="w-24 h-32 flex-shrink-0">
                          <img 
                            src={pruno} 
                            alt="Pruno 2022" 
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-card-foreground mb-1">Pruno 2022</h4>
                          <p className="text-sm text-muted-foreground">D.O. Ribera del Duero - Valbuena de Duero</p>
                          <p className="text-sm text-muted-foreground">🍇 Tinto Fino y Cabernet Sauvignon</p>
                        </div>
                        <div className="text-2xl font-bold text-golden ml-4">19€</div>
                      </div>
                      <div className="flex gap-4 items-start border-b border-border pb-4">
                        <div className="w-24 h-32 flex-shrink-0">
                          <img 
                            src={vizcarra} 
                            alt="Vizcarra 2022" 
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-card-foreground mb-1">Vizcarra 2022</h4>
                          <p className="text-sm text-muted-foreground">D.O. Ribera del Duero - Mambrilla de Castrejón</p>
                          <p className="text-sm text-muted-foreground">🍇 Tinto Fino</p>
                        </div>
                        <div className="text-2xl font-bold text-golden ml-4">22€</div>
                      </div>
                      <div className="flex gap-4 items-start border-b border-border pb-4">
                        <div className="w-24 h-32 flex-shrink-0">
                          <img 
                            src={cruzDeAlba} 
                            alt="Cruz de Alba 2022" 
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-card-foreground mb-1">Cruz de Alba 2022</h4>
                          <p className="text-sm text-muted-foreground">D.O. Ribera del Duero - Finca los Hoyales</p>
                          <p className="text-sm text-muted-foreground">🍇 Tinto Fino</p>
                        </div>
                        <div className="text-2xl font-bold text-golden ml-4">24€</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* TINTOS RESERVA */}
                <Card className="shadow-elegant">
                  <CardContent className="p-6">
                    <h3 className="text-2xl font-display font-semibold text-foreground mb-6 border-b-2 border-golden pb-2">TINTOS RESERVA</h3>
                    <div className="space-y-4">
                      <div className="flex gap-4 items-start border-b border-border pb-4">
                        <div className="w-24 h-32 flex-shrink-0">
                          <img 
                            src={descarte} 
                            alt="Descarte 2018" 
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-card-foreground mb-1">Descarte 2018</h4>
                          <p className="text-sm text-muted-foreground">D.O. Toro - San Román de Hornija</p>
                          <p className="text-sm text-muted-foreground">🍇 Tinta de Toro</p>
                        </div>
                        <div className="text-2xl font-bold text-golden ml-4">28€</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* TINTOS GRAN RESERVA */}
                <Card className="shadow-elegant">
                  <CardContent className="p-6">
                    <h3 className="text-2xl font-display font-semibold text-foreground mb-6 border-b-2 border-golden pb-2">TINTOS GRAN RESERVA</h3>
                    <div className="space-y-4">
                      <div className="flex gap-4 items-start border-b border-border pb-4">
                        <div className="w-24 h-32 flex-shrink-0">
                          <img 
                            src={queulat} 
                            alt="Queulat 2021" 
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-card-foreground mb-1">Queulat 2021</h4>
                          <p className="text-sm text-muted-foreground">Valle del Maipo - Chile</p>
                          <p className="text-sm text-muted-foreground">🍇 Carmenere, Syrah y Petit Verdot</p>
                        </div>
                        <div className="text-2xl font-bold text-golden ml-4">32€</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* DULCES */}
                <Card className="shadow-elegant">
                  <CardContent className="p-6">
                    <h3 className="text-2xl font-display font-semibold text-foreground mb-6 border-b-2 border-golden pb-2">DULCES</h3>
                    <div className="space-y-4">
                      <div className="flex gap-4 items-start border-b border-border pb-4">
                        <div className="w-24 h-32 flex-shrink-0">
                          <img 
                            src={cuatroRayasFrizzante} 
                            alt="4 Rayas Frizzante" 
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-card-foreground mb-1">4 Rayas Frizzante</h4>
                          <p className="text-sm text-muted-foreground">La Seca - Valladolid</p>
                          <p className="text-sm text-muted-foreground">🍇 Verdejo</p>
                        </div>
                        <div className="text-2xl font-bold text-golden ml-4">14€</div>
                      </div>
                      <div className="flex gap-4 items-start border-b border-border pb-4">
                        <div className="w-24 h-32 flex-shrink-0">
                          <img 
                            src={laCasonaVid} 
                            alt="La Casona de la Vid 5.5 2024" 
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-card-foreground mb-1">La Casona de la Vid 5.5 2024</h4>
                          <p className="text-sm text-muted-foreground">D.O.C.G. Moscato D'Asti - Piamonte - Italia</p>
                          <p className="text-sm text-muted-foreground">🍇 Moscato Bianco</p>
                        </div>
                        <div className="text-2xl font-bold text-golden ml-4">18€</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Nota sobre alérgenos */}
                <div className="bg-muted/50 rounded-lg p-4 mt-6">
                  <p className="text-center text-sm text-muted-foreground">
                    Todos los vinos contienen sulfitos
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="maridajes">
            <div id="menu-items-section" className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-display font-bold text-golden mb-4">Maridajes Recomendados</h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                  Descubre las combinaciones perfectas entre nuestros platos y nuestra selección de vinos. 
                  Cada maridaje ha sido cuidadosamente pensado para realzar los sabores de ambos.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {winePairings.map((pairing, index) => (
                  <Card key={index} className="shadow-elegant hover:shadow-golden transition-all duration-300 overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex flex-col sm:flex-row">
                        {/* Imagen del plato */}
                        <div className="w-full sm:w-40 h-40 flex-shrink-0 overflow-hidden">
                          <img 
                            src={pairing.image} 
                            alt={pairing.dish}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        {/* Contenido */}
                        <div className="flex-1 p-6">
                          <div className="flex items-start gap-3 mb-3">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-golden flex items-center justify-center">
                              <Star className="h-5 w-5 text-white fill-white" />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-lg font-display font-semibold text-card-foreground mb-2">
                                {pairing.dish}
                              </h3>
                              <Badge variant="secondary" className="bg-golden/20 text-golden border-golden/30 mb-3">
                                🍷 {pairing.wine}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {pairing.reason}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Nota informativa */}
              <div className="mt-12 p-6 bg-card rounded-lg border border-border">
                <div className="text-center space-y-3">
                  <h3 className="text-xl font-display font-semibold text-card-foreground">
                    ¿Necesitas ayuda para elegir?
                  </h3>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Nuestro equipo estará encantado de asesorarte sobre el maridaje perfecto para tu comida. 
                    Cada plato puede tener múltiples opciones de maridaje según tus preferencias personales.
                  </p>
                  <div className="flex flex-wrap justify-center gap-4 mt-4">
                    <Badge variant="outline" className="text-sm">
                      <Star className="h-3 w-3 mr-1" />
                      Blancos frescos con pescados
                    </Badge>
                    <Badge variant="outline" className="text-sm">
                      <Star className="h-3 w-3 mr-1" />
                      Tintos estructurados con carnes
                    </Badge>
                    <Badge variant="outline" className="text-sm">
                      <Star className="h-3 w-3 mr-1" />
                      Rosados versátiles con tapas
                    </Badge>
                    <Badge variant="outline" className="text-sm">
                      <Star className="h-3 w-3 mr-1" />
                      Dulces con postres
                    </Badge>
                  </div>
                </div>
              </div>
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
