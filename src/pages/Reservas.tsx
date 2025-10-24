import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, Users, Phone, Mail, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Reservas = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [availableSpots, setAvailableSpots] = useState<{ morning: number; evening: number } | null>(null);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Basic check for Sunday evening
      const selectedDate = new Date(formData.date + 'T00:00:00'); // Ensure date is parsed correctly
      const selectedDay = selectedDate.getDay(); // 0 for Sunday, 1 for Monday, etc.
      const selectedHour = parseInt(formData.time.split(':')[0]);

      if (selectedDay === 0 && selectedHour >= 17) { // Sunday and time is 17:00 or later
          toast({
              title: "Horario no disponible",
              description: "Lo sentimos, el restaurante cierra los domingos por la tarde a partir de las 16:30.",
              variant: "destructive",
          });
          setIsLoading(false);
          return;
      }


      const { error } = await supabase.functions.invoke('send-reservation-email', {
        body: formData
      });

      if (error) {
        // Check if error message contains availability info
        if (error.message?.includes('No hay suficiente capacidad')) {
          throw new Error(error.message);
        }
        throw error;
      }

      setIsSubmitted(true);
      toast({
        title: "¡Reserva Confirmada!",
        description: "Hemos recibido tu reserva. Te contactaremos pronto para confirmar.",
      });
    } catch (error: any) {
      console.error("Error al enviar la reserva:", error);
      toast({
        title: "Error",
        description: error.message || "No se pudo procesar la reserva. Por favor, intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Reset time if date changes, to re-evaluate available times
    if (field === 'date') {
      setFormData(prev => ({ ...prev, time: "" }));
    }
  };

  // Check availability when date changes
  useEffect(() => {
    const checkAvailability = async () => {
      if (!formData.date) {
        setAvailableSpots(null);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('reservations')
          .select('guests, session')
          .eq('date', formData.date)
          .neq('status', 'cancelled');

        if (error) throw error;

        const morningGuests = data
          ?.filter(r => r.session === 'morning')
          .reduce((sum, r) => sum + r.guests, 0) || 0;

        const eveningGuests = data
          ?.filter(r => r.session === 'evening')
          .reduce((sum, r) => sum + r.guests, 0) || 0;

        // Restaurant capacity is 30 per session
        const morningCapacity = 30;
        const eveningCapacity = 30;

        setAvailableSpots({
          morning: morningCapacity - morningGuests,
          evening: eveningCapacity - eveningGuests
        });
      } catch (error) {
        console.error("Error checking availability:", error);
        setAvailableSpots(null); // Reset on error
      }
    };

    checkAvailability();
  }, [formData.date]);

  // Determine available times based on selected date
  const getAvailableTimes = () => {
    const allTimes = [
      "10:00", "10:30", "11:00", "11:30", "12:00", "12:30",
      "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00",
      "19:30", "20:00", "20:30", "21:00", "21:30", "22:00", "22:30",
      "23:00", "23:30"
    ];

    if (!formData.date) return allTimes; // Return all times if no date is selected

    try {
        const selectedDate = new Date(formData.date + 'T00:00:00'); // Ensure correct date parsing, avoid timezone issues
        const dayOfWeek = selectedDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

        if (dayOfWeek === 0) { // Sunday
          // Only allow times up to 16:00 on Sundays
          return allTimes.filter(time => {
            const hour = parseInt(time.split(':')[0]);
            return hour < 17; // Allows up to 16:30 which starts at 16
          });
        }

        return allTimes; // Return all times for other days
     } catch (e) {
         console.error("Error parsing date for time filtering:", e);
         return allTimes; // Fallback to all times on error
     }
  };

  const availableTimes = getAvailableTimes();


  if (isSubmitted) {
    return (
      <div className="min-h-screen py-20">
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
                onClick={() => {
                  setIsSubmitted(false);
                  // Reset form data for a new reservation
                  setFormData({ name: "", email: "", phone: "", date: "", time: "", guests: "", requests: ""});
                  setAvailableSpots(null);
                }}
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
    <div className="min-h-screen py-20">
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
                        min={new Date().toISOString().split('T')[0]} // Prevent past dates
                      />
                      {availableSpots && formData.date && (
                        <div className="text-xs space-y-1 mt-2">
                          <div className="flex items-center justify-between p-2 bg-muted rounded">
                            <span>Mañana (10:00-16:30)</span>
                            <span className={availableSpots.morning < 10 ? "text-red-500 font-semibold" : "text-green-600 font-semibold"}>
                              {availableSpots.morning < 0 ? 0 : availableSpots.morning} plazas
                            </span>
                          </div>
                          { new Date(formData.date + 'T00:00:00').getDay() !== 0 && ( // Hide evening availability on Sunday
                            <div className="flex items-center justify-between p-2 bg-muted rounded">
                              <span>Tarde (19:30-00:00)</span>
                              <span className={availableSpots.evening < 10 ? "text-red-500 font-semibold" : "text-green-600 font-semibold"}>
                                {availableSpots.evening < 0 ? 0 : availableSpots.evening} plazas
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                      {!formData.date && (
                           <p className="text-xs text-muted-foreground mt-1">Selecciona una fecha para ver la disponibilidad y las horas.</p>
                       )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="time">Hora *</Label>
                      <Select
                        onValueChange={(value) => handleInputChange("time", value)}
                        value={formData.time}
                        disabled={!formData.date} // Disable time until date is selected
                        required
                       >
                        <SelectTrigger>
                          <SelectValue placeholder={!formData.date ? "Selecciona fecha primero" : "Selecciona hora"} />
                        </SelectTrigger>
                        <SelectContent>
                          {availableTimes.length > 0 ? (
                            availableTimes.map((time) => (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            ))
                           ) : (
                             <SelectItem value="no-times" disabled>
                               No hay horas disponibles
                              </SelectItem>
                            )}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="guests">Comensales *</Label>
                      <Select
                        onValueChange={(value) => handleInputChange("guests", value)}
                        value={formData.guests}
                        required
                        >
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
                    disabled={isLoading || !formData.date || !formData.time || !formData.guests} // Also disable if required fields are missing
                    className="w-full bg-gradient-golden hover:opacity-90 text-blue-grey-dark font-semibold"
                  >
                    {isLoading ? "Enviando..." : "Confirmar Reserva"}
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
                  <h4 className="font-semibold text-foreground">Lunes a Sábado</h4>
                  <p className="text-muted-foreground">10:00 - 16:30</p>
                  <p className="text-muted-foreground">19:30 - 00:00</p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Domingo</h4>
                  <p className="text-muted-foreground">10:00 - 16:30</p>
                  <p className="text-muted-foreground text-sm italic">*Tarde cerrado</p>
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
                  <a href="tel:983642392" className="text-muted-foreground hover:text-golden">983 64 23 92</a>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-golden" />
                   <a href="mailto:reservas@casadedosa.com" className="text-muted-foreground hover:text-golden break-all">reservas@casadedosa.com</a>
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
                <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-5">
                  <li>Capacidad máxima por sesión: 30 comensales (Mañana: 10:00-16:30, Tarde: 19:30-00:00, excepto domingos tarde).</li>
                  <li>Las reservas se guardan durante 15 minutos.</li>
                  <li>Agradecemos cancelaciones con 24 horas de antelación.</li>
                  <li>Grupos de más de 10 personas requieren confirmación telefónica o por email.</li>
                  <li>No se admiten mascotas en el interior.</li>
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
