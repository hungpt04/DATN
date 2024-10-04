import Navbar from './Navbar/Navbar';
import Footer from './Footer/Footer';

function DefaultLayout({ children }) {
    return (
        <div className="DefaultLayout">
            <Navbar />
            <div className="container">
                <div className="content">{children}</div>
            </div>
            <Footer />
        </div>
    );
}

export default DefaultLayout;
