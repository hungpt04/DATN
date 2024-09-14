import Sidebar from './Sidebar/Sidebar';



function AdminLayout({ children }) {
    return (
        <div style={{ width: "100vw", height: "100vh"}}>
            <Sidebar/>
            {/* <div className="container">
                <div className="content">{children}</div>
            </div> */}
        </div>
    );
}

export default AdminLayout;