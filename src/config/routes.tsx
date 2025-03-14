import { lazy, Suspense } from "react";
import MainBoardLayout from "../layout/MainBoardLayout";
const CreatePages = lazy(() => import('../pages/CreatePage'))
const Homepage = lazy(() => import('../pages/Homepage'))

export const routes = [
  {
    path: '/',
    component: () => (
      <MainBoardLayout>
        <Suspense fallback={<div>Loading...</div>}>
          <Homepage />
        </Suspense>
      </MainBoardLayout>
    )
  },
  {
    path: '/create',
    component: () => (
      <MainBoardLayout>
        <Suspense fallback={<div>Loading...</div>}>
          <CreatePages />
        </Suspense>
      </MainBoardLayout>
    )
  },
]