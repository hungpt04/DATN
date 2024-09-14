import Navbar from './Navbar/Navbar';


function DefaultLayout({ children }) {
    return (
        <div>
            <Navbar />
            <div className="container">
                <div className="content">{children}</div>
            </div>
        </div>
    );
}

export default DefaultLayout;