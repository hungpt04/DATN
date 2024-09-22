import Sidebar from './Sidebar/Sidebar';

function AdminLayout({ children }) {
  return (
    <div className="flex">
      {/* Sidebar cố định với kích thước */}
      <Sidebar />
      {/* Nội dung chính thay đổi dựa vào hover của Sidebar */}
      <div className="flex-1 transition-all duration-300 group-hover:ml-[300px] ml-[250px]">
        <div className="p-6 bg-gray-100 min-h-screen">
          <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;
