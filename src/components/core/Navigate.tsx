import { ReactNode } from "react"
import { Link, useLocation } from "react-router-dom"

function Navigate({ children, to, withActive = true, icon }: { children: ReactNode, to: string, withActive?: boolean, icon?: ReactNode }) {
  const location = useLocation()

  return (
    <Link className={`${withActive && to == location.pathname ? 'border-cyan-800 bg-cyan-900 hover:bg-cyan-800 shadow-[0_2px_100px_#0af8]' : "border-neutral-800 bg-neutral-950 hover:bg-neutral-800"} p-2 rounded-lg transition-all flex items-center gap-2`} to={to}>
      <div>
        {icon}
      </div>
      {children}
    </Link>
  )
}

export default Navigate
