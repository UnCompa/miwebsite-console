import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { IoKey, IoPerson } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "sonner";
import useAuthStore from "../store/useAuthStore";
import "../styles/pattern.css";
import logo from "../assets/logo.png";
import unCompa from "../assets/UnCompa.Dev.png";
import astronautCat from "../assets/astronaut-cat.png";
import html5Logo from "../assets/html5.png";
import reactLogo from "../assets/react.png";
import jsLogo from "../assets/javascript.png";
import nestLogo from "../assets/nest.png";
import tailwindLogo from "../assets/tailwind.png";
import LoadingSpinner from "../components/ui/LoadingSpinner";

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
    <main className="min-h-screen flex justify-center items-center bg-bl">
      <Toaster theme="dark" richColors />
      <div className="flex bg-amber-900 text-white rounded-3xl shadow-2xl  w-full  justify-center ">
        {/* Left Side - Image & Logos */}
        <div className="flex flex-col items-center bg-black p-100 px-0 py-0 h-screen w-[100%]">
          <div className="relative flex flex-col items-center bg-red-700">
            <img
              src={astronautCat}
              alt="Astronaut Cat"
              className="w-100 h-auto px-5 py-5"
            />
            <img
              src={html5Logo}
              alt="HTML5"
              className="absolute bottom-[-20px] items-center w-25 h-25"
            />
          </div>
          <div className="flex gap-4 mt-12">
            <img src={reactLogo} alt="React" className="w-12" />
            <img src={tailwindLogo} alt="Tailwind" className="w-12" />
            <img src={jsLogo} alt="JavaScript" className="w-12" />
            <img src={nestLogo} alt="NestJS" className="w-12" />
          </div>
        </div>

        {/* Right Side - Login Form */}
        <section className=" flex flex-col justify-start bg-[#0C1327] w-[60%] ">
          <div className="flex items-center justify-start pl-3 mb-4 bg-[#020617] py-3">
            <img src={logo} alt="UnCompa.Dev" className="w-15" />
            <img src={unCompa} className="w-2/4 pl-2" />
          </div>
          <div className="p-15 flex  flex-col justify-start ">
            <h1 className="text-3xl font-semibold ">Bienvenido</h1>
            <p className="text-sm text-gray-400 mb-6">
              Por favor ingresa tus datos
            </p>
            <p className="text-sm text-white pt-1 mb-1">Nombre de usuario</p>
            <form onSubmit={formik.handleSubmit} className="space-y-8  ">
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
          </div>
        </section>
      </div>
    </main>
  );
}

export default LoginPage;
