import Index from "views/admin/dashboard";
import Profile from "views/examples/Profile.js";
import Maps from "views/examples/Maps.js";
import Tables from "views/examples/Tables.js";
import DailyOffers from "views/admin/dailyOffers.js";
import CountDown from 'views/admin/contdown.js'
import ProductsItems from 'views/admin/productsItems.js'

var routes = [
  {
    path: "/index",
    name: "Dashboard",
    icon: "ni ni-tv-2 text-blue",
    component: Index,
    layout: "/admin"
  },
  {
    path: "/dailyOff",
    name: "Ofertas diarias",
    icon: "ni ni-planet text-yellow",
    component: DailyOffers,
    layout: "/admin"
  },
  {
    path: "/countDown",
    name: "Cuenta Regresiva",
    icon: "ni ni-watch-time text-orange",
    component: CountDown,
    layout: "/admin"
  },
  {
    path: "/productItems",
    name: "Lista de Productos",
    icon: "ni ni-shop text-red",
    component: ProductsItems,
    layout: "/admin"
  },
  {
    path: "/maps",
    name: "Maps",
    icon: "ni ni-pin-3 text-orange",
    component: Maps,
    layout: "/admin"
  },
  {
    path: "/user-profile",
    name: "User Profile",
    icon: "ni ni-single-02 text-yellow",
    component: Profile,
    layout: "/admin"
  },
  {
    path: "/tables",
    name: "Tables",
    icon: "ni ni-bullet-list-67 text-red",
    component: Tables,
    layout: "/admin"
  }
];
export default routes;
