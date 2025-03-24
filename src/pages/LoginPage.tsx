import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { IoKey, IoPerson } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "sonner";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import useAuthStore from "../store/useAuthStore";
import '../styles/pattern.css';
function LoginPage() {
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
      if (res) {
        navigate('/')
      }
      setIsLoading(false)
    }
  })
  return (
    <main className="min-h-screen justify-center items-center flex font-RedHatDisplay container-pattern shadow-2xl">
      <Toaster theme="dark" richColors />
      <section className="bg-gradient-to-br from-neutral-950 to-neutral-900 min-h-max min-w-96 rounded-3xl p-4 flex flex-col gap-4">
        <h1 className="text-center text-3xl font-light">Iniciar sesión</h1>

        <Input
          type="text"
          value={formik.values.username}
          onChange={formik.handleChange}
          name="username"
          placeholder="Nombre de usuario"
          icon={<IoPerson className="text-cyan-400 text-lg" />}
        />

        <Input
          type="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          name="password"
          placeholder="Contraseña"
          showPasswordToggle={true}
          icon={<IoKey className="text-cyan-400 text-lg" />}
        />
        <Button
          type="submit"
          theme="neutral"
          onClick={() => formik.handleSubmit()}
          className="bg-neutral-950 py-2 px-4 rounded-lg shadow-2xl hover:bg-teal-600 transition-all hover:shadow-[0_2px_100px_#0af5] cursor-pointer active:bg-teal-700">
          {isLoading ? <LoadingSpinner /> : "Ingresar"}
        </Button>
      </section>
    </main>
  )
}

export default LoginPage
