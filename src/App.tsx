import { Toaster } from "./components/ui/toaster"; // Relative path
import { Toaster as Sonner } from "./components/ui/sonner"; // Relative path
import { TooltipProvider } from "./components/ui/tooltip"; // Relative path
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"; // Import useLocation
import { HelmetProvider } from "react-helmet-async";
import Layout from "./components/Layout"; // Relative path
import Home from "./pages/Home";       // Relative path
import Menu from "./pages/Menu";       // Relative path
import Reservas from "./pages/Reservas"; // Relative path
import Galeria from "./pages/Galeria";   // Relative path
import Contacto from "./pages/Contacto"; // Relative path
import NotFound from "./pages/NotFound";   // Relative path
import AdminDashboard from "./pages/AdminDashboard"; // Relative path

const queryClient = new QueryClient();

// Component to conditionally render Layout
const AppContent = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      {!isAdminRoute && <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/reservas" element={<Reservas />} />
          <Route path="/galeria" element={<Galeria />} />
          <Route path="/contacto" element={<Contacto />} />
          {/* Catch-all for non-admin routes */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>}

      {isAdminRoute && (
         <Routes>
           {/* Admin Routes (potentially without the main Layout) */}
           <Route path="/admin/reservas" element={<AdminDashboard />} />
           {/* Add other admin routes here */}
           <Route path="*" element={<NotFound />} /> {/* Catch-all for admin routes */}
         </Routes>
      )}
    </>
  );
};


const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <HelmetProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          {/* Use AppContent to handle conditional Layout rendering */}
          <AppContent />
        </BrowserRouter>
      </HelmetProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
