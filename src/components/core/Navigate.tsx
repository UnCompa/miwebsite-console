import { ReactNode } from "react"
import { useLocation } from "react-router-dom"

function Navigate({ children, to, withActive = true }: { children: ReactNode, to: string, withActive?: boolean }) {
  const location = useLocation()

  return (
    <a className={`${withActive && to == location.pathname ? 'border-cyan-800 bg-cyan-900 hover:bg-cyan-800' : "border-neutral-800 bg-neutral-900 hover:bg-neutral-800"} p-2 rounded-lg shadow border transition-all`} href={to}>
      {children}
    </a>
  )
}

export default Navigate
