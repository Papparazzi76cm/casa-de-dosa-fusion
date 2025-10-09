import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Star, Utensils, MapPin } from "lucide-react";
import heroImage from "@/assets/hero-restaurant.jpg";
import fusionDosa from "@/assets/fusion-dosa.jpg";
import curryPaella from "@/assets/curry-paella.jpg";
import logo from "@/assets/logo-casa-de-dosa.png";

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative h-[90vh] flex items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-elegant"></div>
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <img 
            src={logo} 
            alt="Casa de Dosa" 
            className="h-32 md:h-40 w-auto mx-auto mb-8 object-contain drop-shadow-2xl"
          />
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

      {/* Destacados Section */}
      <section className="py-20 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-card-foreground mb-4">
              Nuestros Platos Destacados
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Una selección de nuestras creaciones más populares que representan 
              la perfecta fusión de culturas
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <Card className="shadow-elegant hover:shadow-golden transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <img 
                      src={fusionDosa} 
                      alt="Dosa Fusion" 
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div>
                      <h3 className="text-xl font-display font-semibold text-card-foreground mb-2">
                        Dosa Ibérico
                      </h3>
                      <p className="text-muted-foreground mb-2">
                        Dosa tradicional relleno de jamón ibérico, queso manchego 
                        y chutney de pimiento del piquillo
                      </p>
                      <div className="flex items-center space-x-2">
                        <div className="flex text-golden">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-current" />
                          ))}
                        </div>
                        <span className="text-2xl font-bold text-golden">18€</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-elegant hover:shadow-golden transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <img 
                      src={curryPaella} 
                      alt="Curry Paella" 
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div>
                      <h3 className="text-xl font-display font-semibold text-card-foreground mb-2">
                        Paella Curry
                      </h3>
                      <p className="text-muted-foreground mb-2">
                        Arroz basmati con azafrán, mariscos del Mediterráneo 
                        y especias de Mumbai
                      </p>
                      <div className="flex items-center space-x-2">
                        <div className="flex text-golden">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-current" />
                          ))}
                        </div>
                        <span className="text-2xl font-bold text-golden">24€</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="text-center md:text-left">
              <h3 className="text-3xl font-display font-bold text-card-foreground mb-6">
                Sabores que Cuentan Historias
              </h3>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Cada plato en Casa de Dosa es una narración culinaria que conecta 
                dos mundos gastronómicos. Nuestros chefs combinan técnicas milenarias 
                de la cocina india con ingredientes frescos y de proximidad españoles.
              </p>
              <Button asChild size="lg" className="bg-gradient-golden hover:opacity-90">
                <Link to="/menu">
                  Explorar Todo el Menú
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
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
    </div>
  );
};

export default Home;