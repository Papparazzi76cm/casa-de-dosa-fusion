import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, Users, Phone, Mail, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Reservas = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    guests: "",
    requests: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitted(true);
      toast({
        title: "¡Reserva Confirmada!",
        description: "Hemos recibido tu reserva. Te contactaremos pronto para confirmar.",
      });
    }, 1000);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="shadow-elegant text-center">
            <CardContent className="p-12">
              <CheckCircle className="h-20 w-20 text-golden mx-auto mb-6" />
              <h1 className="text-4xl font-display font-bold text-foreground mb-4">
                ¡Reserva Confirmada!
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Gracias por elegir Casa de Dosa. Hemos recibido tu reserva y te 
                contactaremos pronto para confirmar todos los detalles.
              </p>
              <div className="bg-muted rounded-lg p-6 mb-8">
                <h3 className="font-semibold text-foreground mb-4">Detalles de tu reserva:</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Nombre:</span>
                    <span>{formData.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fecha:</span>
                    <span>{formData.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Hora:</span>
                    <span>{formData.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Comensales:</span>
                    <span>{formData.guests}</span>
                  </div>
                </div>
              </div>
              <Button 
                onClick={() => setIsSubmitted(false)}
                className="bg-gradient-golden hover:opacity-90"
              >
                Hacer Otra Reserva
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-display font-bold text-foreground mb-6">
            Reserva tu <span className="text-golden">Mesa</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Asegura tu lugar en Casa de Dosa y prepárate para una experiencia 
            gastronómica única que fusiona India y España
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulario de Reserva */}
          <div className="lg:col-span-2">
            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle className="text-2xl font-display text-foreground">
                  Información de Reserva
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Información Personal */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nombre Completo *</Label>
                      <Input
                        id="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder="Tu nombre completo"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="tu@email.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="+34 600 000 000"
                    />
                  </div>

                  {/* Detalles de la Reserva */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">Fecha *</Label>
                      <Input
                        id="date"
                        type="date"
                        required
                        value={formData.date}
                        onChange={(e) => handleInputChange("date", e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="time">Hora *</Label>
                      <Select onValueChange={(value) => handleInputChange("time", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona hora" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="13:00">13:00</SelectItem>
                          <SelectItem value="13:30">13:30</SelectItem>
                          <SelectItem value="14:00">14:00</SelectItem>
                          <SelectItem value="14:30">14:30</SelectItem>
                          <SelectItem value="15:00">15:00</SelectItem>
                          <SelectItem value="20:00">20:00</SelectItem>
                          <SelectItem value="20:30">20:30</SelectItem>
                          <SelectItem value="21:00">21:00</SelectItem>
                          <SelectItem value="21:30">21:30</SelectItem>
                          <SelectItem value="22:00">22:00</SelectItem>
                          <SelectItem value="22:30">22:30</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="guests">Comensales *</Label>
                      <Select onValueChange={(value) => handleInputChange("guests", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Nº personas" />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                            <SelectItem key={num} value={num.toString()}>
                              {num} {num === 1 ? "persona" : "personas"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="requests">Peticiones Especiales</Label>
                    <Textarea
                      id="requests"
                      value={formData.requests}
                      onChange={(e) => handleInputChange("requests", e.target.value)}
                      placeholder="Alergias, dietas especiales, celebraciones..."
                      rows={3}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full bg-gradient-golden hover:opacity-90 text-blue-grey-dark font-semibold"
                  >
                    Confirmar Reserva
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Información Adicional */}
          <div className="space-y-6">
            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle className="text-xl font-display text-foreground flex items-center">
                  <Clock className="h-5 w-5 text-golden mr-2" />
                  Horarios
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h4 className="font-semibold text-foreground">Almuerzo</h4>
                  <p className="text-muted-foreground">13:00 - 16:00</p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Cena</h4>
                  <p className="text-muted-foreground">20:00 - 00:00</p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Días</h4>
                  <p className="text-muted-foreground">Lunes a Domingo</p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle className="text-xl font-display text-foreground flex items-center">
                  <Phone className="h-5 w-5 text-golden mr-2" />
                  Contacto Directo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-golden" />
                  <span className="text-muted-foreground">+34 912 345 678</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-golden" />
                  <span className="text-muted-foreground">reservas@casadedosa.es</span>
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  Para reservas de más de 10 personas o eventos especiales, 
                  por favor contacta directamente.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle className="text-xl font-display text-foreground flex items-center">
                  <Users className="h-5 w-5 text-golden mr-2" />
                  Política de Reservas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Las reservas se mantienen 15 minutos</li>
                  <li>• Cancelaciones con 24h de antelación</li>
                  <li>• Grupos grandes requieren confirmación</li>
                  <li>• No permitimos mascotas</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reservas;