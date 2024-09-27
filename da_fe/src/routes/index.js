// Pages

import AdminLayout from "../assets/components/Layout/AdminLayout";
import Admin from "../pages/admin";
import Brand from "../pages/admin/Brand";
import Contact from "../pages/users/Contact";
import Home from "../pages/users/Home";
import Intro from "../pages/users/Intro";
import News from "../pages/users/News";
import Product from "../pages/users/Product";
import Add from "../pages/admin/Brand/Add";
import UpdateBrand from "../pages/admin/Brand/Update";
import Login from "../pages/users/Login/Login.jsx";

// Public routes
const publicRoutes = [
    { path: '/', component: Home },
    { path: '/admin', component: Admin, layout: AdminLayout },
    { path: '/admin/quan-ly-san-pham/thuong-hieu', component: Brand, layout: AdminLayout },
    { path: '/admin/quan-ly-san-pham/thuong-hieu/add', component: Add, layout: AdminLayout },
    { path: '/admin/quan-ly-san-pham/thuong-hieu/update/:id', component: UpdateBrand, layout: AdminLayout }, // Sửa lại đây để thêm :id
    { path: '/san-pham', component: Product },
    { path: '/gioi-thieu', component: Intro },
    { path: '/tin-tuc', component: News },
    { path: '/lien-he', component: Contact },
    { path: '/login', component: Login, layout: null },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
