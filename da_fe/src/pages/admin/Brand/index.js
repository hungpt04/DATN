import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

function Brand() {
  const [brands, setBrands] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [brandToDelete, setBrandToDelete] = useState(null);
  
  // Pagination 
  const [currentPage, setCurrentPage] = useState(1);
  const brandsPerPage = 4; 

  const loadBrands = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/thuonghieu');
      setBrands(response.data);
    } catch (error) {
      console.error('Failed to fetch brands', error);
    }
  };

  useEffect(() => {
    loadBrands();
  }, []);

  // Delete a brand
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/thuonghieu/${id}`);
      loadBrands();
      setShowModal(false);
    } catch (error) {
      console.error('Failed to delete brand', error);
    }
  };

  // Open modal to confirm deletion
  const confirmDelete = (id) => {
    setBrandToDelete(id);
    setShowModal(true);
  };

  // Get current brands based on pagination
  const indexOfLastBrand = currentPage * brandsPerPage;
  const indexOfFirstBrand = indexOfLastBrand - brandsPerPage;
  const currentBrands = brands.slice(indexOfFirstBrand, indexOfLastBrand);

  // Calculate total pages
  const totalPages = Math.ceil(brands.length / brandsPerPage);

  // Pagination controls
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="p-6 max-w-7xl mx-auto bg-white rounded-lg">
      <h4 className="text-center text-5xl font-bold text-gray-800">
        Danh sách thương hiệu
      </h4>
      <div>
        <div className="flex justify-end mb-4">
          <Link
            to="add"
            className="bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg shadow-md text-xl transition duration-300"
          >
            Add
          </Link>
        </div>
        <table className="w-full table-auto bg-white rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="py-4 px-6 text-left">STT</th>
              <th className="py-4 px-6 text-left">ID</th>
              <th className="py-4 px-6 text-left">Tên</th>
              <th className="py-4 px-6 text-left">Trạng thái</th>
              <th className="py-4 px-6 text-left">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {currentBrands.map((brand, index) => (
              <tr key={brand.id} className="border-t border-gray-200 hover:bg-gray-100">
                <td className="py-4 px-6">{indexOfFirstBrand + index + 1}</td>
                <td className="py-4 px-6">{brand.id}</td>
                <td className="py-4 px-6">{brand.ten}</td>
                <td className="py-4 px-6">{brand.trangThai ? 'Active' : 'Inactive'}</td>
                <td className="py-4 px-6">
                  <div className="flex space-x-4">
                    <Link
                      to={`/admin/quan-ly-san-pham/thuong-hieu/update/${brand.id}`}
                      className="bg-yellow-400 hover:bg-yellow-500 text-black py-2 px-4 rounded-lg shadow-md text-sm transition duration-300"
                    >
                      Update
                    </Link>
                    <button
                      onClick={() => confirmDelete(brand.id)}
                      className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg shadow-md text-sm transition duration-300"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Modal for delete confirmation */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold mb-4">Xác nhận xóa</h3>
              <p>Bạn có chắc chắn muốn xóa thương hiệu này không?</p>
              <div className="mt-4 flex justify-end space-x-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded-lg"
                >
                  Hủy
                </button>
                <button
                  onClick={() => handleDelete(brandToDelete)}
                  className="bg-red-400 hover:bg-red-600 text-white py-2 px-4 rounded-lg"
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Pagination controls */}
        <div className="flex justify-center mt-10 space-x-2">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-2 rounded-lg shadow-md text-lg font-bold"
          >
            <ArrowBackIcon />
          </button>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => paginate(index + 1)}
              className={`py-2 px-4 rounded-lg shadow-md text-lg ${
                currentPage === index + 1
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-2 rounded-lg shadow-md text-lg font-bold"
          >
            <ArrowForwardIcon />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Brand;
