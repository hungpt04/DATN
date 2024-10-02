// Pages

import AdminLayout from '../components/Layout/AdminLayout';
import Admin from '../pages/admin';
import Brand from '../pages/admin/Brand';
import Contact from '../pages/users/Contact';
import Home from '../pages/users/Home';
import Intro from '../pages/users/Intro';
import News from '../pages/users/News';
import Product from '../pages/users/Product';
import Login from '../pages/users/Login/Login.jsx';
import Color from '../pages/admin/Color';
import Material from '../pages/admin/Material';
import Weight from '../pages/admin/Weight';
import BalancePoint from '../pages/admin/Balance';
import Stiff from '../pages/admin/Stiff';

// Public routes
const publicRoutes = [
    { path: '/', component: Home },
    { path: '/admin', component: Admin, layout: AdminLayout },
    { path: '/admin/quan-ly-san-pham/thuong-hieu', component: Brand, layout: AdminLayout },
    { path: '/admin/quan-ly-san-pham/mau-sac', component: Color, layout: AdminLayout },
    { path: '/admin/quan-ly-san-pham/chat-lieu', component: Material, layout: AdminLayout },
    { path: '/admin/quan-ly-san-pham/trong-luong', component: Weight, layout: AdminLayout },
    { path: '/admin/quan-ly-san-pham/diem-can-bang', component: BalancePoint, layout: AdminLayout },
    { path: '/admin/quan-ly-san-pham/do-cung', component: Stiff, layout: AdminLayout },

    { path: '/san-pham', component: Product },
    { path: '/gioi-thieu', component: Intro },
    { path: '/tin-tuc', component: News },
    { path: '/lien-he', component: Contact },
    { path: '/login', component: Login, layout: null },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
