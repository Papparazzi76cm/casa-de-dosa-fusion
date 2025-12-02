import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Star, Utensils, MapPin } from "lucide-react";
import ReservationChatbot from "@/components/ReservationChatbot";

// Import all menu images for carousel
import albondigas from "@/assets/menu/albondigas.jpg";
import arrozMarisco from "@/assets/menu/arroz-marisco.jpg";
import arrozMariscos from "@/assets/menu/arroz-mariscos.jpg";
import burrata from "@/assets/menu/burrata.jpg";
import cremaBatata from "@/assets/menu/crema-batata.png";
import croquetasKimchiMango from "@/assets/menu/croquetas-kimchi-mango.jpg";
import croquetasKimchi from "@/assets/menu/croquetas-kimchi.jpg";
import ensaladilla from "@/assets/menu/ensaladilla.jpg";
import entrañaAngus from "@/assets/menu/entraña-angus.jpg";
import entraña from "@/assets/menu/entraña.jpg";
import gyozaRopaVieja from "@/assets/menu/gyoza-ropa-vieja.jpg";
import hamburguesa from "@/assets/menu/hamburguesa.png";
import lagrimasPollo from "@/assets/menu/lagrimas-pollo.jpg";
import masalaDosa from "@/assets/menu/masala-dosa.jpg";
import miniBurguer from "@/assets/menu/mini-burguer.jpeg";
import pannacotta from "@/assets/menu/pannacotta.png";
import patatasBravas from "@/assets/menu/patatas-bravas.jpg";
import rabas from "@/assets/menu/rabas.jpg";
import rodaballo from "@/assets/menu/rodaballo.jpg";
import ruloLechazo from "@/assets/menu/rulo-lechazo.png";
import samosasVegetales from "@/assets/menu/samosas-vegetales.png";
import seleccionQuesos from "@/assets/menu/seleccion-quesos.png";
import tartaQueso from "@/assets/menu/tarta-queso.jpg";
import tartarAtun from "@/assets/menu/tartar-atun.jpg";
import torreznoSoria from "@/assets/menu/torrezno-soria.png";
import torrija from "@/assets/menu/torrija.png";

const carouselImages = [
  albondigas, arrozMarisco, arrozMariscos, burrata, cremaBatata,
  croquetasKimchiMango, croquetasKimchi, ensaladilla, entrañaAngus,
  entraña, gyozaRopaVieja, hamburguesa, lagrimasPollo, masalaDosa,
  miniBurguer, pannacotta, patatasBravas, rabas, rodaballo,
  ruloLechazo, samosasVegetales, seleccionQuesos, tartaQueso,
  tartarAtun, torreznoSoria, torrija
];

const Home = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % carouselImages.length
      );
    }, 2000); // Change image every 2 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section with Carousel */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Carousel Images */}
        {carouselImages.map((image, index) => (
          <div
            key={index}
            className="absolute inset-0 w-full h-full transition-opacity duration-1000"
            style={{
              opacity: index === currentImageIndex ? 0.5 : 0,
              backgroundImage: `url(${image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          />
        ))}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-elegant"></div>
        
        {/* Content */}
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 leading-tight">
            Casa de <span className="text-golden">Dosa</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-grey-light leading-relaxed">
            Donde la tradición india se encuentra con la pasión española
          </p>
          <p className="text-lg mb-12 max-w-2xl mx-auto opacity-90">
            Descubre una experiencia culinaria única que fusiona los sabores auténticos 
            de la India con la esencia gastronómica de España
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              asChild 
              size="lg" 
              className="bg-gradient-golden hover:opacity-90 text-blue-grey-dark font-semibold px-8 py-4 text-lg shadow-golden"
            >
              <Link to="/reservas">
                Reservar Mesa
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button 
              asChild 
              variant="outline" 
              size="lg"
              className="border-golden text-golden hover:bg-golden hover:text-blue-grey-dark font-semibold px-8 py-4 text-lg"
            >
              <Link to="/menu">Ver Menú</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-gradient-hero text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Utensils className="h-16 w-16 text-golden mx-auto mb-6" />
          <h2 className="text-4xl font-display font-bold mb-6">
            ¿Listo para una Experiencia Única?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Reserva tu mesa y déjate sorprender por una fusión gastronómica 
            que despertará todos tus sentidos
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              asChild 
              size="lg" 
              className="bg-golden hover:bg-golden-dark text-blue-grey-dark font-semibold px-8 py-4"
            >
              <Link to="/reservas">Reservar Ahora</Link>
            </Button>
            <Button 
              asChild 
              variant="outline" 
              size="lg"
              className="border-golden text-golden hover:bg-golden hover:text-blue-grey-dark"
            >
              <Link to="/contacto">
                <MapPin className="mr-2 h-5 w-5" />
                Cómo Llegar
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Reservation Chatbot */}
      <ReservationChatbot />
    </div>
  );
};

export default Home;
