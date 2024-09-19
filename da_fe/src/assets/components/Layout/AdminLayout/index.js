import Sidebar from './Sidebar/Sidebar';
import './AdminLayout.css';

function AdminLayout({ children }) {
    return (
        <div>
            <Sidebar />
            <div className="container-sidebar">
                <div className="content-sidebar">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default AdminLayout;
