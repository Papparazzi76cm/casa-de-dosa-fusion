import { Card, CardContent } from "@/components/ui/card";
import { Heart, Users, Award, Utensils } from "lucide-react";
import restaurantInterior from "@/assets/restaurant-interior.jpg";

const SobreNosotros = () => {
  return (
    <div className="min-h-screen bg-background py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-display font-bold text-foreground mb-6">
            Sobre <span className="text-golden">Nosotros</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Una historia de pasión culinaria que conecta dos mundos gastronómicos 
            en una experiencia única e inolvidable
          </p>
        </div>

        {/* Historia */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-4xl font-display font-bold text-foreground mb-6">
              Nuestra Historia
            </h2>
            <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
              <p>
                Casa de Dosa nació de un sueño compartido entre dos culturas gastronómicas 
                extraordinarias. Nuestro chef fundador, formado en las tradiciones culinarias 
                de Mumbai y perfeccionado en las cocinas de Barcelona, decidió crear un espacio 
                donde la esencia de la India se encontrara con la pasión española por la comida.
              </p>
              <p>
                Desde 2018, hemos estado explorando las infinitas posibilidades que surgen 
                cuando las especias milenarias de la India se combinan con los ingredientes 
                frescos y de proximidad que caracterizan la gastronomía española.
              </p>
              <p>
                Cada plato cuenta una historia, cada sabor es un puente entre culturas, 
                y cada visita es una oportunidad de descubrir algo nuevo y emocionante.
              </p>
            </div>
          </div>
          <div className="relative">
            <img
              src={restaurantInterior}
              alt="Interior del restaurante Casa de Dosa"
              className="rounded-lg shadow-elegant w-full h-96 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-elegant rounded-lg opacity-20"></div>
          </div>
        </div>

        {/* Valores */}
        <div className="mb-20">
          <h2 className="text-4xl font-display font-bold text-foreground text-center mb-12">
            Nuestros Valores
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="shadow-elegant hover:shadow-golden transition-all duration-300 text-center">
              <CardContent className="p-8">
                <Heart className="h-12 w-12 text-golden mx-auto mb-4" />
                <h3 className="text-xl font-display font-semibold text-foreground mb-3">
                  Pasión
                </h3>
                <p className="text-muted-foreground">
                  Cada plato se prepara con amor y dedicación, honrando las tradiciones 
                  de ambas culturas.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-elegant hover:shadow-golden transition-all duration-300 text-center">
              <CardContent className="p-8">
                <Utensils className="h-12 w-12 text-golden mx-auto mb-4" />
                <h3 className="text-xl font-display font-semibold text-foreground mb-3">
                  Calidad
                </h3>
                <p className="text-muted-foreground">
                  Utilizamos solo los mejores ingredientes, frescos y de temporada, 
                  seleccionados cuidadosamente.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-elegant hover:shadow-golden transition-all duration-300 text-center">
              <CardContent className="p-8">
                <Users className="h-12 w-12 text-golden mx-auto mb-4" />
                <h3 className="text-xl font-display font-semibold text-foreground mb-3">
                  Comunidad
                </h3>
                <p className="text-muted-foreground">
                  Creamos un espacio acogedor donde las familias y amigos pueden 
                  compartir momentos especiales.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-elegant hover:shadow-golden transition-all duration-300 text-center">
              <CardContent className="p-8">
                <Award className="h-12 w-12 text-golden mx-auto mb-4" />
                <h3 className="text-xl font-display font-semibold text-foreground mb-3">
                  Innovación
                </h3>
                <p className="text-muted-foreground">
                  Constantemente exploramos nuevas formas de fusionar sabores 
                  y crear experiencias únicas.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Filosofía Culinaria */}
        <div className="bg-gradient-elegant rounded-lg p-12 text-white text-center">
          <h2 className="text-4xl font-display font-bold mb-6">
            Nuestra Filosofía Culinaria
          </h2>
          <p className="text-xl mb-8 max-w-4xl mx-auto leading-relaxed opacity-90">
            "La cocina es el lenguaje universal que une culturas. En Casa de Dosa, 
            creemos que la verdadera magia ocurre cuando respetamos las tradiciones 
            mientras abramos nuestros corazones a la innovación."
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <h3 className="text-2xl font-display font-semibold text-golden mb-3">
                Tradición
              </h3>
              <p className="text-blue-grey-light">
                Honramos las técnicas ancestrales de la cocina india y española
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-display font-semibold text-golden mb-3">
                Fusión
              </h3>
              <p className="text-blue-grey-light">
                Creamos armonías gastronómicas que sorprenden y deleitan
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-display font-semibold text-golden mb-3">
                Experiencia
              </h3>
              <p className="text-blue-grey-light">
                Cada visita es un viaje sensorial a través de dos culturas
              </p>
            </div>
          </div>
        </div>

        {/* Equipo */}
        <div className="mt-20">
          <h2 className="text-4xl font-display font-bold text-foreground text-center mb-12">
            Nuestro Equipo
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="shadow-elegant text-center">
              <CardContent className="p-8">
                <div className="w-24 h-24 bg-gradient-golden rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-blue-grey-dark">AR</span>
                </div>
                <h3 className="text-xl font-display font-semibold text-foreground mb-2">
                  Arjun Rodríguez
                </h3>
                <p className="text-golden font-medium mb-3">Chef Ejecutivo</p>
                <p className="text-muted-foreground text-sm">
                  Formado en Mumbai y Barcelona, Arjun es el visionario detrás 
                  de nuestra fusión culinaria única.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-elegant text-center">
              <CardContent className="p-8">
                <div className="w-24 h-24 bg-gradient-golden rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-blue-grey-dark">MG</span>
                </div>
                <h3 className="text-xl font-display font-semibold text-foreground mb-2">
                  María García
                </h3>
                <p className="text-golden font-medium mb-3">Sommelier</p>
                <p className="text-muted-foreground text-sm">
                  Experta en maridajes únicos que complementan perfectamente 
                  nuestros platos de fusión.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-elegant text-center">
              <CardContent className="p-8">
                <div className="w-24 h-24 bg-gradient-golden rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-blue-grey-dark">DM</span>
                </div>
                <h3 className="text-xl font-display font-semibold text-foreground mb-2">
                  David Martín
                </h3>
                <p className="text-golden font-medium mb-3">Gerente</p>
                <p className="text-muted-foreground text-sm">
                  Asegura que cada visita a Casa de Dosa sea una experiencia 
                  memorable y acogedora.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SobreNosotros;