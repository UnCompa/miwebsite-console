import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { routes } from './config/routes';
import LoadingPage from './pages/LoadingPage';
const queryClient = new QueryClient();
function App() {

  return (
    <>
      <QueryClientProvider client={queryClient}>
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
      </QueryClientProvider>
    </>
  )
}

export default App
