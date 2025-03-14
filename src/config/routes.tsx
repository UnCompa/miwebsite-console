import CreatePages from "../pages/CreatePage";
import Homepage from "../pages/Homepage";


export const routes = [
  {
    path: '/',
    component: Homepage
  },
  {
    path: '/create',
    component: CreatePages
  },
]