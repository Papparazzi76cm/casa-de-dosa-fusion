import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, AlertCircle } from "lucide-react";

const SetupAdmin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const { toast } = useToast();

  const setupAdmin = async () => {
    setIsLoading(true);
    
    const adminEmail = "administracion@casadedosa.com";
    const adminPassword = "Admin25@Dosa";

    try {
      // First, try to sign up the admin user
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: adminEmail,
        password: adminPassword,
        options: {
          emailRedirectTo: `${window.location.origin}/admin`,
        }
      });

      let userId: string | undefined;

      if (signUpError) {
        // If user already exists, try to sign in to get the user ID
        if (signUpError.message.includes("already registered")) {
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email: adminEmail,
            password: adminPassword,
          });

          if (signInError) throw signInError;
          userId = signInData.user?.id;
        } else {
          throw signUpError;
        }
      } else {
        userId = signUpData.user?.id;
      }

      if (!userId) {
        throw new Error("No se pudo obtener el ID del usuario");
      }

      // Check if admin role already exists
      const { data: existingRole } = await supabase
        .from("user_roles")
        .select("*")
        .eq("user_id", userId)
        .eq("role", "admin")
        .maybeSingle();

      if (!existingRole) {
        // Assign admin role
        const { error: roleError } = await supabase
          .from("user_roles")
          .insert({
            user_id: userId,
            role: "admin",
          });

        if (roleError) throw roleError;
      }

      // Sign out after setup
      await supabase.auth.signOut();

      setIsComplete(true);
      toast({
        title: "✓ Configuración completa",
        description: "El usuario administrador ha sido configurado correctamente",
      });

    } catch (error: any) {
      console.error("Error setting up admin:", error);
      toast({
        title: "Error en la configuración",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 flex flex-col items-center">
          {isComplete ? (
            <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mb-2">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          ) : (
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
              <AlertCircle className="w-6 h-6 text-primary" />
            </div>
          )}
          <CardTitle className="text-2xl">
            {isComplete ? "Configuración Completa" : "Configuración Inicial"}
          </CardTitle>
          <CardDescription className="text-center">
            {isComplete 
              ? "El administrador ha sido configurado correctamente. Ya puedes acceder al panel de administración."
              : "Haz clic en el botón para configurar el usuario administrador del sistema"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isComplete ? (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground text-center">
                Email: <strong>administracion@casadedosa.com</strong>
              </p>
              <Button 
                className="w-full" 
                onClick={() => window.location.href = "/admin-login"}
              >
                Ir al Panel de Administración
              </Button>
            </div>
          ) : (
            <Button 
              onClick={setupAdmin} 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? "Configurando..." : "Configurar Administrador"}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SetupAdmin;
