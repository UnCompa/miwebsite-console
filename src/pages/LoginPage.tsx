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
//import html5Logo from "../assets/html5.png";
// import reactLogo from "../assets/react.png";
// import jsLogo from "../assets/javascript.png";
// import nestLogo from "../assets/nest.png";
// import tailwindLogo from "../assets/tailwind.png";
import LoadingSpinner from "../components/ui/LoadingSpinner";

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn, errors } = useAuthStore((state) => state);
  //const [enableButton1, setEnableButton1] = useState(true);
  //const [enableButton2, setEnableButton2] = useState(true);

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

  //const isButtonDisabled = !(enableButton1 && enableButton2);

  return (
    <main className="flex  h-screen bg-amber-200 ">
      <Toaster theme="dark" richColors />
      <div className="flex  text-white h-full w-full  justify-center ">
        {/* Left Side - Image & Logos */}
        <div className="flex flex-col items-center h-screen w-full">
          <div className="flex justify-center items-center flex-col w-full h-full">
            <img
              src={astronautCat}
              alt="Astronaut Cat"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Right Side - Login Form */}
        <section className=" flex flex-col justify-start bg-[#0C1327] w-[60%] ">
          <div className="flex items-center justify-start mb-4 pl-3 bg-[#020617] py-3">
            <img src={logo} alt="UnCompa.Dev" className="w-15 flex" />
            <img src={unCompa} className="w-1/3 flex justify-center pl-2" />
          </div>
          <div className="flex justify-center   h-full items-center">
            <div className=" flex  flex-col w-full px-15 mb-30 ">
              <h1 className="text-3xl font-semibold ">Bienvenido</h1>
              <p className="text-sm text-gray-400 mb-6">
                Por favor ingresa tus datos
              </p>
              <p className="text-sm text-white pt-1 mb-1">Nombre de usuario</p>
              <form onSubmit={formik.handleSubmit} className="space-y-4  ">
                <div className="flex items-center gap-2 bg-neutral-800 rounded-lg px-4 py-2 focus-within:ring-2 focus-within:ring-cyan-400/40">
                  <IoPerson className="text-cyan-400" />
                  <input
                    value={formik.values.username}
                    //onChange={(e) => setEnableButton1(e.target.value)}
                    name="username"
                    type="text"
                    className="bg-transparent flex-1 outline-none text-white placeholder-gray-600 "
                    placeholder="Nombre de usuario"
                  />
                </div>
                <p className="text-sm text-white pt-1 mb-1">Contraseña</p>
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
                  //disabled={!enableButton}
                  className="w-full bg-blue-600 py-2 mt-7 rounded-lg shadow-lg hover:bg-blue-700 transition-all"
                >
                  {isLoading ? <LoadingSpinner /> : "Enviar"}
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default LoginPage;
