// Pages

import AdminLayout from '../components/Layout/AdminLayout';
import Admin from '../pages/admin';
import Brand from '../pages/admin/Brand';
import Contact from '../pages/users/Contact';
import Home from '../pages/users/Home';
import Intro from '../pages/users/Intro';
import News from '../pages/users/News';
import Product from '../pages/users/Product/Product.jsx';
import Login from '../pages/users/Login/Login.jsx';
import Color from '../pages/admin/Color';
import Material from '../pages/admin/Material';
import Weight from '../pages/admin/Weight';
import BalancePoint from '../pages/admin/Balance';
import Stiff from '../pages/admin/Stiff';
import User from '../pages/admin/User';
import Customer from '../pages/admin/Customer';
import ProductDetail from '../pages/users/ProductDetail/ProductDetail.jsx';
import Cart from '../pages/users/Cart/Cart.jsx';
import ProductAdmin from '../pages/admin/Product';
import AddProduct from '../pages/admin/Product/Add.js';
import OfflineSale from '../pages/admin/OfflineSale/index.js';
import Order from '../pages/admin/Order/index.js';
import AddAddress from '../pages/users/Checkout/AddAddress.jsx';
import OrderSummary from '../pages/users/Checkout/OrderSummary.jsx';
import OrderHistory from '../pages/admin/Order/OrderHistory.jsx';
import SearchOrder from '../pages/admin/Return/SearchOrder.jsx';
import ReturnOrder from '../pages/admin/Return/ReturnOrder.jsx';

// Public routes
const publicRoutes = [
    { path: '/', component: Home },
    { path: '/admin', component: Admin, layout: AdminLayout },
    { path: '/admin/quan-ly-don-hang', component: Order, layout: AdminLayout },
    { path: '/admin/tra-hang', component: SearchOrder, layout: AdminLayout },
    { path: '/admin/tra-hang/don-hang', component: ReturnOrder, layout: AdminLayout },
    { path: '/admin/quan-ly-don-hang/order-history', component: OrderHistory, layout: AdminLayout },
    { path: '/admin/ban-hang-tai-quay', component: OfflineSale, layout: AdminLayout },
    { path: '/admin/quan-ly-san-pham/thuong-hieu', component: Brand, layout: AdminLayout },
    { path: '/admin/quan-ly-san-pham/mau-sac', component: Color, layout: AdminLayout },
    { path: '/admin/quan-ly-san-pham/chat-lieu', component: Material, layout: AdminLayout },
    { path: '/admin/quan-ly-san-pham/trong-luong', component: Weight, layout: AdminLayout },
    { path: '/admin/quan-ly-san-pham/diem-can-bang', component: BalancePoint, layout: AdminLayout },
    { path: '/admin/quan-ly-san-pham/do-cung', component: Stiff, layout: AdminLayout },
    { path: '/admin/quan-ly-san-pham/san-pham-ct', component: ProductAdmin, layout: AdminLayout },
    { path: '/admin/quan-ly-san-pham/san-pham-ct/add', component: AddProduct, layout: AdminLayout },
    { path: '/admin/tai-khoan/nhan-vien', component: User, layout: AdminLayout },
    { path: '/admin/tai-khoan/khach-hang', component: Customer, layout: AdminLayout },

    { path: '/san-pham', component: Product },
    { path: '/san-pham/san-pham-ct/:id', component: ProductDetail },
    { path: '/gioi-thieu', component: Intro },
    { path: '/tin-tuc', component: News },
    { path: '/lien-he', component: Contact },
    { path: '/gio-hang', component: Cart },
    { path: '/gio-hang/checkout', component: AddAddress },
    { path: '/gio-hang/checkout/order-summary', component: OrderSummary },
    { path: '/login', component: Login, layout: null },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
