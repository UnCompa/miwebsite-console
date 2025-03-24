import { Box } from "lucide-react"

function NotContent() {
  return (
    <div className="flex flex-col justify-center items-center gap-4">
      <div className="bg-blue-700 w-max p-4 rounded-full">
        <Box></Box>
      </div>
      <p>No hay datos disponibles</p>
    </div>
  )
}

export default NotContent
