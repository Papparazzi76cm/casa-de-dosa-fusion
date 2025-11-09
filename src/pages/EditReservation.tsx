import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, Loader2, XCircle, Calendar, Clock, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const EditReservation = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [reservation, setReservation] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [availableSpots, setAvailableSpots] = useState<{ morning: number; evening: number } | null>(null);

  const [formData, setFormData] = useState({
    date: "",
    time: "",
    guests: "",
    requests: "",
  });

  useEffect(() => {
    const loadReservation = async () => {
      if (!token) {
        setError("Token inválido. El enlace de edición no es válido.");
        setLoading(false);
        return;
      }

      try {
        const { data, error: fetchError } = await supabase
          .from("reservations")
          .select("*")
          .eq("edit_token", token)
          .single();

        if (fetchError || !data) {
          setError("No se pudo encontrar la reserva asociada a este enlace.");
          setLoading(false);
          return;
        }

        // Check if token expired
        const expiresAt = new Date(data.token_expires_at);
        if (expiresAt < new Date()) {
          setError("El enlace de edición ha expirado (válido por 7 días). Por favor, contacta con nosotros: 983 64 23 92");
          setLoading(false);
          return;
        }

        // Check if cancelled
        if (data.status === "cancelled") {
          setError("Esta reserva ya fue cancelada y no puede ser editada.");
          setLoading(false);
          return;
        }

        setReservation(data);
        setFormData({
          date: data.date,
          time: data.time,
          guests: data.guests.toString(),
          requests: data.requests || "",
        });
      } catch (err: any) {
        setError("Hubo un error al cargar la reserva. Por favor, intenta de nuevo.");
      } finally {
        setLoading(false);
      }
    };

    loadReservation();
  }, [token]);

  // Check availability when date changes
  useEffect(() => {
    const checkAvailability = async () => {
      if (!formData.date || !reservation) {
        setAvailableSpots(null);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("reservations")
          .select("guests, session")
          .eq("date", formData.date)
          .neq("status", "cancelled")
          .neq("id", reservation.id); // Exclude current reservation

        if (error) throw error;

        const morningGuests = data?.filter(r => r.session === "morning").reduce((sum, r) => sum + r.guests, 0) || 0;
        const eveningGuests = data?.filter(r => r.session === "evening").reduce((sum, r) => sum + r.guests, 0) || 0;

        setAvailableSpots({
          morning: 30 - morningGuests,
          evening: 30 - eveningGuests,
        });
      } catch (error) {
        console.error("Error checking availability:", error);
        setAvailableSpots(null);
      }
    };

    checkAvailability();
  }, [formData.date, reservation]);

  const getAvailableTimes = () => {
    const allTimes = [
      "10:00", "10:30", "11:00", "11:30", "12:00", "12:30",
      "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00",
      "19:30", "20:00", "20:30", "21:00", "21:30", "22:00", "22:30",
      "23:00", "23:30"
    ];

    if (!formData.date) return allTimes;

    try {
      const selectedDate = new Date(formData.date + "T00:00:00");
      const dayOfWeek = selectedDate.getDay();

      if (dayOfWeek === 0) {
        // Sunday: only times up to 16:00
        return allTimes.filter(time => {
          const hour = parseInt(time.split(":")[0]);
          return hour < 17;
        });
      }

      return allTimes;
    } catch (e) {
      console.error("Error parsing date for time filtering:", e);
      return allTimes;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !reservation) return;

    setSaving(true);
    try {
      // Check Sunday evening restriction
      const selectedDate = new Date(formData.date + "T00:00:00");
      const selectedDay = selectedDate.getDay();
      const selectedHour = parseInt(formData.time.split(":")[0]);

      if (selectedDay === 0 && selectedHour >= 17) {
        toast({
          title: "Horario no disponible",
          description: "Lo sentimos, el restaurante cierra los domingos por la tarde a partir de las 16:30.",
          variant: "destructive",
        });
        setSaving(false);
        return;
      }

      // Determine session
      const session = selectedHour < 17 ? "morning" : "evening";

      // Check capacity
      const { data: existingReservations, error: queryError } = await supabase
        .from("reservations")
        .select("guests")
        .eq("date", formData.date)
        .eq("session", session)
        .neq("status", "cancelled")
        .neq("id", reservation.id);

      if (queryError) throw queryError;

      const totalGuests = existingReservations?.reduce((sum, r) => sum + r.guests, 0) || 0;
      const requestedGuests = parseInt(formData.guests);

      if (totalGuests + requestedGuests > 30) {
        const availableSpots = 30 - totalGuests;
        toast({
          title: "No hay suficiente capacidad",
          description: `Solo quedan ${availableSpots} plazas disponibles para esa fecha y sesión.`,
          variant: "destructive",
        });
        setSaving(false);
        return;
      }

      // Update reservation
      const { error: updateError } = await supabase
        .from("reservations")
        .update({
          date: formData.date,
          time: formData.time,
          guests: requestedGuests,
          session,
          requests: formData.requests || null,
        })
        .eq("id", reservation.id);

      if (updateError) throw updateError;

      setSuccess(true);
      setReservation({ ...reservation, ...formData, guests: requestedGuests, session });
      toast({
        title: "Reserva Actualizada",
        description: "Tu reserva ha sido modificada exitosamente.",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "No se pudo actualizar la reserva. Por favor, intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-20 flex items-center justify-center">
        <Card className="max-w-md w-full shadow-elegant">
          <CardContent className="p-12 text-center">
            <Loader2 className="h-16 w-16 text-golden mx-auto mb-4 animate-spin" />
            <p className="text-muted-foreground">Cargando información de la reserva...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="shadow-elegant text-center">
            <CardContent className="p-12">
              <XCircle className="h-20 w-20 text-destructive mx-auto mb-6" />
              <h1 className="text-4xl font-display font-bold text-foreground mb-4">
                Error
              </h1>
              <p className="text-lg text-muted-foreground mb-8">{error}</p>
              <div className="bg-muted rounded-lg p-6 mb-8">
                <h3 className="font-semibold text-foreground mb-2">Contacto</h3>
                <p className="text-sm text-muted-foreground">📞 983 64 23 92</p>
                <p className="text-sm text-muted-foreground">✉️ reservas@casadedosa.com</p>
              </div>
              <Button
                onClick={() => navigate("/reservas")}
                className="bg-gradient-golden hover:opacity-90"
              >
                Hacer Nueva Reserva
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="shadow-elegant text-center">
            <CardContent className="p-12">
              <CheckCircle className="h-20 w-20 text-golden mx-auto mb-6" />
              <h1 className="text-4xl font-display font-bold text-foreground mb-4">
                ¡Reserva Actualizada!
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Tu reserva ha sido modificada exitosamente.
              </p>
              <div className="bg-muted rounded-lg p-6 mb-8">
                <h3 className="font-semibold text-foreground mb-4">Nuevos detalles:</h3>
                <div className="space-y-2 text-sm">
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
                  {formData.requests && (
                    <div className="flex justify-between">
                      <span>Peticiones:</span>
                      <span>{formData.requests}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-4">
                <Button
                  onClick={() => navigate("/reservas")}
                  className="bg-gradient-golden hover:opacity-90 w-full"
                >
                  Hacer Nueva Reserva
                </Button>
                <div className="bg-muted rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">
                    ¡Nos vemos pronto en Casa de Dosa!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const availableTimes = getAvailableTimes();

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle className="text-3xl font-display text-center text-foreground">
              Editar Reserva
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="bg-accent/10 rounded-lg p-4 mb-8">
              <h3 className="font-semibold text-foreground mb-2">Reserva actual:</h3>
              <p className="text-sm text-muted-foreground">
                Fecha: {reservation.date} | Hora: {reservation.time} | Comensales: {reservation.guests}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date" className="flex items-center">
                    <Calendar className="h-4 w-4 text-golden mr-2" />
                    Fecha *
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value, time: "" })}
                    min={new Date().toISOString().split("T")[0]}
                  />
                  {availableSpots && formData.date && (
                    <div className="text-xs space-y-1 mt-2">
                      <div className="flex items-center justify-between p-2 bg-muted rounded">
                        <span>Mañana</span>
                        <span className={availableSpots.morning <= 0 ? "text-red-500 font-semibold" : "text-green-600 font-semibold"}>
                          {availableSpots.morning <= 0 ? "Completo" : "Disponible"}
                        </span>
                      </div>
                      {new Date(formData.date + "T00:00:00").getDay() !== 0 && (
                        <div className="flex items-center justify-between p-2 bg-muted rounded">
                          <span>Tarde</span>
                          <span className={availableSpots.evening <= 0 ? "text-red-500 font-semibold" : "text-green-600 font-semibold"}>
                            {availableSpots.evening <= 0 ? "Completo" : "Disponible"}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time" className="flex items-center">
                    <Clock className="h-4 w-4 text-golden mr-2" />
                    Hora *
                  </Label>
                  <Select
                    onValueChange={(value) => setFormData({ ...formData, time: value })}
                    value={formData.time}
                    disabled={!formData.date}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={!formData.date ? "Selecciona fecha" : "Selecciona hora"} />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTimes.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="guests" className="flex items-center">
                    <Users className="h-4 w-4 text-golden mr-2" />
                    Comensales *
                  </Label>
                  <Select
                    onValueChange={(value) => setFormData({ ...formData, guests: value })}
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
                  onChange={(e) => setFormData({ ...formData, requests: e.target.value })}
                  placeholder="Alergias, dietas especiales, celebraciones..."
                  rows={3}
                />
              </div>

              <div className="space-y-4">
                <Button
                  type="submit"
                  disabled={saving || !formData.date || !formData.time || !formData.guests}
                  className="w-full bg-gradient-golden hover:opacity-90 text-blue-grey-dark font-semibold"
                  size="lg"
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    "Guardar Cambios"
                  )}
                </Button>
                <Button
                  type="button"
                  onClick={() => navigate("/reservas")}
                  variant="outline"
                  className="w-full"
                  size="lg"
                >
                  Cancelar
                </Button>
              </div>

              <div className="text-center text-xs text-muted-foreground">
                <p>Este enlace expira el {new Date(reservation.token_expires_at).toLocaleString("es-ES", { timeZone: "Europe/Madrid" })}</p>
              </div>
            </form>

            <div className="mt-8 text-center text-sm text-muted-foreground">
              <p>¿Necesitas ayuda? Contacta con nosotros:</p>
              <p className="mt-2">📞 983 64 23 92 | ✉️ reservas@casadedosa.com</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditReservation;
