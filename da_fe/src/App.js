import { Fragment } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { publicRoutes } from './routes';
import DefaultLayout from './components/Layout/DefaultLayout';
import { CartProvider } from './pages/users/Cart/CartContext';

function App() {
    return (
        <Router>
            <div className="App">
                {/* Bọc toàn bộ ứng dụng trong CartProvider */}
                <CartProvider>
                    <Routes>
                        {publicRoutes.map((route, index) => {
                            const Page = route.component;
                            let Layout = DefaultLayout;

                            if (route.layout) {
                                Layout = route.layout;
                            } else if (route.layout === null) {
                                Layout = Fragment;
                            }

                            return (
                                <Route
                                    key={index}
                                    path={route.path}
                                    element={
                                        <Layout>
                                            <Page />
                                        </Layout>
                                    }
                                />
                            );
                        })}
                    </Routes>
                </CartProvider>
            </div>
        </Router>
    );
}

export default App;
