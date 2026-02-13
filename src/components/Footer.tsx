import { Link } from "react-router-dom";
import {
  MapPin,
  Phone,
  Mail,
  Instagram,
  Facebook,
  Twitter,
  Lock, // Importa el icono de candado
} from "lucide-react";
import logo from "@/assets/logo-casa-de-dosa.png";

const Footer = () => {
  return (
    <footer className="bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo y descripción */}
          <div className="col-span-1 md:col-span-2">
            <img
              src={logo}
              alt="Casa de Dosa"
              className="h-16 w-auto object-contain mb-4"
            />
            <p className="text-blue-grey-light mb-4 max-w-md">
              Fusión culinaria única que combina los sabores tradicionales de la
              India con la esencia gastronómica española.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-golden hover:text-golden-light transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-golden hover:text-golden-light transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-golden hover:text-golden-light transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h3 className="text-lg font-semibold text-golden mb-4">
              Enlaces Rápidos
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-blue-grey-light hover:text-golden transition-colors"
                >
                  Inicio
                </Link>
              </li>
              <li>
                <Link
                  to="/menu"
                  className="text-blue-grey-light hover:text-golden transition-colors"
                >
                  Menú
                </Link>
              </li>
              <li>
                <Link
                  to="/reservas"
                  className="text-blue-grey-light hover:text-golden transition-colors"
                >
                  Reservas
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="text-lg font-semibold text-golden mb-4">Contacto</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-golden" />
                <span className="text-blue-grey-light text-sm">
                  Paseo de Zorrilla 23, Valladolid
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-golden" />
                <span className="text-blue-grey-light text-sm">
                  983 64 23 92
                </span>
              </div>
              <a
                href="https://wa.me/34642357876?text=%C2%A1Hola!%20Me%20gustar%C3%ADa%20hacer%20una%20reserva%20en%20Casa%20de%20Dosa%20%F0%9F%8D%BD%EF%B8%8F"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-[#25D366]">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                <span className="text-blue-grey-light text-sm">
                  WhatsApp: 642 357 876
                </span>
              </a>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-golden" />
                <span className="text-blue-grey-light text-sm">
                  reservas@casadedosa.com
                </span>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-golden font-medium mb-2">Horarios</h4>
              <p className="text-blue-grey-light text-sm">
                Lun - Sáb: 10:00 - 16:30, 19:30 - 00:00
              </p>
              <p className="text-blue-grey-light text-sm">
                Dom: 10:00 - 16:30
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-blue-grey mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-blue-grey-light text-sm">
              © 2025 Casa de Dosa. Todos los derechos reservados.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0 items-center">
              <a
                href="#"
                className="text-blue-grey-light hover:text-golden text-sm transition-colors"
              >
                Política de Privacidad
              </a>
              <a
                href="#"
                className="text-blue-grey-light hover:text-golden text-sm transition-colors"
              >
                Términos de Servicio
              </a>
              {/* --- ENLACE AÑADIDO --- */}
              <Link
                to="/admin-login"
                className="flex items-center text-blue-grey-light hover:text-golden text-sm transition-colors"
                title="Admin Login"
              >
                <Lock className="h-3 w-3 mr-1 opacity-70" />
                Admin
              </Link>
              {/* --- FIN ENLACE AÑADIDO --- */}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
