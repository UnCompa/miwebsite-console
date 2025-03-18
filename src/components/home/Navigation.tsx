import { FaSquare, FaVideo } from "react-icons/fa6"
import { IoPower } from "react-icons/io5"
import { useNavigate } from "react-router-dom"
import useAuthStore from "../../store/useAuthStore"
import Navigate from "../core/Navigate"

function Navigation() {
  const logout = useAuthStore(state => state.logout)
  const navigate = useNavigate()
  const handleLogout = () => {
    logout()
    navigate('/login')
  }
  return (
    <div className="">
      <nav className="flex flex-col min-w-52 p-4 gap-2 flex-1">
        <Navigate icon={<FaSquare />} to="/">Dashboard</Navigate>
        <Navigate icon={<FaVideo />} to="/create">Videos</Navigate>
        <Navigate to="">Actualizar</Navigate>
      </nav>
      <div className="flex flex-col justify-end min-w-52 gap-2 h-max flex-1">
        <button
          onClick={() => handleLogout()}
          className="flex gap-1 items-center justify-center text-red-700 hover:text-red-500">
          <IoPower /> <span>Cerrar sesion</span>
        </button>
      </div>
    </div>
  )
}

export default Navigation
