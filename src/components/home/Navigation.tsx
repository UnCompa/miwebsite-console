import Navigate from "../core/Navigate"

function Navigation() {
  return (
    <div className="flex flex-col min-w-52 p-4 gap-2">
      <Navigate to="/">Casa</Navigate>
      <Navigate to="/create">Crear</Navigate>
      <Navigate to="">Actualizar</Navigate>
    </div>
  )
}

export default Navigation
