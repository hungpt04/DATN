import Navbar from './Navbar/Navbar';

function DefaultLayout({ children }) {
    return (
        <div className="DefaultLayout">
            <Navbar />
            <div className="container">
                <div className="content">{children}</div>
            </div>
        </div>
    );
}

export default DefaultLayout;