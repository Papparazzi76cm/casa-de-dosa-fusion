import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Clock, Instagram, Facebook, Twitter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Contacto = () => {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Mensaje Enviado",
      description: "Gracias por contactarnos. Te responderemos pronto.",
    });
  };

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-display font-bold text-foreground mb-6">
            <span className="text-golden">Contacto</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Estamos aquí para ayudarte. Contáctanos para reservas, consultas 
            o cualquier información que necesites
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Información de Contacto */}
          <div className="space-y-8">
            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle className="text-2xl font-display text-foreground flex items-center">
                  <MapPin className="h-6 w-6 text-golden mr-3" />
                  Ubicación
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-muted-foreground mb-4">
                  Paseo de Zorrilla 23<br />
                  47007 Valladolid, España
                </p>
                <p className="text-muted-foreground">
                  Ubicados en el corazón de Valladolid, fácilmente accesible en 
                  transporte público y con parking cercano.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle className="text-2xl font-display text-foreground flex items-center">
                  <Phone className="h-6 w-6 text-golden mr-3" />
                  Teléfono
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-muted-foreground mb-2">
                  983 64 23 92
                </p>
                <a
                  href="https://wa.me/34642357876?text=%C2%A1Hola!%20Me%20gustar%C3%ADa%20hacer%20una%20reserva%20en%20Casa%20de%20Dosa%20%F0%9F%8D%BD%EF%B8%8F"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-2 mb-3 px-4 py-2 rounded-full bg-[#25D366] hover:bg-[#1ebe57] text-white text-sm font-medium transition-colors"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  WhatsApp: 642 357 876
                </a>
                <p className="text-muted-foreground">
                  Lunes a Sábado: 10:00 - 16:30, 19:30 - 00:00<br />
                  Domingo: 10:00 - 16:30<br />
                  Para reservas y consultas generales
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle className="text-2xl font-display text-foreground flex items-center">
                  <Mail className="h-6 w-6 text-golden mr-3" />
                  Email
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="font-medium text-foreground">Reservas y General</p>
                    <p className="text-muted-foreground">reservas@casadedosa.com</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle className="text-2xl font-display text-foreground flex items-center">
                  <Clock className="h-6 w-6 text-golden mr-3" />
                  Horarios
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium text-foreground">Lunes - Sábado</span>
                    <span className="text-muted-foreground">10:00 - 16:30</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-foreground"></span>
                    <span className="text-muted-foreground">19:30 - 00:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-foreground">Domingo</span>
                    <span className="text-muted-foreground">10:00 - 16:30</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-4">
                    * Última entrada para almuerzo: 16:00<br />
                    * Última entrada para cena: 23:30 (Lun-Sáb)
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Redes Sociales */}
            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle className="text-2xl font-display text-foreground">
                  Síguenos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4">
                  <a 
                    href="#" 
                    className="flex items-center justify-center w-12 h-12 bg-gradient-golden rounded-full text-blue-grey-dark hover:opacity-80 transition-opacity"
                  >
                    <Instagram className="h-6 w-6" />
                  </a>
                  <a 
                    href="#" 
                    className="flex items-center justify-center w-12 h-12 bg-gradient-golden rounded-full text-blue-grey-dark hover:opacity-80 transition-opacity"
                  >
                    <Facebook className="h-6 w-6" />
                  </a>
                  <a 
                    href="#" 
                    className="flex items-center justify-center w-12 h-12 bg-gradient-golden rounded-full text-blue-grey-dark hover:opacity-80 transition-opacity"
                  >
                    <Twitter className="h-6 w-6" />
                  </a>
                </div>
                <p className="text-muted-foreground mt-4">
                  Mantente al día con nuestras últimas creaciones culinarias 
                  y eventos especiales.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Formulario de Contacto */}
          <div>
            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle className="text-2xl font-display text-foreground">
                  Envíanos un Mensaje
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Nombre *</Label>
                      <Input
                        id="firstName"
                        type="text"
                        required
                        placeholder="Tu nombre"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Apellidos *</Label>
                      <Input
                        id="lastName"
                        type="text"
                        required
                        placeholder="Tus apellidos"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      placeholder="tu@email.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+34 600 000 000"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Asunto *</Label>
                    <Input
                      id="subject"
                      type="text"
                      required
                      placeholder="¿En qué podemos ayudarte?"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Mensaje *</Label>
                    <Textarea
                      id="message"
                      required
                      rows={5}
                      placeholder="Escribe tu mensaje aquí..."
                    />
                  </div>

                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full bg-gradient-golden hover:opacity-90 text-blue-grey-dark font-semibold"
                  >
                    Enviar Mensaje
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Mapa */}
            <Card className="shadow-elegant mt-8">
              <CardHeader>
                <CardTitle className="text-2xl font-display text-foreground">
                  Cómo Llegar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg overflow-hidden h-64 shadow-elegant">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2981.6206085486256!2d-4.738958023447393!3d41.642331380142046!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd476de06e03a9c5%3A0xbc60a71328f15b10!2sCasa%20De%20Dosa!5e0!3m2!1ses!2ses!4v1758300230056!5m2!1ses!2ses"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Ubicación de Casa de Dosa - Paseo de Zorrilla 23, Valladolid"
                  ></iframe>
                </div>
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-golden mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Paseo de Zorrilla 23, Valladolid
                    </p>
                  </div>
                <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                  <p><strong>Autobús:</strong> Líneas urbanas cercanas</p>
                  <p><strong>Tren:</strong> Estación Valladolid Campo Grande (10 min)</p>
                  <p><strong>Parking:</strong> Parking público disponible</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contacto;
