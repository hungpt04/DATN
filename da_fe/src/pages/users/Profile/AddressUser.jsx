import React, { useEffect, useState } from 'react';
import { Plus } from 'react-feather';
import swal from 'sweetalert';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const mockAddresses = [
  {
    id: 1,
    hoTen: "Nguyễn Văn A",
    sdt: "0123456789",
    diaChiCuThe: "123 Đường ABC",
    idTinh: "01",
    idHuyen: "001",
    idXa: "0001",
    loai: 0
  },
  {
    id: 2,
    hoTen: "Trần Thị B",
    sdt: "0987654321",
    diaChiCuThe: "456 Đường DEF",
    idTinh: "02",
    idHuyen: "002",
    idXa: "0002",
  },
];

const mockProvinces = [
  { code: "01", name: "Hà Nội" },
  { code: "02", name: "TP Hồ Chí Minh" },
];

const mockDistricts = {
  "01": [
    { code: "001", name: "Quận Hoàn Kiếm" },
    { code: "002", name: "Quận Đống Đa" },
  ],
  "02": [
    { code: "001", name: "Quận 1" },
    { code: "002", name: "Quận 2" },
  ],
};

const mockWards = {
  "001": [
    { code: "0001", name: "Phường Hàng Bạc" },
    { code: "0002", name: "Phường Hàng Đào" },
  ],
  "002": [
    { code: "0001", name: "Phường Trung Liệt" },
    { code: "0002", name: "Phường Kim Liên" },
  ],
};

export default function AddressUser() {
  const [open, setOpen] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedWard, setSelectedWard] = useState('');
  const [listDiaChi, setListDiaChi] = useState(mockAddresses);
  const [diaChiData, setDiaChiData] = useState({
    hoTen: "",
    sdt: "",
    idTinh: "",
    idHuyen: "",
    idXa: "",
    diaChiCuThe: "",
    loai: ""
  });

  // Giả lập lấy id từ token
  const token = localStorage.getItem('token');
  let userId;

  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      userId = decodedToken.id; // Giả sử id được lưu trong token
    } catch (error) {
      console.error("Token không hợp lệ:", error);
    }
  }

  useEffect(() => {
    // Giả lập lấy danh sách tỉnh
    setProvinces(mockProvinces);
  }, []);

  const fetchDistricts = (provinceId) => {
    // Giả lập lấy danh sách huyện
    setDistricts(mockDistricts[provinceId] || []);
    setSelectedDistrict(''); // Reset huyện khi tỉnh thay đổi
    setSelectedWard('');    // Reset xã khi tỉnh thay đổi
  };

  useEffect(() => {
    if (selectedProvince) {
      fetchDistricts(selectedProvince);
    } else {
      setDistricts([]);
    }
  }, [selectedProvince]);

  const fetchWards = (districtId) => {
    // Giả lập lấy danh sách xã
    setWards(mockWards[districtId] || []);
  };

  useEffect(() => {
    if (selectedDistrict) {
      fetchWards(selectedDistrict);
    } else {
      setWards([]);
      setSelectedWard('');
    }
  }, [selectedDistrict]);

  const handleInputChange = (event) => {
    setDiaChiData({ ...diaChiData, [event.target.name]: event.target.value });
  };

  const handleAddAddress = () => {
    handleOpen(null);
  };

  const handleClose = () => {
    setOpen(false);
    resetAddressState();
  };

  const handleOpen = (address) => {
    if (address) {
      setDiaChiData(address);
      setSelectedProvince(address.idTinh);
      setSelectedDistrict(address.idHuyen);
      setSelectedWard(address.idXa);
      setOpen(true);
    } else {
      resetAddressState();
      setOpen(true);
    }
  };

  const resetAddressState = () => {
    setDiaChiData({
      hoTen: '',
      sdt: '',
      diaChiCuThe: '',
      idTinh: null,
      idHuyen: null,
      idXa: null,
    });
    setSelectedProvince('');
    setSelectedDistrict('');
    setSelectedWard('');
  };

  const onCreateDiaChi = (e) => {
    e.preventDefault();

    const newDiaChi = {
      id: listDiaChi.length + 1, // Tạo ID giả lập
      hoTen: diaChiData.hoTen,
      sdt: diaChiData.sdt,
      idTinh: selectedProvince,
      idHuyen: selectedDistrict,
      idXa: selectedWard,
      diaChiCuThe: diaChiData.diaChiCuThe,
    };

    setListDiaChi((prev) => [...prev, newDiaChi]);
    swal({
      title: "Thành công!",
      text: "Thêm địa chỉ thành công!",
      icon: "success",
      buttons: false,
      timer: 2000,
    }).then(() => {
      handleClose();
    });
  };

  const handleDeleteClick = (idDC) => {
    setDeleteId(idDC);
    setOpenDeleteModal(true);
  };

  const deleteDiaChi = () => {
    setListDiaChi((prev) => prev.filter((item) => item.id !== deleteId));
    setOpenDeleteModal(false);
    setDeleteId(null);
  };

  const handleSetDefault = (id) => {
    setListDiaChi((prev) => {
      const updatedAddress = prev.map((address) =>
        address.id === id
          ? { ...address, loai: 0 } // Thiết lập mặc định cho địa chỉ được chọn
          : { ...address, loai: 1 } // Các địa chỉ khác không còn mặc định
      )
      return updatedAddress.sort((a, b) => a.loai - b.loai);
    });
  };

  return (
    <div className="mx-2 my-2">
      <div className='flex justify-between items-center'>
        <p className='text-2xl font-semibold'>Địa chỉ của tôi</p>
        <button
          onClick={handleAddAddress}
          className='flex items-center px-4 py-2 font-medium uppercase text-blue-600 rounded hover:text-blue-700 hover:bg-gray-100'
        >
          <Plus className="w-5 h-5 mr-1" />
          Thêm địa chỉ
        </button>

        {open && (
          <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
            <div className='bg-white p-6 rounded-sm w-[750px] max-w-[90%]'>
              <p className='text-xl font-semibold mb-4'>
                {diaChiData.id ? 'Cập nhật địa chỉ' : 'Địa chỉ mới'}
              </p>
              <hr className='mb-4' />

              <div className='grid grid-cols-2 gap-4'>
                <div className='mb-2'>
                  <label className='block mb-1'>Tên</label>
                  <input
                    type='text'
                    className='w-full px-3 py-2 border rounded focus:outline-none focus:border-gray-700'
                    placeholder='Họ và tên'
                    name='hoTen'
                    value={diaChiData.hoTen}
                    onChange={handleInputChange}
                  />
                </div>
                <div className='mb-2'>
                  <label className='block mb-1'>Số điện thoại</label>
                  <input
                    type='text'
                    className='w-full px-3 py-2 border rounded focus:outline-none focus:border-gray-700'
                    name='sdt'
                    value={diaChiData.sdt}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className='grid grid-cols-1 gap-4 mt-4'>
                <div className='mb-2'>
                  <label className='block mb-1'>Tỉnh/thành phố</label>
                  <select className='w-full px-3 py-2 border rounded focus:outline-none focus:border-gray-700'
                    value={selectedProvince}
                    onChange={(e) => setSelectedProvince(e.target.value)}
                  >
                    <option value="">Chọn tỉnh/thành phố</option>
                    {provinces.map((province) => (
                      <option key={province.id} value={province.id}>
                        {province.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className='mb-2'>
                  <label className='block mb-1'>Quận/huyện</label>
                  <select
                    className='w-full px-3 py-2 border rounded focus:outline-none focus:border-gray-700'
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    disabled={!selectedProvince}
                  >
                    <option value="">Chọn quận/huyện</option>
                    {districts.map((district) => (
                      <option key={district.id} value={district.id}>
                        {district.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className='mb-2'>
                  <label className='block mb-1'>Xã/phường</label>
                  <select
                    className='w-full px-3 py-2 border rounded focus:outline-none focus:border-gray-700'
                    value={selectedWard}
                    onChange={(e) => setSelectedWard(e.target.value)}
                    disabled={!selectedDistrict}
                  >
                    <option value="">Chọn xã/phường</option>
                    {wards.map((ward) => (
                      <option key={ward.id} value={ward.id}>
                        {ward.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className='mb-2'>
                  <label className='block mb-1'>Địa chỉ cụ thể</label>
                  <input
                    type='text'
                    className='w-full px-3 py-2 border rounded focus:outline-none focus:border-gray-700'
                    placeholder='Địa chỉ cụ thể'
                    name='diaChiCuThe'
                    value={diaChiData.diaChiCuThe}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className='flex justify-end mt-4' role='group'>
                <button
                  onClick={handleClose}
                  className='px-9 py-2 rounded-l-sm hover:bg-zinc-100'
                >
                  Trở lại
                </button>
                <button
                  onClick={onCreateDiaChi}
                  className='px-4 py-2 text-white bg-blue-600 rounded-r-sm hover:bg-blue-700'
                >
                  {diaChiData.id ? 'Cập nhật' : 'Hoàn thành'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className='mt-4'>
        {listDiaChi.length > 0 ? (
          // <ul>
            listDiaChi.map((address) => (
              <div key={address.id} className='mb-4 p-4 flex justify-between border rounded'>
                <div>
                  <p><strong>Tên: </strong>{address.hoTen}</p>
                  <p><strong>Số điện thoại: </strong>{address.sdt}</p>
                  <p className="mb-2"><strong>Địa chỉ: </strong>{address.diaChiCuThe}, {address.idXa}, {address.idHuyen}, {address.idTinh}</p>
                  {address.loai == 0 && <span className="px-2 py-1 text-sm border border-green-500 text-green-500 bg-green-50 rounded-sm">Mặc định</span>}
                </div>
                <div className="flex flex-col">
                  <div className="flex justify-end">
                    <button
                      onClick={() => handleOpen(address)}
                      className='px-4 py-1 text-blue-600 hover:text-blue-700 hover:bg-gray-100 rounded-sm'
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDeleteClick(address.id)}
                      disabled={address.loai === 0}
                      style={address.loai === 0 ? { display: "none" } : {}}
                      className='px-4 py-1 text-blue-600 hover:text-blue-700 hover:bg-gray-100 rounded-sm'
                    >
                      Xóa
                    </button>
                  </div>
                  <button
                    onClick={() => handleSetDefault(address.id)}
                    disabled={address.loai === 0}
                    className={`mt-2 px-4 py-1 rounded-sm ${address.loai === 0
                        ? "border border-zinc-300 text-zinc-500"
                        : "border border-zinc-300 hover:bg-gray-50"
                      }`}
                  >
                    Thiết lập mặc định
                  </button>
                </div>

              </div>
            ))
          // </ul>
        ) : (
          <p>Chưa có địa chỉ nào.</p>
        )}
      </div>

      {openDeleteModal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
          <div className='bg-white p-6 rounded-sm w-[400px] max-w-[90%]'>
            <p className='text-lg font-semibold'>Bạn có chắc chắn muốn xóa địa chỉ này?</p>
            <div className='flex justify-end mt-4'>
              <button
                onClick={() => setOpenDeleteModal(false)}
                className='px-4 py-2 mr-2 text-gray-600 border rounded hover:bg-gray-200'
              >
                Hủy
              </button>
              <button
                // onClick={handleDeleteAddress}
                className='px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700'
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
