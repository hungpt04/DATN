// Pages

import AdminLayout from "../assets/components/Layout/AdminLayout";
import Admin from "../pages/admin";
import Contact from "../pages/users/Contact";
import Home from "../pages/users/Home";
import Intro from "../pages/users/Intro";
import News from "../pages/users/News";
import Product from "../pages/users/Product";



// Public routes
const publicRoutes = [
    { path: '/', component: Home },
    { path: 'admin', component: Admin, layout: AdminLayout },
    { path: '/san-pham', component: Product },
    { path: '/gioi-thieu', component: Intro },
    { path: '/tin-tuc', component: News },
    { path: '/lien-he', component: Contact },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };