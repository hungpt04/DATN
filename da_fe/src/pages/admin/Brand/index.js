import React from "react";

function Brand() {
  return (
    <div className="p-8 max-w-7xl mx-auto bg-white rounded-lg">
      <h4 className="text-center text-5xl font-bold text-gray-800 mb-10">Danh sách thương hiệu</h4>
      <div>
        <div className="flex justify-end mb-4">
          <a
            className="bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg shadow-md text-xl transition duration-300"
            href="/shop/sanpham/add"
          >
            Add
          </a>
        </div>
        <table className="w-full table-auto bg-white rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="py-4 px-6 text-left">STT</th>
              <th className="py-4 px-6 text-left">ID</th>
              <th className="py-4 px-6 text-left">Mã</th>
              <th className="py-4 px-6 text-left">Tên</th>
              <th className="py-4 px-6 text-left">Trạng thái</th>
              <th className="py-4 px-6 text-left">Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-gray-200 hover:bg-gray-100">
              <td className="py-4 px-6">01</td>
              <td className="py-4 px-6">1</td>
              <td className="py-4 px-6">TH001</td>
              <td className="py-4 px-6">Yonex</td>
              <td className="py-4 px-6">Active</td>
              <td className="py-4 px-6">
                <div className="flex space-x-4">
                  <button className="bg-yellow-400 hover:bg-yellow-500 text-black py-2 px-4 rounded-lg shadow-md text-sm transition duration-300">
                    Update
                  </button>
                  <button className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg shadow-md text-sm transition duration-300">
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        {/* Pagination */}
        <div className="flex justify-center mt-[170px] space-x-2">
          <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-lg shadow-md text-lg font-bold">&lt;</button>
          <button className="bg-blue-500 hover:bg-blue-600 text-white    py-2 px-4 rounded-lg shadow-md text-lg">1</button>
          <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-lg shadow-md text-lg">2</button>
          <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-lg shadow-md text-lg">3</button>
          <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-lg shadow-md text-lg font-bold">&gt;</button>
        </div>
      </div>
    </div>
  );
}

export default Brand;
