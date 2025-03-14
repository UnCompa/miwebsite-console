import { Route, Routes } from 'react-router-dom'
import { routes } from './config/routes'

function App() {

  return (
    <>
      <Routes>
        {
          routes.map(route => {
            const Component = route.component
            return (
              <Route path={route.path} element={<Component />} />
            )
          })
        }
      </Routes>
    </>
  )
}

export default App
