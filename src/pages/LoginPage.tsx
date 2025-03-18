import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { IoKey, IoPerson } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "sonner";
import LoadingSpinner from "../components/core/LoadingSpinner";
import useAuthStore from "../store/useAuthStore";
import '../styles/pattern.css';
function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate()
  const { signIn, errors } = useAuthStore(state => state)
  useEffect(() => {
    if (errors) {
      toast.error(errors)
    }
  }, [errors])
  const formik = useFormik({
    initialValues: {
      username: '',
      password: ''
    },
    onSubmit: async (values) => {
      console.log(values)
      setIsLoading(true)
      const res = await signIn(values)
      console.log(res)
      navigate('/')
      setIsLoading(false)
    }
  })
  return (
    <main className="min-h-screen justify-center items-center flex font-RedHatDisplay container-pattern shadow-2xl">
      <Toaster theme="dark" richColors />
      <section className="bg-neutral-900 min-h-max min-w-96 rounded-3xl p-4 flex flex-col gap-4">
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
        <div className="autofilly flex items-center gap-2 bg-neutral-950 rounded-lg px-4 py-2 focus-within:ring-2 focus-within:ring-cyan-400/40 transition-all shadow-inner text-lg autofill:bg-transparent autofill:text-white">
          <IoKey className="text-cyan-400 text-lg" />
          <input
            value={formik.values.password}
            onChange={formik.handleChange}
            name="password"
            type={showPassword ? "text" : "password"}
            className="bg-transparent flex-1 outline-none text-white placeholder-gray-400 autofilly"
            placeholder="Contraseña"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-cyan-400 text-lg"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        <button
          type="submit"
          onClick={() => formik.handleSubmit()}
          className="bg-neutral-950 py-2 px-4 rounded-lg shadow-2xl hover:bg-teal-600 transition-all hover:shadow-[0_2px_100px_#0af5] cursor-pointer active:bg-teal-700">
          {isLoading ? <LoadingSpinner /> : "Ingresar"}
        </button>
      </section>
    </main>
  )
}

export default LoginPage
