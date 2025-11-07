import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Helmet } from "react-helmet-async";
import { Calendar, LogOut, Ban, CheckCircle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type BlockedSlot = {
  id: string;
  date: string;
  session: string;
  reason: string | null;
  created_at: string;
};

const Admin = () => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [blockedSlots, setBlockedSlots] = useState<BlockedSlot[]>([]);
  const [newBlock, setNewBlock] = useState({
    date: "",
    session: "morning",
    reason: "",
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAdminStatus();
    fetchBlockedSlots();
  }, []);

  const checkAdminStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/admin-login");
        return;
      }

      const { data: roleData, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (error) throw error;

      if (!roleData) {
        toast({
          title: "Acceso denegado",
          description: "No tienes permisos de administrador",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      setIsAdmin(true);
    } catch (error) {
      console.error("Error checking admin status:", error);
      navigate("/admin-login");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBlockedSlots = async () => {
    try {
      const { data, error } = await supabase
        .from("blocked_slots")
        .select("*")
        .order("date", { ascending: true });

      if (error) throw error;
      setBlockedSlots(data || []);
    } catch (error) {
      console.error("Error fetching blocked slots:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las sesiones bloqueadas",
        variant: "destructive",
      });
    }
  };

  const handleBlockSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase.from("blocked_slots").insert({
        date: newBlock.date,
        session: newBlock.session,
        reason: newBlock.reason || null,
        blocked_by: user?.id,
      });

      if (error) throw error;

      toast({
        title: "Sesión bloqueada",
        description: "La sesión ha sido bloqueada correctamente",
      });

      setNewBlock({ date: "", session: "morning", reason: "" });
      fetchBlockedSlots();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo bloquear la sesión",
        variant: "destructive",
      });
    }
  };

  const handleUnblockSlot = async (id: string) => {
    try {
      const { error } = await supabase
        .from("blocked_slots")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Sesión desbloqueada",
        description: "La sesión está disponible nuevamente",
      });

      fetchBlockedSlots();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo desbloquear la sesión",
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Cargando...</p>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <>
      <Helmet>
        <title>Panel de Administración - Casa de Dosa</title>
      </Helmet>
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Panel de Administración</h1>
            <Button onClick={handleLogout} variant="outline">
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ban className="w-5 h-5" />
                Bloquear Nueva Sesión
              </CardTitle>
              <CardDescription>
                Bloquea una sesión específica para evitar nuevas reservas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleBlockSlot} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Fecha</Label>
                    <Input
                      id="date"
                      type="date"
                      value={newBlock.date}
                      onChange={(e) => setNewBlock({ ...newBlock, date: e.target.value })}
                      min={new Date().toISOString().split("T")[0]}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="session">Sesión</Label>
                    <Select
                      value={newBlock.session}
                      onValueChange={(value) => setNewBlock({ ...newBlock, session: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="morning">Mañana (10:00-16:30)</SelectItem>
                        <SelectItem value="evening">Tarde (19:30-00:00)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reason">Motivo (opcional)</Label>
                  <Textarea
                    id="reason"
                    placeholder="Ej: Evento privado, Mantenimiento, etc."
                    value={newBlock.reason}
                    onChange={(e) => setNewBlock({ ...newBlock, reason: e.target.value })}
                    rows={3}
                  />
                </div>
                <Button type="submit" className="w-full">
                  Bloquear Sesión
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Sesiones Bloqueadas
              </CardTitle>
              <CardDescription>
                {blockedSlots.length === 0
                  ? "No hay sesiones bloqueadas actualmente"
                  : `${blockedSlots.length} sesión(es) bloqueada(s)`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {blockedSlots.map((slot) => (
                  <div
                    key={slot.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">
                          {new Date(slot.date + "T00:00:00").toLocaleDateString("es-ES", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          - {slot.session === "morning" ? "Mañana" : "Tarde"}
                        </span>
                      </div>
                      {slot.reason && (
                        <p className="text-sm text-muted-foreground">{slot.reason}</p>
                      )}
                    </div>
                    <Button
                      onClick={() => handleUnblockSlot(slot.id)}
                      variant="outline"
                      size="sm"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Desbloquear
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Admin;
