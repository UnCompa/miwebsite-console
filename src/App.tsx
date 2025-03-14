import { Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { routes } from './config/routes'
import LoadingPage from './pages/LoadingPage'

function App() {

  return (
    <>
      <Suspense fallback={<LoadingPage />}>
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
      </Suspense>
    </>
  )
}

export default App
