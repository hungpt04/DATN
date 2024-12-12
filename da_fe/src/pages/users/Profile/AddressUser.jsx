import React, { useEffect, useState } from 'react';
import { Plus } from 'react-feather';
import swal from 'sweetalert';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from "axios";

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
  const [listDiaChi, setListDiaChi] = useState([]);
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [diaChiData, setDiaChiData] = useState({
    ten: "",
    sdt: "",
    idTinh: null,
    idHuyen: null,
    idXa: null,
    diaChiCuThe: "",
    loai: false
  });

  const [khachId, setKhachId] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token'); // Lấy token từ localStorage
    if (token) {
      const fetchUserInfo = async () => {
        try {
          const response = await axios.get("http://localhost:8080/api/tai-khoan/my-info", {
            headers: {
              Authorization: `Bearer ${token}`, // Gửi token trong header
            },
          });
          setKhachId(response.data.id);
        } catch (error) {
          console.error("Error fetching user data:", error);
          Swal.fire({
            icon: "error",
            title: "Lỗi!",
            text: "Có lỗi xảy ra khi tải dữ liệu!",
          });
        }
      };
      fetchUserInfo();
    }
  }, [navigate]);

  const getDiaChilenForm = async (khachId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/dia-chi/tai-khoan/${khachId}`);

      const addresses = response.data
      console.log(response.data);

      if (!addresses || addresses.length === 0) {
        // Swal.fire({
        //   icon: 'info',
        //   title: 'Thông báo',
        //   text: 'Bạn chưa có địa chỉ nào.',
        // });
        return; // Dừng hàm nếu không có địa chỉ
      }

      // Lấy tên tỉnh, huyện, xã cho từng địa chỉ
      const updatedAddresses = await Promise.all(addresses.map(async (address) => {
        // if (!address.idTinh || !address.idHuyen || !address.idXa) {
        //   console.warn('Invalid address ID:', address);
        //   return {
        //     ...address,
        //     tenTinh: 'Không tìm thấy',
        //     tenHuyen: 'Không tìm thấy',
        //     tenXa: 'Không tìm thấy',
        //   };
        // }
        try {
          const provinceResponse = await fetch(`https://provinces.open-api.vn/api/p/${address.idTinh}`);
          const provinceData = await provinceResponse.json();

          const districtResponse = await fetch(`https://provinces.open-api.vn/api/d/${address.idHuyen}`);
          const districtData = await districtResponse.json();

          const wardResponse = await fetch(`https://provinces.open-api.vn/api/d/${address.idXa}`);
          const wardData = await wardResponse.json();

          return {
            ...address,
            tenTinh: provinceData.name || '',
            tenHuyen: districtData.name || '',
            tenXa: wardData.name || '',
          };
        } catch (error) {
          console.error('Error fetching address details:', error);
          return {
            ...address,
            tenTinh: 'Không tìm thấy',
            tenHuyen: 'Không tìm thấy',
            tenXa: 'Không tìm thấy',
          };
        }
      }));

      setListDiaChi(updatedAddresses)

    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Lỗi!',
        text: 'Có lỗi xảy ra khi tải thông tin địa chỉ! ' + error.message,
      });
    }
  };

  useEffect(() => {
    if (khachId) {
      getDiaChilenForm(khachId);
    }
  }, [khachId]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const addressResponse = await fetch(`http://localhost:8080/api/dia-chi/tai-khoan/${khachId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Gửi token trong header
          },
        })

        // const userData = await userResponse.json();
        const addressData = await addressResponse.json();

        // Cập nhật địa chỉ
        if (addressData && addressData.length > 0) {
          const address = addressData[0];
          setDiaChiData({
            diaChiCuThe: address.diaChiCuThe || '',
            idTinh: address.idTinh || '',
            idHuyen: address.idHuyen || '',
            idXa: address.idXa || '',
          });

          // Thiết lập các dropdown địa chỉ
          setSelectedProvince(address.idTinh || '');

          // Fetch districts nếu có tỉnh
          if (address.idTinh) {
            const districtResponse = await fetch(`https://provinces.open-api.vn/api/p/${address.idTinh}?depth=2`);
            const districtData = await districtResponse.json();
            setDistricts(districtData.districts || []);
            setSelectedDistrict(address.idHuyen || '');

            // Fetch wards nếu có huyện
            if (address.idHuyen) {
              const wardResponse = await fetch(`https://provinces.open-api.vn/api/d/${address.idHuyen}?depth=2`);
              const wardData = await wardResponse.json();
              setWards(wardData.wards || []);
              setSelectedWard(address.idXa || '');
            }
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        Swal.fire({
          icon: 'error',
          title: 'Lỗi!',
          text: 'Có lỗi xảy ra khi tải dữ liệu! ' + error.message,
        });
      }
    };

    if (khachId) {
      fetchUserData();
    }
  }, [khachId]);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await fetch('https://provinces.open-api.vn/api/p/');
        const data = await response.json();
        console.log(data);
        setProvinces(data || []);
      } catch {
        Swal.fire({
          icon: 'error',
          title: 'Lỗi!',
          text: 'Có lỗi xảy ra khi tải danh sách tỉnh/thành!',
        });
      }
    };
    fetchProvinces();
  }, []);

  // Hàm để lấy danh sách huyện
  const fetchDistricts = async (provinceId) => {
    try {
      const response = await fetch(`https://provinces.open-api.vn/api/p/${provinceId}?depth=2`);
      const data = await response.json();
      console.log(data);
      setDistricts(data.districts || []);

      setSelectedDistrict(""); // Reset huyện khi tỉnh thay đổi
      setSelectedWard("");    // Reset xã khi tỉnh thay đổi
    } catch (error) {
      console.error('Error fetching districts:', error);
      setDistricts([]);
    }
  };

  useEffect(() => {
    if (selectedProvince) {
      fetchDistricts(selectedProvince);
    } else {
      setDistricts([]);
    }
  }, [selectedProvince]);

  const fetchWards = async (districtId) => {
    try {
      // Kiểm tra districtId hợp lệ
      if (!districtId) {
        console.warn('District ID is empty');
        setWards([]);
        return;
      }

      const response = await fetch(`https://provinces.open-api.vn/api/d/${districtId}?depth=2`);

      // Kiểm tra response
      // if (!response.ok) {
      //   throw new Error(`HTTP error! status: ${response.status}`);
      // }

      const data = await response.json();
      // setWards(data.wards || []);

      // Kiểm tra dữ liệu trả về
      if (!data || !data.wards) {
        console.warn('No wards data found', data);
        setWards([]);
        return;
      }

      // Đảm bảo dữ liệu ward hợp lệ
      const validWards = data.wards.filter(ward =>
        ward && ward.code && ward.name
      );

      setWards(validWards);

      // Reset ward nếu không có ward nào
      if (validWards.length === 0) {
        setSelectedWard('');
      }
    } catch (error) {
      console.error('Error fetching wards:', error);
      setWards([]);
      setSelectedWard('');
    }
  };

  // Useeffect để fetch wards
  useEffect(() => {
    const safelyFetchWards = async () => {
      if (selectedDistrict) {
        try {
          await fetchWards(selectedDistrict);
        } catch (error) {
          console.error('Error in useEffect fetchWards:', error);
        }
      } else {
        setWards([]);
        setSelectedWard('');
      }
    };

    safelyFetchWards();
  }, [selectedDistrict]);


  const handleInputChange = (event) => {
    setDiaChiData({ ...diaChiData, [event.target.name]: event.target.value });
  };

  const onCreateDiaChi = async (e) => {
    e.preventDefault();

    try {
      //Tạo địa chỉ với ID tài khoản đăng nhập
      const diaChiPayload = {
        taiKhoan: { id: khachId },
        ten: diaChiData.ten,
        sdt: diaChiData.sdt,
        idTinh: selectedProvince,
        idHuyen: selectedDistrict,
        idXa: selectedWard,
        diaChiCuThe: diaChiData.diaChiCuThe,
      };

      const diaChiResponse = await fetch('http://localhost:8080/api/dia-chi/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Gửi token trong header
        },
        body: JSON.stringify(diaChiPayload),
      });

      console.log("address: ", diaChiResponse)

      if (!diaChiResponse.ok) {
        throw new Error('Failed to create address');
      }

      const newDiaChi = await diaChiResponse.json(); // Lấy địa chỉ mới từ phản hồi
      setListDiaChi((prev) => [...prev, newDiaChi]); // Cập nhật danh sách địa chỉ

      // Hiển thị thông báo thành công và điều hướng về trang khác
      swal({
        title: "Thành công!",
        text: "Thêm địa chỉ thành công!",
        icon: "success",
        buttons: false,
        timer: 2000, // Tự động đóng sau 2 giây
      }).then(() => {
        handleClose();
      });

    } catch (error) {
      console.error('Error:', error);

      // Hiển thị thông báo lỗi
      swal({
        title: "Lỗi!",
        text: "Có lỗi xảy ra khi thêm nhân viên!",
        icon: "error",
        button: "OK",
      });
    };
  };

  const onUpdateDiaChi = async (e) => {
    e.preventDefault();

    try {
      // Tạo payload cho địa chỉ cập nhật
      const diaChiPayload = {
        id: diaChiData.id,
        taiKhoan: { id: khachId },
        ten: diaChiData.ten,
        sdt: diaChiData.sdt,
        idTinh: selectedProvince, // Sử dụng selectedProvince
        idHuyen: selectedDistrict, // Sử dụng selectedDistrict
        idXa: selectedWard, // Sử dụng selectedWard
        diaChiCuThe: diaChiData.diaChiCuThe,
      };

      const diaChiResponse = await fetch(`http://localhost:8080/api/dia-chi/update/${diaChiData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(diaChiPayload),
      });

      if (!diaChiResponse.ok) {
        throw new Error('Failed to update address');
      }

      const updatedDiaChi = await diaChiResponse.json();
      setListDiaChi((prev) => prev.map(address => address.id === updatedDiaChi.id ? updatedDiaChi : address));

      // Gọi lại hàm getDiaChilenForm để cập nhật danh sách địa chỉ
      getDiaChilenForm(khachId);
      // Gọi lại hàm fetchDistricts và fetchWards
      // await fetchDistricts(selectedProvince);
      // await fetchWards(selectedDistrict);

      swal({
        title: "Thành công!",
        text: "Cập nhật địa chỉ thành công!",
        icon: "success",
        buttons: false,
        timer: 2000,
      }).then(() => {
        handleClose();
      });

    } catch (error) {
      console.error('Error:', error);
      swal({
        title: "Lỗi!",
        text: "Có lỗi xảy ra khi cập nhật địa chỉ!",
        icon: "error",
        button: "OK",
      });
    }
  };

  // const handleUpdateUser = async (e) => {
  //   e.preventDefault();
  //   setError('');

  //   try {
  //     // Lấy ID địa chỉ trước tiên
  //     const getAddressIdResponse = await fetch(`http://localhost:8080/api/dia-chi/get-id-dia-chi-by-id-tai-khoan/${khachId}`);

  //     if (!getAddressIdResponse.ok) {
  //       throw new Error('Không thể lấy ID địa chỉ');
  //     }

  //     const addressId = await getAddressIdResponse.json(); // Lấy ID địa chỉ

  //     // Tạo FormData         
  //     const formDataToSend = new FormData();

  //     // Thêm các trường thông tin
  //     formDataToSend.append('hoTen', formData.hoTen);
  //     formDataToSend.append('sdt', formData.sdt);
  //     formDataToSend.append('email', formData.email);
  //     formDataToSend.append('matKhau', formData.matKhau);
  //     formDataToSend.append('gioiTinh', formData.gioiTinh);
  //     formDataToSend.append('vaiTro', formData.vaiTro);
  //     formDataToSend.append('ngaySinh', formData.ngaySinh);
  //     formDataToSend.append('cccd', formData.cccd);
  //     formDataToSend.append('trangThai', formData.trangThai);

  //     // Thêm avatar nếu có
  //     if (formData.avatar) {
  //       formDataToSend.append('avatar', formData.avatar);
  //     }

  //     // Update user account
  //     const userResponse = await fetch(`http://localhost:8080/api/tai-khoan/updateTaiKhoan/${id}`, {
  //       method: 'PUT',
  //       body: formDataToSend
  //     });

  //     if (!userResponse.ok) {
  //       const errorText = await userResponse.text();
  //       throw new Error(`Failed to update user account: ${errorText}`);
  //     }

  //     // Update address
  //     const diaChiPayload = {
  //       id: addressId, // Sử dụng ID địa chỉ đã lấy được
  //       taiKhoan: {
  //         id: id  // This should be the user/customer account ID
  //       },
  //       ten: formData.ten,
  //       sdt: formData.sdt,
  //       idTinh: diaChiData.idTinh,
  //       idHuyen: diaChiData.idHuyen,
  //       idXa: selectedWard,
  //       diaChiCuThe: diaChiData.diaChiCuThe,
  //     };

  //     console.log('DiaChi Payload:', diaChiPayload); // Log payload để kiểm tra

  //     const addressResponse = await fetch(`http://localhost:8080/api/dia-chi/update/${addressId}`, {
  //       method: 'PUT',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(diaChiPayload),
  //     });

  //     if (!addressResponse.ok) {
  //       const errorText = await addressResponse.text();
  //       throw new Error(`Failed to update address: ${errorText}`);
  //     }

  //     // Kiểm tra response
  //     const responseData = await addressResponse.json();
  //     console.log('Address Update Response:', responseData);

  //     Swal.fire({
  //       icon: 'success',
  //       title: 'Thành công!',
  //       text: 'Cập nhật nhân viên thành công!',
  //     }).then(() => {
  //       navigate('/admin/tai-khoan/nhan-vien');
  //     });
  //   } catch (error) {
  //     console.error('Error:', error);
  //     Swal.fire({
  //       icon: 'error',
  //       title: 'Lỗi!',
  //       text: error.message || 'Có lỗi xảy ra khi cập nhật nhân viên!',
  //     });
  //   }
  // };

  const handleDeleteClick = (idDC) => {
    setDeleteId(idDC);
    setOpenDeleteModal(true);
  };

  const deleteDiaChi = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/dia-chi/delete/${deleteId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete address');
      }

      setListDiaChi((prev) => prev.filter((item) => item.id !== deleteId));
      setOpenDeleteModal(false);
      setDeleteId(null);
      swal({
        title: "Thành công!",
        text: "Xóa địa chỉ thành công!",
        icon: "success",
        buttons: false,
        timer: 2000,
      });
    } catch (error) {
      console.error('Error:', error);
      swal({
        title: "Lỗi!",
        text: "Có lỗi xảy ra khi xóa địa chỉ!",
        icon: "error",
        button: "OK",
      });
    }
  };

  // const handleSetDefault = (id) => {
  //   setListDiaChi((prev) => {
  //     const updatedAddress = prev.map((address) =>
  //       address.id === id
  //         ? { ...address, loai: true } // Thiết lập mặc định cho địa chỉ được chọn
  //         : { ...address, loai: false } // Các địa chỉ khác không còn mặc định
  //     )
  //     return updatedAddress.sort((a, b) => a.loai - b.loai);
  //   });
  // };

  const handleSetDefault = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/dia-chi/default/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to set default address');
      }

      // Cập nhật danh sách địa chỉ sau khi thiết lập mặc định thành công
      setListDiaChi((prev) => {
        return prev.map((address) =>
          address.id === id
            ? { ...address, loai: true } // Thiết lập địa chỉ này là mặc định
            : { ...address, loai: false } // Các địa chỉ khác không còn mặc định
        ).sort((a, b) => (b.loai === true ? 1 : 0) - (a.loai === true ? 1 : 0)); // Sắp xếp lại danh sách
      });

      // swal({
      //   title: "Thành công!",
      //   text: "Địa chỉ đã được thiết lập mặc định!",
      //   icon: "success",
      //   buttons: false,
      //   timer: 2000,
      // });
    } catch (error) {
      console.error('Error:', error);
      swal({
        title: "Lỗi!",
        text: "Có lỗi xảy ra khi thiết lập địa chỉ mặc định!",
        icon: "error",
        button: "OK",
      });
    }
  };

  const handleAddAddress = () => {
    resetAddressState();
    handleOpen(null);
  };

  const handleClose = () => {
    setOpen(false);
    resetAddressState();
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

  const handleOpen = (address) => {
    if (address) {
      setDiaChiData(address);
      setSelectedProvince(address.idTinh || "");
      // setSelectedDistrict(address.idHuyen || "");
      // setSelectedWard(address.idXa || "");
      setOpen(true);

      // Fetch districts nếu có tỉnh
      if (address.idTinh) {
        fetchDistricts(address.idTinh).then(() => {
          // Sau khi fetch districts, thiết lập selectedDistrict
          setSelectedDistrict(address.idHuyen || "");

          // Fetch wards nếu có huyện
          if (address.idHuyen) {
            fetchWards(address.idHuyen).then(() => {
              // Sau khi fetch wards, thiết lập selectedWard
              setSelectedWard(address.idXa || "");
            });
          }
        });
      }
    } else {
      resetAddressState();
      setOpen(true);
    }
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
                    // placeholder='Họ và tên'
                    name='ten'
                    value={diaChiData.ten}
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
                      <option key={province.code} value={province.code}>
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
                      <option key={district.code} value={district.code}>
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
                      <option key={ward.code} value={ward.code}>
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
                  onClick={diaChiData.id ? onUpdateDiaChi : onCreateDiaChi}
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
                <p><strong>Tên: </strong>{address.ten}</p>
                <p><strong>Số điện thoại: </strong>{address.sdt}</p>
                <p className="mb-2"><strong>Địa chỉ: </strong>{address.diaChiCuThe}, {address.tenXa}, {address.tenHuyen}, {address.tenTinh}</p>
                {address.loai == true ? <span className="px-2 py-1 text-sm border border-green-500 text-green-500 bg-green-50 rounded-sm">Mặc định</span> : ""}
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
                    disabled={address.loai === false}
                    style={address.loai === true ? { display: "none" } : {}}
                    className='px-4 py-1 text-blue-600 hover:text-blue-700 hover:bg-gray-100 rounded-sm'
                  >
                    Xóa
                  </button>
                </div>
                <button
                  onClick={() => handleSetDefault(address.id)}
                  disabled={address.loai === true}
                  className={`mt-2 px-4 py-1 rounded-sm ${address.loai === true
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
            <div className='flex justify-end mt-4' role="group">
              <button
                onClick={() => setOpenDeleteModal(false)}
                className='px-5 py-2 text-gray-700 rounded-l-sm hover:bg-gray-100'
              >
                Hủy
              </button>
              <button
                onClick={deleteDiaChi}
                className='px-5 py-2 text-white bg-red-500 rounded-r-sm hover:bg-red-600'
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
