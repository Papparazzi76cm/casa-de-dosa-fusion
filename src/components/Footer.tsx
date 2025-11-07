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
              © 2024 Casa de Dosa. Todos los derechos reservados.
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
