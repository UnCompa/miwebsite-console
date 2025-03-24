import { ReactNode, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "../components/home/Navigation";
import useAuthStore from "../store/useAuthStore";

export default function MainBoardLayout({ children }: { children: ReactNode }) {
  const token = useAuthStore(state => state.token); // Acceder al estado de token
  const getProfile = useAuthStore(state => state.getProfile); // Acceder a la función getProfile
  const data = useAuthStore(state => state.data); // Acceder al estado de los datos del perfil
  const errors = useAuthStore(state => state.errors); // Acceder al estado de los datos del perfil
  const navigate = useNavigate();

  const isAuthenticated = useMemo(() => !!token, [token]);

  useEffect(() => {
    if (isAuthenticated && !data) {
      // Solo llamar a getProfile si no hay datos cargados aún
      getProfile().then(profile => {
        console.log('PASE POR AQUI')
        if (!profile || !profile.roles.includes("ADMIN")) {
          console.log('ENTRE POR AQUI')
          navigate("/login");
        }
      });
    } else if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate, data, getProfile]); // Dependencias optimizadas
  
  return (
    <main className="min-h-screen bg-black text-white flex font-RedHatDisplay">
      <section className="flex flex-col flex-1 max-h-screen">
        <div className="p-4">
          <h2 className="text-center text-2xl font-black">UnCompa.<span className="bg-clip-text text-transparent from-blue-500 to-teal-600 bg-gradient-to-l">Dev</span></h2>
        </div>
        <Navigation />
      </section>
      <section className="p-4 w-full">
        <div className="bg-gradient-to-tl from-zinc-950 to-neutral-900 rounded-xl h-full w-full p-4 shadow-2xl">
          {children}
        </div>
      </section>
    </main>
  );
}
