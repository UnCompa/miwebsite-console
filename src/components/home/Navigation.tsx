import { useState } from "react"
import { FaSquare, FaVideo } from "react-icons/fa6"
import { IoPower } from "react-icons/io5"
import { useNavigate } from "react-router-dom"
import useAuthStore from "../../store/useAuthStore"
import Button from "../core/Button"
import Navigate from "../core/Navigate"

function Navigation() {
  const logout = useAuthStore(state => state.logout)
  const navigate = useNavigate()
  const [isLoading, setLoading] = useState(false)
  const handleLogout = () => {
    setLoading(true)
    logout()
    setLoading(false)
    navigate('/login')
  }
  return (
    <div className="">
      <nav className="flex flex-col min-w-52 p-4 gap-2 flex-1">
        <Navigate icon={<FaSquare />} to="/">Dashboard</Navigate>
        <Navigate icon={<FaVideo />} to="/create">Videos</Navigate>
      </nav>
      <div className="flex flex-col justify-end min-w-52 gap-2 h-max flex-1">
        <div className="flex justify-center flex-col items-center gap-2">
          <Button
            theme="danger"
            className="flex gap-1 items-center justify-center p-2"
            onClick={() => handleLogout()}
            icon={IoPower}
            isLoading={isLoading}
          >
            <span>Cerrar sesion</span>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Navigation
