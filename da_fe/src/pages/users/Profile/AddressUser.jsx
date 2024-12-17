import React, { useEffect, useState } from 'react';
import { Plus } from 'react-feather';
import swal from 'sweetalert';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
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
  const [khachId, setKhachId] = useState(null);

  const [diaChiData, setDiaChiData] = useState({
    ten: "",
    sdt: "",
    idTinh: null,
    idHuyen: null,
    idXa: null,
    diaChiCuThe: "",
    loai: 0 // 0 cho không phải địa chỉ mặc định, 1 cho địa chỉ mặc định
  });

  const [errors, setErrors] = useState({
    fullName: "",
    phoneNumber: "",
    provinceId: "",
    districtId: "",
    wardId: "",
    specificAddress: ""
  })

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
      const addresses = response.data;

      if (!addresses || addresses.length === 0) {
        return; // Dừng hàm nếu không có địa chỉ
      }

      // Lấy tên tỉnh, huyện, xã cho từng địa chỉ
      const updatedAddresses = await Promise.all(addresses.map(async (address) => {
        try {
          const [provinceResponse, districtResponse, wardResponse] = await Promise.all([
            axios.get(`https://provinces.open-api.vn/api/p/${address.idTinh}`),
            axios.get(`https://provinces.open-api.vn/api/d/${address.idHuyen}`),
            axios.get(`https://provinces.open-api.vn/api/w/${address.idXa}`)
          ]);




          // const provinceResponse = await fetch(`https://provinces.open-api.vn/api/p/${address.idTinh}`);
          // const provinceData = await provinceResponse.json();

          // const districtResponse = await fetch(`https://provinces.open-api.vn/api/d/${address.idHuyen}`);
          // const districtData = await districtResponse.json();

          // const wardResponse = await fetch(`https://provinces.open-api.vn/api/d/${address.idXa}`);
          // const wardData = await wardResponse.json();


          return {
            ...address,
            tenTinh: provinceResponse.data.name || '',
            tenHuyen: districtResponse.data.name || '',
            tenXa: wardResponse.data.name || ''




            // ...address,
            // tenTinh: provinceData.name || '',
            // tenHuyen: districtData.name || '',
            // tenXa: wardData.name || '',

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

      setListDiaChi(updatedAddresses);

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
    const fetchProvinces = async () => {
      try {
        const response = await fetch('https://provinces.open-api.vn/api/p/');
        const data = await response.json();
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

  const fetchDistricts = async (provinceId) => {
    try {
      const response = await fetch(`https://provinces.open-api.vn/api/p/${provinceId}?depth=2`);
      if (!response.ok) {
        throw new Error('Failed to fetch districts');
      }
      const data = await response.json();

      const validDistricts = data.districts
        ? data.districts.filter(district =>
          district && district.code && district.name)
        : [];
      return validDistricts;    // Reset xã khi tỉnh thay đổi
    } catch (error) {
      console.error('Error fetching districts:', error);
      // setDistricts([]);
      return [];
    }
  };



  // const fetchWards = async (districtId) => {
  //   try {
  //     if (!districtId) {
  //       // setWards([]);
  //       return;
  //     }

  //     const response = await fetch(`https://provinces.open-api.vn/api/d/${districtId}?depth=2`);
  //     // const data = await response.json();

  //     // if (!data || !data.wards) {
  //     //   setWards([]);
  //     //   return;
  //     // }


  //     // const validWards = data.wards.filter(ward =>
  //     //   ward && ward.code && ward.name
  //     // );

  //     // setWards(validWards);

  //     // if (validWards.length === 0) {
  //     //   setSelectedWard('');
  //     // }
  //   } catch (error) {
  //     console.error('Error fetching wards:', error);
  //     setWards([]);
  //     setSelectedWard('');
  //   }
  // };

  const fetchWards = async (districtId) => {
    try {
      if (!districtId) {
        return [];
      }

      const response = await fetch(`https://provinces.open-api.vn/api/d/${districtId}?depth=2`);

      if (!response.ok) {
        throw new Error('Không thể tải xã/phường');
      }

      const data = await response.json();

      const validWards = data.wards
        ? data.wards.filter(ward =>
          ward && ward.code && ward.name
        )
        : []

      return validWards;
    } catch (error) {
      console.error('Lỗi khi tải xã/phường:', error);
      return [];
    }
  }

  useEffect(() => {
    if (selectedProvince) {
      fetchDistricts(selectedProvince).
        then(districts => {
          setDistricts(districts)

          if (districts.length === 0) {
            Swal.fire({
              icon: 'warning',
              title: 'Thông báo',
              text: 'Không tìm thấy quận/huyện cho tỉnh này',
            })
          }
        })
    } else {
      setDistricts([]);
      setSelectedDistrict('');
      setSelectedWard('');
    }
  }, [selectedProvince]);

  useEffect(() => {
    if (selectedDistrict) {
      fetchWards(selectedDistrict)
        .then(wards => {
          setWards(wards)
          if (wards.length === 0) {
            Swal.fire({
              icon: 'warning',
              title: 'Thông báo',
              text: 'Không tìm thấy xã/phường cho quận/huyện này',
            });
          }
        })
    } else {
      setWards([]);
      setSelectedWard('');
    }
  }, [selectedDistrict]);

  const handleInputChange = (event) => {
    setDiaChiData({ ...diaChiData, [event.target.name]: event.target.value });
  };

  const handleSubmitDiaChi = async (e) => {
    e.preventDefault()
    const newErrors = {}
    let check = 0

    if (!diaChiData.ten.trim()) {
      newErrors.fullName = "*Bạn chưa nhập họ tên"
      check++
    } else if (diaChiData.ten.length > 100) {
      newErrors.fullName = "*Họ tên không dài quá 100 ký tự"
      check++
    } else {
      const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/
      if (specialCharsRegex.test(diaChiData.ten)) {
        newErrors.fullName = "*Họ tên không chứa ký tự đặc biệt"
        check++
      } else {
        newErrors.fullName = ""
      }
    }

    if (!diaChiData.sdt.trim()) {
      newErrors.phoneNumber = "*Bạn chưa nhập số điện thoại"
      check++
    } else {
      const phoneNumberRegex = /^(0[1-9][0-9]{8})$/
      if (!phoneNumberRegex.test(diaChiData.sdt.trim())) {
        newErrors.phoneNumber = "*Số điện thoại không hợp lệ"
        check++
      } else {
        newErrors.phoneNumber = ""
      }
    }

    if (!selectedProvince) {
      newErrors.provinceId = "*Bạn chưa chọn tỉnh/ thành phố"
      check++
    }

    if (!selectedDistrict) {
      newErrors.districtId = "*Bạn chưa chọn quận/ huyện"
      check++
    }

    if (!selectedWard) {
      newErrors.wardId = "*Bạn chưa chọn xã/ phường"
      check++
    }

    if (!diaChiData.diaChiCuThe.trim()) {
      newErrors.specificAddress = "*Bạn chưa nhập địa chỉ cụ thể"
      check++
    } else if (diaChiData.diaChiCuThe.length > 255) {
      newErrors.specificAddress = "*Địa chỉ cụ thể không dài quá 255 ký tự"
    } else {
      newErrors.specificAddress = ""
    }

    if (check > 0) {
      setErrors(newErrors)
      return
    }

    try {
      const diaChiPayload = {
        taiKhoan: { id: khachId },
        ten: diaChiData.ten,
        sdt: diaChiData.sdt,
        idTinh: selectedProvince,
        idHuyen: selectedDistrict,
        idXa: selectedWard,
        diaChiCuThe: diaChiData.diaChiCuThe,
        loai: diaChiData.loai || 0
      }

      let response
      let successMsg
      // let result

      if (diaChiData.id) {
        // cập nhật
        response = await fetch(`http://localhost:8080/api/dia-chi/update/${diaChiData.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            ...diaChiPayload,
            id: diaChiData.id
          }),
        })
        successMsg = "Cập nhật địa chỉ thành công!"
      } else {
        // thêm
        response = await fetch('http://localhost:8080/api/dia-chi/add', {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(diaChiPayload),
        })
        successMsg = "Thêm địa chỉ thành công!"
      }

      // kiểm tra kết quả response
      if (!response.ok) {
        throw new Error("Không thành công")
      }

      // xử lý kết quả
      const result = await response.json()

      // lấy thông tin tỉnh, huyện, xã
      // const updatedResult = await fetchAdressDetails(result)
      const [provinceResponse, districtResponse, wardResponse] = await Promise.all([
        axios.get(`https://provinces.open-api.vn/api/p/${result.idTinh}`),
        axios.get(`https://provinces.open-api.vn/api/d/${result.idHuyen}`),
        axios.get(`https://provinces.open-api.vn/api/w/${result.idXa}`)
      ]);

      // cập nhật kết quả
      const updatedResult = {
        ...result,
        tenTinh: provinceResponse.data.name,
        tenHuyen: districtResponse.data.name,
        tenXa: wardResponse.data.name
      };

      // cập nhật danh sách địa chỉ
      setListDiaChi(prev => {
        if (diaChiData.id) {
          return prev.map(address =>
            address.id === updatedResult.id ? updatedResult : address
          )
        } else {
          // thêm mới
          return [...prev, updatedResult]
        }
      })

      // resetAddressState()
      handleClose()

      swal({
        title: "Thành công!",
        text: successMsg,
        icon: "success",
        buttons: "OK",
        timer: 2000,
      })
    } catch (error) {
      console.error("Lỗi: ", error)
      swal({
        title: "Lỗi!",
        text: "Có lỗi xảy ra khi thực hiện thao tác!",
        icon: "error",
        button: "OK",
      })
    }
  }

  const handleDeleteClick = (idDC) => {
    setDeleteId(idDC);
    setOpenDeleteModal(true);
  };

  const deleteDiaChi = async () => {
    try {
      const addressToDelete = listDiaChi.find(addr => addr.id === deleteId);
      if (addressToDelete && addressToDelete.loai === 1) {
        swal({
          title: "Không thể xóa!",
          text: "Không thể xóa địa chỉ mặc định",
          icon: "warning",
          button: "OK",
        });
        return;
      }
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
        buttons: "OK",
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

  const handleSetDefault = async (id) => {
    try {
      const response = await axios.put(
        `http://localhost:8080/api/dia-chi/default/${id}`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (response.status === 200) {
        setListDiaChi((prevAddresses) =>
          prevAddresses.map((address) => ({
            ...address,
            loai: address.id === id ? 1 : 0 // Chỉ địa chỉ được chọn mới được set thành 1
          }))
        );
      } else {
        throw new Error('Không thể thiết lập địa chỉ mặc định');
      }
    } catch (error) {
      console.error('Lỗi khi thiết lập địa chỉ mặc định:', error);
      swal({
        title: "Lỗi!",
        text: error.response?.data?.message || "Có lỗi xảy ra khi thiết lập địa chỉ mặc định!",
        icon: "error",
        button: "OK",
      });
    }
  };

  const handleOpen = async (address) => {
    if (address) {
      // Reset state trước khi set giá trị mới
      setSelectedProvince("");
      setSelectedDistrict("");
      setSelectedWard("");
      setDistricts([]);
      setWards([]);

      // Set dữ liệu địa chỉ
      setDiaChiData(address);
      setOpen(true);

      if (address.idTinh) {
        try {
          if (address.idTinh) {
            setSelectedProvince(address.idTinh)
          }

          // Fetch districts
          const districtsResponse = await fetch(`https://provinces.open-api.vn/api/p/${address.idTinh}?depth=2`);
          const districtsData = await districtsResponse.json();

          const validDistricts = districtsData.districts
            ? districtsData.districts.filter(district =>
              district && district.code && district.name)
            : [];

          setDistricts(validDistricts);

          // Nếu có huyện, set district
          if (address.idHuyen) {
            setSelectedDistrict(address.idHuyen);

            // Fetch wards
            const wardsResponse = await fetch(`https://provinces.open-api.vn/api/d/${address.idHuyen}?depth=2`);
            const wardsData = await wardsResponse.json();

            const validWards = wardsData.wards
              ? wardsData.wards.filter(ward =>
                ward && ward.code && ward.name)
              : [];

            setWards(validWards);

            // Nếu có xã, set ward
            if (address.idXa) {
              setSelectedWard(address.idXa);
            }
          }
        } catch (error) {
          console.error("Error in handleOpen:", error);
          Swal.fire({
            icon: 'error',
            title: 'Lỗi!',
            text: 'Không thể tải thông tin địa chỉ',
          });
        }
      }
    } else {
      // Reset form khi không có địa chỉ
      resetAddressState();
      setOpen(true);
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
      ten: '',
      sdt: '',
      diaChiCuThe: '',
      idTinh: null,
      idHuyen: null,
      idXa: null,
      loai: 0 // Đặt lại loại về mặc định
    })

    setErrors({
      fullName: "",
      phoneNumber: "",
      provinceId: "",
      districtId: "",
      wardId: "",
      specificAddress: "",
    })
    setSelectedProvince("");
    setSelectedDistrict("");
    setSelectedWard("");
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
                    className={`w-full px-3 py-2 border rounded outline-blue-500 ${errors.fullName ? "border-red-500 focus:outline-red-500 hover:border-red-600" : ""}`}
                    name='ten'
                    value={diaChiData.ten}
                    onChange={(e) => {
                      handleInputChange(e)
                      setErrors({ ...errors, fullName: "" })
                    }}
                  />
                  {errors.fullName && <p className="text-sm mt-1" style={{ color: "red" }}>{errors.fullName}</p>}
                </div>
                <div className='mb-2'>
                  <label className='block mb-1'>Số điện thoại</label>
                  <input
                    type='text'
                    className={`w-full px-3 py-2 border rounded outline-blue-500 ${errors.phoneNumber ? "border-red-500 hover:border-red-600 focus:outline-red-500" : ""}`}
                    name='sdt'
                    value={diaChiData.sdt}
                    onChange={(e) => {
                      handleInputChange(e)
                      setErrors({ ...errors, phoneNumber: "" })
                    }}

                  />
                  {errors.phoneNumber && <p className="text-sm mt-1" style={{ color: "red" }}>{errors.phoneNumber}</p>}
                </div>
              </div>

              <div className='grid grid-cols-1 gap-4 mt-4'>
                <div className='mb-2'>
                  <label className='block mb-1'>Tỉnh/thành phố</label>
                  <select className={`w-full px-3 py-2 border rounded outline-blue-500 ${errors.provinceId ? "border-red-500 hover:border-red-600 focus:outline-red-500" : ""}`}
                    value={selectedProvince}
                    onChange={(e) => {
                      setSelectedProvince(e.target.value)
                      setErrors({ ...errors, provinceId: "" })
                    }}
                  >
                    <option value="">Chọn tỉnh/thành phố</option>
                    {provinces.map((province) => (
                      <option key={province.code} value={province.code}>
                        {province.name}
                      </option>
                    ))}
                  </select>
                  {errors.provinceId && <p className="text-sm mt-1" style={{ color: "red" }}>{errors.provinceId}</p>}
                </div>

                <div className='mb-2'>
                  <label className='block mb-1'>Quận/huyện</label>
                  <select
                    className={`w-full px-3 py-2 border rounded outline-blue-500 ${errors.districtId ? "border-red-500 hover:border-red-600 focus:outline-red-500" : ""}`}
                    value={selectedDistrict}
                    onChange={(e) => {
                      setSelectedDistrict(e.target.value)
                      setErrors({ ...errors, districtId: "" })
                    }}
                    disabled={!selectedProvince}
                  >
                    <option value="">Chọn quận/huyện</option>
                    {districts.map((district) => (
                      <option key={district.code} value={district.code}>
                        {district.name}
                      </option>
                    ))}
                  </select>
                  {errors.districtId && <p className="text-sm mt-1" style={{ color: "red" }}>{errors.districtId}</p>}
                </div>

                <div className='mb-2'>
                  <label className='block mb-1'>Xã/phường</label>
                  <select
                    className={`w-full px-3 py-2 border rounded outline-blue-500 ${errors.wardId ? "border-red-500 hover:border-red-600 focus:outline-red-500" : ""}`}
                    value={selectedWard}
                    onChange={(e) => {
                      setSelectedWard(e.target.value)
                      setErrors({ ...errors, wardId: "" })
                    }}
                    disabled={!selectedDistrict}
                  >
                    <option value="">Chọn xã/phường</option>
                    {wards.map((ward) => (
                      <option key={ward.code} value={ward.code}>
                        {ward.name}
                      </option>
                    ))}
                  </select>
                  {errors.wardId && <p className="text-sm mt-1" style={{ color: "red" }}>{errors.wardId}</p>}
                </div>

                <div className='mb-2'>
                  <label className='block mb-1'>Địa chỉ cụ thể</label>
                  <input
                    type='text'
                    className={`w-full px-3 py-2 border rounded outline-blue-500 ${errors.specificAddress ? "border-red-500 hover:border-red-600 focus:outline-red-500" : ""}`}
                    placeholder='Địa chỉ cụ thể'
                    name='diaChiCuThe'
                    value={diaChiData.diaChiCuThe}
                    onChange={(e) => {
                      handleInputChange(e)
                      setErrors({ ...errors, specificAddress: "" })
                    }}
                  />
                  {errors.specificAddress && <p className="text-sm mt-1" style={{ color: "red" }}>{errors.specificAddress}</p>}
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
                  onClick={handleSubmitDiaChi}
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
          listDiaChi.map((address) => (
            <div key={address.id} className='mb-4 p-4 flex justify-between border rounded space-x-2'>
              <div>
                <p><strong>Tên: </strong>{address.ten}</p>
                <p><strong>Số điện thoại: </strong>{address.sdt}</p>
                <p className="mb-2"><strong>Địa chỉ: </strong>{address.diaChiCuThe}, {address.tenXa}, {address.tenHuyen}, {address.tenTinh}</p>
                {address.loai === 1 ? <span className="px-2 py-1 text-sm border border-green-500 text-green-500 bg-green-50 rounded-sm">Mặc định</span> : ""}
              </div>
              <div className="flex flex-col">
                <div className="flex justify-end">
                  <button
                    onClick={() => handleOpen(address)}
                    className='px-4 py-1 text-blue-600 hover:text-blue-700 hover:bg-gray-100 rounded-sm'
                  >
                    Sửa
                  </button>
                  {address.loai !== 1 ? (
                    <button
                      onClick={() => handleDeleteClick(address.id)}
                      className='px-4 py-1 text-blue-600 hover:text-blue-700 hover:bg-gray-100 rounded-sm'
                    >
                      Xóa
                    </button>
                  ) : null}
                </div>
                <button
                  onClick={() => handleSetDefault(address.id)}
                  disabled={address.loai === 1}
                  className={`mt-2 px-4 py-1 rounded-sm ${address.loai === 1
                    ? "border border-zinc-300 text-zinc-500"
                    : "border border-zinc-300 hover:bg-gray-50"
                    }`}
                >
                  Thiết lập mặc định
                </button>
              </div>
            </div>
          ))
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