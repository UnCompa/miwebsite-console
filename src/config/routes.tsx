import { lazy, Suspense } from "react";
import MainBoardLayout from "../layout/MainBoardLayout";
import ViewContentPages from "../pages/videos/ViewContentPage";
const CreatePages = lazy(() => import('../pages/videos/CreatePage'))
const Homepage = lazy(() => import('../pages/Homepage'))
const LoginPage = lazy(() => import('../pages/LoginPage'))

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
    path: '/section',
    component: () => (
      <MainBoardLayout>
        <Suspense fallback={<div>Loading...</div>}>
          <CreatePages />
        </Suspense>
      </MainBoardLayout>
    )
  },
  {
    path: '/section/:sectionId',
    component: () => (
      <MainBoardLayout>
        <Suspense fallback={<div>Loading...</div>}>
          <ViewContentPages />
        </Suspense>
      </MainBoardLayout>
    )
  },
  {
    path: '/login',
    component: LoginPage
  },
]