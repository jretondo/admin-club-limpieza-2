import Index from "views/admin/dashboard";
import Login from "views/ingreso/Login.js";
import ForgotPass from 'views/ingreso/ForgotPass';
import NvaPass from 'views/ingreso/NvaPass'
var routes = [
  {
    path: "/login",
    name: "Login",
    icon: "ni ni-key-25 text-info",
    component: Login,
    layout: process.env.PUBLIC_URL + "/auth"
  },
  {
    path: "/nvapass",
    name: "New Pass",
    icon: "ni ni-circle-08 text-pink",
    component: NvaPass,
    layout: process.env.PUBLIC_URL + "/auth"
  },
  {
    path: "/forgotpass",
    name: "Forgot Pass",
    icon: "ni ni-circle-08 text-pink",
    component: ForgotPass,
    layout: process.env.PUBLIC_URL + "/auth"
  },
  {
    path: "/index",
    name: "Dashboard",
    icon: "ni ni-tv-2 text-primary",
    component: Index,
    layout: process.env.PUBLIC_URL + "/admin"
  }
];
export default routes;
