import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, Users, Phone, Mail, CheckCircle, AlertTriangle, Loader2, Info } from "lucide-react"; // Added AlertTriangle, Loader2, Info
import { useToast } from "@/hooks/use-toast";
// Attempting alias path again as per tsconfig/vite config
import { supabase } from "@/integrations/supabase/client";
import { format, parseISO, isBefore, startOfDay } from 'date-fns';
import { es } from 'date-fns/locale';

interface BlockedSlot {
  id: string;
  date: string; // YYYY-MM-DD
  session: 'morning' | 'evening';
}

const Reservas: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingAvailability, setIsLoadingAvailability] = useState(false); // Separate loading state for availability/blocks
  const [availableSpots, setAvailableSpots] = useState<{ morning: number; evening: number } | null>(null);
  const [blockedSlotsForDate, setBlockedSlotsForDate] = useState<BlockedSlot[]>([]); // Store blocks for the selected date
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

  // Fetch blocked slots for the selected date
  const fetchBlockedSlotsForDate = useCallback(async (date: string) => {
    if (!date) {
        setBlockedSlotsForDate([]);
        return;
    }
    setIsLoadingAvailability(true);
    try {
        const { data, error } = await supabase
            .from('blocked_slots')
            .select('*')
            .eq('date', date);

        if (error) throw error;
        setBlockedSlotsForDate(data || []);
    } catch (error: any) {
        console.error("Error fetching blocked slots for date:", error);
        setBlockedSlotsForDate([]); // Reset on error
    } finally {
        // Only set loading false if the availability check isn't also running
        if (!isLoadingAvailability) setIsLoadingAvailability(false);
    }
  }, [toast]); // Removed toast from dependencies as it's stable

  // Check general availability (spots) when date changes
  useEffect(() => {
    const checkAvailability = async () => {
      if (!formData.date) {
        setAvailableSpots(null);
        setBlockedSlotsForDate([]); // Also clear blocks if date is cleared
        return;
      }

      setIsLoadingAvailability(true); // Start loading for both checks
      await fetchBlockedSlotsForDate(formData.date); // Fetch blocks first

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

        const morningCapacity = 30;
        const eveningCapacity = 30;

        setAvailableSpots({
          morning: morningCapacity - morningGuests,
          evening: eveningCapacity - eveningGuests
        });
      } catch (error) {
        console.error("Error checking availability:", error);
        setAvailableSpots(null); // Reset on error
      } finally {
         // Loading finishes after both checks (availability and blocks)
         setIsLoadingAvailability(false);
      }
    };

    checkAvailability();
  }, [formData.date, fetchBlockedSlotsForDate]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Client-side check for blocked slot before submitting
      const selectedHour = parseInt(formData.time.split(':')[0]);
      const session = selectedHour < 17 ? 'morning' : 'evening';
      const isSessionBlocked = blockedSlotsForDate.some(slot => slot.session === session);

      const selectedDate = parseISO(formData.date);
      const isSunday = selectedDate.getDay() === 0;

      if (isSessionBlocked || (isSunday && session === 'evening')) {
          toast({
              title: "Sesión no disponible",
              description: `Lo sentimos, la sesión de ${session === 'morning' ? 'mañana' : 'tarde'} para el ${formData.date} está bloqueada o no disponible.`,
              variant: "destructive",
          });
          setIsLoading(false);
          return; // Stop submission
      }


      // Basic check for Sunday evening (redundant if getAvailableTimes is correct, but good failsafe)
      if (isSunday && selectedHour >= 17) {
          toast({
              title: "Horario no disponible",
              description: "Lo sentimos, el restaurante cierra los domingos por la tarde a partir de las 16:30.",
              variant: "destructive",
          });
          setIsLoading(false);
          return;
      }


      const { error, data } = await supabase.functions.invoke('send-reservation-email', {
        body: formData
      });

      // Handle specific error from the function (e.g., capacity reached just before submitting)
      if (error || (data && data.error)) {
        const errorMessage = (data?.error) || error?.message || "Error desconocido";
        if (errorMessage.includes('No hay suficiente capacidad')) {
          // Re-fetch availability to show updated spots
          await fetchBlockedSlotsForDate(formData.date); // Need availability check too potentially
          // Refetch both
           setIsLoadingAvailability(true);
           await Promise.all([
               fetchBlockedSlotsForDate(formData.date),
               // Add refetch for availableSpots if needed or rely on useEffect
           ]).finally(() => setIsLoadingAvailability(false));
          throw new Error(errorMessage); // Throw to be caught below
        }
        throw new Error(errorMessage); // Throw other function errors
      }


      setIsSubmitted(true);
      toast({
        title: "¡Reserva Recibida!",
        description: "Hemos recibido tu solicitud. Te enviaremos un email de confirmación.",
        variant: "default" // Use default variant for success
      });
      // Reset form after successful submission
       setFormData({ name: "", email: "", phone: "", date: "", time: "", guests: "", requests: ""});
       setAvailableSpots(null);
       setBlockedSlotsForDate([]);


    } catch (error: any) {
      console.error("Error al enviar la reserva:", error);
      toast({
        title: "Error al Reservar",
        description: error.message || "No se pudo procesar la reserva. Por favor, revisa la disponibilidad o contacta con nosotros.",
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
        const today = startOfDay(new Date());
         try {
            const selected = startOfDay(parseISO(value));
            if (isBefore(selected, today)) {
                 toast({ title: "Fecha inválida", description: "No puedes seleccionar una fecha pasada.", variant: "destructive" });
                 setFormData(prev => ({ ...prev, date: "", time: "" })); // Clear invalid date and time
                 setAvailableSpots(null);
                 setBlockedSlotsForDate([]);
            } else {
                setFormData(prev => ({ ...prev, time: "" })); // Clear time when date changes
                setAvailableSpots(null); // Clear availability until checked
                setBlockedSlotsForDate([]); // Clear blocks until checked
            }
        } catch (e) {
             console.error("Invalid date selected:", value, e);
             toast({ title: "Fecha inválida", description: "El formato de fecha no es correcto.", variant: "destructive" });
             setFormData(prev => ({ ...prev, date: "", time: "" }));
             setAvailableSpots(null);
             setBlockedSlotsForDate([]);
        }
    }
  };


  // Determine available times based on selected date and blocked slots
  const getAvailableTimes = useCallback((): string[] => {
    const allTimes = [
      "10:00", "10:30", "11:00", "11:30", "12:00", "12:30",
      "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", // Last morning slot starts at 16:00
      "19:30", "20:00", "20:30", "21:00", "21:30", "22:00", "22:30",
      "23:00", "23:30" // Last evening slot starts at 23:30
    ];

    if (!formData.date) return []; // No times if no date selected

    try {
        const selectedDate = parseISO(formData.date);
        const dayOfWeek = selectedDate.getDay(); // 0 = Sunday

        const isMorningBlocked = blockedSlotsForDate.some(slot => slot.session === 'morning');
        const isEveningBlocked = blockedSlotsForDate.some(slot => slot.session === 'evening');

        return allTimes.filter(time => {
          const hour = parseInt(time.split(':')[0]);
          const session = hour < 17 ? 'morning' : 'evening';

          // Check against blocked slots
          if (session === 'morning' && isMorningBlocked) return false;
          if (session === 'evening' && isEveningBlocked) return false;

          // Check Sunday rule
          if (dayOfWeek === 0 && session === 'evening') {
            return false; // No evening times on Sunday
          }

          return true; // Time is available
        });
     } catch (e) {
         console.error("Error parsing date for time filtering:", e);
         return []; // Return no times on error
     }
  }, [formData.date, blockedSlotsForDate]);

  const availableTimes = getAvailableTimes();


  if (isSubmitted) {
    // Keep the success message simple as form is reset
    return (
      <div className="min-h-screen py-20 flex items-center justify-center">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="shadow-elegant text-center">
            <CardContent className="p-12">
              <CheckCircle className="h-20 w-20 text-golden mx-auto mb-6" />
              <h1 className="text-4xl font-display font-bold text-foreground mb-4">
                ¡Solicitud Recibida!
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Gracias por elegir Casa de Dosa. Hemos recibido tu solicitud de reserva.
                Recibirás un email de confirmación en breve.
              </p>
              <Button
                onClick={() => setIsSubmitted(false)} // No need to reset form here, already done on submit
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

  // Determine if the currently selected time corresponds to a blocked session
  const isSelectedTimeBlocked = () => {
      if (!formData.time || !formData.date) return false;
      try {
          const selectedHour = parseInt(formData.time.split(':')[0]);
          const session = selectedHour < 17 ? 'morning' : 'evening';
          const isSessionBlocked = blockedSlotsForDate.some(slot => slot.session === session);
          const isSunday = parseISO(formData.date).getDay() === 0;
          return isSessionBlocked || (isSunday && session === 'evening');
      } catch(e) {
          console.error("Error checking if selected time is blocked:", e);
          return true; // Assume blocked if error occurs
      }
  };


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
                        className="text-base md:text-sm" // Ensure consistent text size
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
                        className="text-base md:text-sm"
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
                      className="text-base md:text-sm"
                    />
                  </div>

                  {/* Detalles de la Reserva */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start"> {/* Use items-start */}
                     <div className="space-y-2">
                      <Label htmlFor="date"><Calendar className="inline h-4 w-4 mr-1"/>Fecha *</Label>
                      <Input
                        id="date"
                        type="date"
                        required
                        value={formData.date}
                        onChange={(e) => handleInputChange("date", e.target.value)}
                        min={format(new Date(), 'yyyy-MM-dd')} // Prevent past dates dynamically
                        className="text-base md:text-sm"
                      />
                       {/* Availability/Block Info */}
                        {isLoadingAvailability && formData.date && (
                             <div className="text-xs text-muted-foreground mt-2 flex items-center">
                                 <Loader2 className="h-3 w-3 animate-spin mr-1" /> Comprobando disponibilidad...
                             </div>
                        )}
                       {!isLoadingAvailability && availableSpots && formData.date && (
                        <div className="text-xs space-y-1 mt-2 p-2 bg-muted rounded border border-border">
                          <h4 className="font-semibold mb-1 text-foreground">Disponibilidad:</h4>
                          {/* Morning */}
                          <div className={`flex items-center justify-between ${blockedSlotsForDate.some(s => s.session === 'morning') ? 'opacity-50' : ''}`}>
                            <span>Mañana (10-16:30):</span>
                            {blockedSlotsForDate.some(s => s.session === 'morning') ? (
                                <span className="font-semibold text-red-600 flex items-center"><Lock className="h-3 w-3 mr-1"/>Bloqueado</span>
                            ) : (
                                <span className={availableSpots.morning <= 0 ? "text-red-600 font-semibold" : "text-green-600 font-semibold"}>
                                  {availableSpots.morning < 0 ? 0 : availableSpots.morning} plazas
                                </span>
                            )}
                          </div>
                          {/* Evening (hide if Sunday or blocked) */}
                           { formData.date && parseISO(formData.date).getDay() !== 0 && (
                                <div className={`flex items-center justify-between ${blockedSlotsForDate.some(s => s.session === 'evening') ? 'opacity-50' : ''}`}>
                                    <span>Tarde (19:30-00):</span>
                                    {blockedSlotsForDate.some(s => s.session === 'evening') ? (
                                        <span className="font-semibold text-red-600 flex items-center"><Lock className="h-3 w-3 mr-1"/>Bloqueado</span>
                                    ) : (
                                        <span className={availableSpots.evening <= 0 ? "text-red-600 font-semibold" : "text-green-600 font-semibold"}>
                                        {availableSpots.evening < 0 ? 0 : availableSpots.evening} plazas
                                        </span>
                                    )}
                                </div>
                            )}
                            {/* Sunday Evening Notice */}
                            { formData.date && parseISO(formData.date).getDay() === 0 && (
                                <div className="flex items-center justify-between opacity-70">
                                    <span>Tarde (19:30-00):</span>
                                    <span className="font-semibold text-red-600 flex items-center"><Lock className="h-3 w-3 mr-1"/>Cerrado</span>
                                </div>
                            )}
                        </div>
                       )}
                       {!formData.date && (
                           <p className="text-xs text-muted-foreground mt-1">Selecciona una fecha.</p>
                       )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="time"><Clock className="inline h-4 w-4 mr-1"/>Hora *</Label>
                      <Select
                        onValueChange={(value) => handleInputChange("time", value)}
                        value={formData.time}
                        disabled={!formData.date || isLoadingAvailability || availableTimes.length === 0}
                        required
                       >
                        <SelectTrigger className="text-base md:text-sm">
                           <SelectValue placeholder={!formData.date ? "Selecciona fecha" : (isLoadingAvailability ? "Cargando..." : (availableTimes.length === 0 ? "No disponible" : "Selecciona hora"))} />
                        </SelectTrigger>
                        <SelectContent>
                          {availableTimes.map((time) => (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            ))}
                           {formData.date && !isLoadingAvailability && availableTimes.length === 0 && (
                               <SelectItem value="no-times" disabled>No hay horas disponibles</SelectItem>
                           )}
                        </SelectContent>
                      </Select>
                       {isSelectedTimeBlocked() && (
                            <p className="text-xs text-red-600 mt-1 flex items-center">
                                <AlertTriangle className="h-3 w-3 mr-1"/> Esta sesión está bloqueada.
                            </p>
                        )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="guests"><Users className="inline h-4 w-4 mr-1"/>Comensales *</Label>
                      <Select
                        onValueChange={(value) => handleInputChange("guests", value)}
                        value={formData.guests}
                        required
                        >
                        <SelectTrigger className="text-base md:text-sm">
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
                    <Label htmlFor="requests">Peticiones Especiales (opcional)</Label>
                    <Textarea
                      id="requests"
                      value={formData.requests}
                      onChange={(e) => handleInputChange("requests", e.target.value)}
                      placeholder="Alergias, dietas, tronas, celebraciones..."
                      rows={3}
                      className="text-base md:text-sm"
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    disabled={isLoading || isLoadingAvailability || !formData.date || !formData.time || !formData.guests || isSelectedTimeBlocked()}
                    className="w-full bg-gradient-golden hover:opacity-90 text-blue-grey-dark font-semibold text-base md:text-sm"
                  >
                    {isLoading ? <Loader2 className="h-5 w-5 animate-spin mr-2"/> : null}
                    {isLoading ? "Enviando..." : "Confirmar Reserva"}
                  </Button>
                  {/* Message indicating why button might be disabled */}
                   {(!formData.date || !formData.time || !formData.guests) && (
                       <p className="text-xs text-center text-muted-foreground mt-2">Por favor, completa todos los campos requeridos (*).</p>
                   )}
                    {isSelectedTimeBlocked() && !isLoading && !isLoadingAvailability && (
                       <p className="text-xs text-center text-red-600 mt-2">La hora seleccionada corresponde a una sesión bloqueada o no disponible.</p>
                   )}
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Información Adicional */}
          <div className="space-y-6">
            {/* Horarios */}
            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle className="text-xl font-display text-foreground flex items-center">
                  <Clock className="h-5 w-5 text-golden mr-2" />
                  Horarios
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm md:text-base">
                <div>
                  <h4 className="font-semibold text-foreground">Lunes a Sábado</h4>
                  <p className="text-muted-foreground">Mañana: 10:00 - 16:30</p>
                  <p className="text-muted-foreground">Tarde: 19:30 - 00:00</p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Domingo</h4>
                  <p className="text-muted-foreground">Mañana: 10:00 - 16:30</p>
                  <p className="text-muted-foreground text-sm italic">*Tarde cerrado</p>
                </div>
                 <p className="text-xs text-muted-foreground pt-2 border-t mt-3">
                    Última admisión para comidas: 16:00. Última admisión para cenas: 23:30.
                 </p>
              </CardContent>
            </Card>

            {/* Contacto */}
            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle className="text-xl font-display text-foreground flex items-center">
                  <Phone className="h-5 w-5 text-golden mr-2" />
                  Contacto Directo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm md:text-base">
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-golden flex-shrink-0" />
                  <a href="tel:983642392" className="text-muted-foreground hover:text-golden">983 64 23 92</a>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-golden flex-shrink-0" />
                   <a href="mailto:reservas@casadedosa.com" className="text-muted-foreground hover:text-golden break-all">reservas@casadedosa.com</a>
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  Para reservas de más de 10 personas o eventos especiales,
                  por favor contacta directamente.
                </p>
              </CardContent>
            </Card>

            {/* Política */}
            <Card className="shadow-elegant bg-blue-grey-dark text-blue-grey-light">
              <CardHeader>
                <CardTitle className="text-xl font-display text-golden flex items-center">
                  <Info className="h-5 w-5 text-golden mr-2" />
                  Información Importante
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-2 list-disc pl-5">
                  <li>Capacidad máxima por sesión: 30 comensales.</li>
                  <li>Las reservas se guardan 15 minutos.</li>
                  <li>Agradecemos cancelaciones con 24h de antelación.</li>
                  {/* Corrected JSX syntax for > */}
                  <li>Grupos {' > '}10 personas requieren confirmación directa.</li>
                  <li>No se admiten mascotas en el interior.</li>
                   <li>La cocina cierra 30 minutos antes del cierre del restaurante.</li>
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
