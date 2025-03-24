import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { IoKey, IoPerson } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "sonner";
import logo from "../assets/logo.png";
import unCompa from "../assets/UnCompa.Dev.png";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import useAuthStore from "../store/useAuthStore";
import "../styles/pattern.css";

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn, errors } = useAuthStore((state) => state);

  useEffect(() => {
    if (errors) {
      toast.error(errors);
    }
  }, [errors]);

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    onSubmit: async (values) => {
      setIsLoading(true);
      const res = await signIn(values);
      console.log(res);
      navigate("/");
      setIsLoading(false);
    },
  });

  return (
    <main className="min-h-screen flex justify-center items-center">
      <Toaster theme="dark" richColors />
      <section className="bg-gradient-to-br from-neutral-950 to-neutral-900 min-h-max min-w-96 rounded-3xl p-4 flex flex-col gap-4">
        <h1 className="text-center text-3xl font-light">Iniciar sesión</h1>
        <div className="flex items-center gap-2 bg-neutral-950 rounded-lg px-4 py-2 focus-within:ring-2 focus-within:ring-cyan-400/40 transition-all shadow-inner text-lg">
          <IoPerson className="text-cyan-400 text-lg" />
          <input
            value={formik.values.username}
            onChange={formik.handleChange}
            name="username"
            type="text"
            className="bg-transparent flex-1 outline-none text-white placeholder-gray-400"
            placeholder="Nombre de usuario"
          />
        </div>

        {/* Right Side - Login Form */}
        <section className="w-1/2 p-8 flex flex-col justify-center">
          <div className="flex items-center justify-center mb-4">
            <img src={logo} alt="UnCompa.Dev" className="w-24" />
            <img src={unCompa} className="p-5" />
          </div>
          <h1 className="text-3xl font-semibold text-center">Bienvenido</h1>
          <p className="text-sm text-gray-400 text-center mb-6">
            Por favor ingresa tus datos
          </p>
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div className="flex items-center gap-2 bg-neutral-800 rounded-lg px-4 py-2 focus-within:ring-2 focus-within:ring-cyan-400/40">
              <IoPerson className="text-cyan-400" />
              <input
                value={formik.values.username}
                onChange={formik.handleChange}
                name="username"
                type="text"
                className="bg-transparent flex-1 outline-none text-white placeholder-gray-400"
                placeholder="Nombre de usuario"
              />
            </div>
            <div className="flex items-center gap-2 bg-neutral-800 rounded-lg px-4 py-2 focus-within:ring-2 focus-within:ring-cyan-400/40">
              <IoKey className="text-cyan-400" />
              <input
                value={formik.values.password}
                onChange={formik.handleChange}
                name="password"
                type={showPassword ? "text" : "password"}
                className="bg-transparent flex-1 outline-none text-white placeholder-gray-400"
                placeholder="Contraseña"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-cyan-400"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition-all"
            >
              {isLoading ? <LoadingSpinner /> : "Enviar"}
            </button>
          </form>
        </section>
      </section>
  </main>
  );
}

export default LoginPage;
