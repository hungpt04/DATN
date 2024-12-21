// import { Fragment } from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { publicRoutes } from './routes';
// import DefaultLayout from './components/Layout/DefaultLayout';
// import { CartProvider } from './pages/users/Cart/CartContext';
// import { AddressProvider } from './pages/users/Checkout/AddressContext'; // Import AddressProvider

// function App() {
//     return (
//         <Router>
//             <div className="App">
//                 {/* Bọc toàn bộ ứng dụng trong cả CartProvider và AddressProvider */}
//                 <CartProvider>
//                     <AddressProvider>
//                         <Routes>
//                             {publicRoutes.map((route, index) => {
//                                 const Page = route.component;
//                                 let Layout = DefaultLayout;

//                                 if (route.layout) {
//                                     Layout = route.layout;
//                                 } else if (route.layout === null) {
//                                     Layout = Fragment;
//                                 }

//                                 return (
//                                     <Route
//                                         key={index}
//                                         path={route.path}
//                                         element={
//                                             <Layout>
//                                                 <Page />
//                                             </Layout>
//                                         }
//                                     />
//                                 );
//                             })}
//                         </Routes>
//                     </AddressProvider>
//                 </CartProvider>
//             </div>
//         </Router>
//     );
// }

// export default App;


// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { publicRoutes } from './routes';
// import DefaultLayout from './components/Layout/DefaultLayout';
// import { CartProvider } from './pages/users/Cart/CartContext';
// import { AddressProvider } from './pages/users/Checkout/AddressContext';

// const renderRoutes = (routes) =>
//     routes.map((route, index) => {
//         const Page = route.component;
//         const Layout = route.layout !== undefined ? route.layout : DefaultLayout;

//         return route.children ? (
//             <Route
//                 key={index}
//                 path={route.path}
//                 element={
//                     Layout === null ? (
//                         <Page />
//                     ) : (
//                         <Layout>
//                             <Page />
//                         </Layout>
//                     )
//                 }
//             >
//                 {renderRoutes(route.children)} {/* Lồng route con */}
//             </Route>
//         ) : (
//             <Route
//                 key={index}
//                 path={route.path}
//                 element={
//                     Layout === null ? (
//                         <Page />
//                     ) : (
//                         <Layout>
//                             <Page />
//                         </Layout>
//                     )
//                 }
//             />
//         );
//     });

// function App() {
//     return (
//         <Router>
//             <CartProvider>
//                 <AddressProvider>
//                     <Routes>{renderRoutes(publicRoutes)}</Routes>
//                 </AddressProvider>
//             </CartProvider>
//         </Router>
//     );
// }

// export default App;


import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { publicRoutes } from './routes';
import DefaultLayout from './components/Layout/DefaultLayout';
import { CartProvider } from './pages/users/Cart/CartContext';
import { AddressProvider } from './pages/users/Checkout/AddressContext';
import RoleBasedRoute from './components/RoleBasedRoute';
import { jwtDecode } from 'jwt-decode'; // Thư viện để giải mã JWT

const getRoleFromToken = (token) => {
    if (!token) return null;
    const decoded = jwtDecode(token);
    console.log(decoded.authorities);
    return decoded.authorities; // Giả sử role được lưu trong token
};

const renderRoutes = (routes, userRole) =>
    routes.map((route, index) => {
        const Page = route.component;
        const Layout = route.layout !== undefined ? route.layout : DefaultLayout;

        const isAdminRoute = route.path.startsWith('/admin');

        return route.children ? (
            <Route
                key={index}
                path={route.path}
                element={
                    Layout === null ? (
                        <Page />
                    ) : (
                        <Layout>
                            {isAdminRoute ? (
                                <RoleBasedRoute userRole={userRole}>
                                    <Page />
                                </RoleBasedRoute>
                            ) : (
                                <Page />
                            )}
                        </Layout>
                    )
                }
            >
                {renderRoutes(route.children, userRole)} {/* Lồng route con */}
            </Route>
        ) : (
            <Route
                key={index}
                path={route.path}
                element={
                    Layout === null ? (
                        <Page />
                    ) : (
                        <Layout>
                            {isAdminRoute ? (
                                <RoleBasedRoute userRole={userRole}>
                                    <Page />
                                </RoleBasedRoute>
                            ) : (
                                <Page />
                            )}
                        </Layout>
                    )
                }
            />
        );
    });

function App() {
    const token = localStorage.getItem('token'); // Giả sử token được lưu trong localStorage
    const userRole = getRoleFromToken(token);

    return (
        <Router>
            <CartProvider>
                <AddressProvider>
                    <Routes>{renderRoutes(publicRoutes, userRole)}</Routes>
                </AddressProvider>
            </CartProvider>
        </Router>
    );
}

export default App;
