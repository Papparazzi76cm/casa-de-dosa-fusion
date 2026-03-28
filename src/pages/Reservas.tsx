import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Users, Phone, Mail } from "lucide-react";

const Reservas = () => {
  return (
    <div className="min-h-screen py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-display font-bold text-foreground mb-6">
            Reserva tu <span className="text-golden">Mesa</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Para reservar mesa en Casa de Dosa, contacta con nosotros directamente
            por teléfono, WhatsApp o email
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contacto para Reservas */}
          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle className="text-xl font-display text-foreground flex items-center">
                <Phone className="h-5 w-5 text-golden mr-2" />
                Contacto para Reservas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <a
                href="tel:983642392"
                className="flex items-center space-x-3 p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
              >
                <Phone className="h-5 w-5 text-golden" />
                <div>
                  <p className="font-semibold text-foreground">Teléfono</p>
                  <p className="text-muted-foreground">983 64 23 92</p>
                </div>
              </a>

              <a
                href="https://wa.me/34642357876?text=%C2%A1Hola!%20Me%20gustar%C3%ADa%20hacer%20una%20reserva%20en%20Casa%20de%20Dosa%20%F0%9F%8D%BD%EF%B8%8F"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 p-3 rounded-lg bg-[#25D366]/10 hover:bg-[#25D366]/20 transition-colors"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-[#25D366]">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                <div>
                  <p className="font-semibold text-foreground">WhatsApp</p>
                  <p className="text-muted-foreground">642 357 876</p>
                </div>
              </a>

              <a
                href="mailto:reservas@casadedosa.com"
                className="flex items-center space-x-3 p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
              >
                <Mail className="h-5 w-5 text-golden" />
                <div>
                  <p className="font-semibold text-foreground">Email</p>
                  <p className="text-muted-foreground">reservas@casadedosa.com</p>
                </div>
              </a>

              <p className="text-sm text-muted-foreground mt-4">
                Para reservas de más de 10 personas o eventos especiales,
                por favor contacta directamente.
              </p>
            </CardContent>
          </Card>

          {/* Info lateral */}
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
                  <Users className="h-5 w-5 text-golden mr-2" />
                  Política de Reservas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-5">
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
