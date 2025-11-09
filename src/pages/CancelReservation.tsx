import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, AlertCircle, Loader2, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const CancelReservation = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [reservation, setReservation] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const loadReservation = async () => {
      if (!token) {
        setError("Token inválido. El enlace de cancelación no es válido.");
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
          setError("El enlace de cancelación ha expirado (válido por 7 días). Por favor, contacta con nosotros: 983 64 23 92");
          setLoading(false);
          return;
        }

        // Check if already cancelled
        if (data.status === "cancelled") {
          setError("Esta reserva ya fue cancelada anteriormente.");
          setLoading(false);
          return;
        }

        setReservation(data);
      } catch (err: any) {
        setError("Hubo un error al cargar la reserva. Por favor, intenta de nuevo.");
      } finally {
        setLoading(false);
      }
    };

    loadReservation();
  }, [token]);

  const handleCancelReservation = async () => {
    if (!token || !reservation) return;

    setCancelling(true);
    try {
      const { error: cancelError } = await supabase
        .from("reservations")
        .update({ status: "cancelled" })
        .eq("id", reservation.id);

      if (cancelError) throw cancelError;

      setSuccess(true);
      toast({
        title: "Reserva Cancelada",
        description: "Tu reserva ha sido cancelada exitosamente.",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: "No se pudo cancelar la reserva. Por favor, intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setCancelling(false);
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
                ¡Reserva Cancelada!
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Tu reserva ha sido cancelada exitosamente.
              </p>
              <div className="bg-muted rounded-lg p-6 mb-8">
                <h3 className="font-semibold text-foreground mb-4">Detalles de la reserva:</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Nombre:</span>
                    <span>{reservation.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fecha:</span>
                    <span>{reservation.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Hora:</span>
                    <span>{reservation.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Comensales:</span>
                    <span>{reservation.guests}</span>
                  </div>
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
                    📞 983 64 23 92 | ✉️ reservas@casadedosa.com
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle className="text-3xl font-display text-center text-foreground">
              Cancelar Reserva
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="bg-muted rounded-lg p-6 mb-8">
              <h3 className="font-semibold text-foreground mb-4">Detalles de la reserva:</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Nombre:</span>
                  <span className="font-medium">{reservation.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fecha:</span>
                  <span className="font-medium">{reservation.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Hora:</span>
                  <span className="font-medium">{reservation.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Comensales:</span>
                  <span className="font-medium">{reservation.guests}</span>
                </div>
              </div>
            </div>

            <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 mb-8">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-destructive mb-1">¿Estás seguro?</h4>
                  <p className="text-sm text-muted-foreground">
                    Esta acción no se puede deshacer. Si cancelas tu reserva, perderás tu
                    lugar. Puedes hacer una nueva reserva cuando quieras.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Button
                onClick={handleCancelReservation}
                disabled={cancelling}
                variant="destructive"
                className="w-full"
                size="lg"
              >
                {cancelling ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Cancelando...
                  </>
                ) : (
                  "Confirmar Cancelación"
                )}
              </Button>
              <Button
                onClick={() => navigate("/reservas")}
                variant="outline"
                className="w-full"
                size="lg"
              >
                Volver sin Cancelar
              </Button>
            </div>

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

export default CancelReservation;
