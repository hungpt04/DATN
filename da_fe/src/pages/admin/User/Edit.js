// import { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import Swal from 'sweetalert2';
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// function EditUser() {
//     const navigate = useNavigate();
//     const [provinces, setProvinces] = useState([]);
//     const [districts, setDistricts] = useState([]);
//     const [wards, setWards] = useState([]);
//     const [selectedProvince, setSelectedProvince] = useState('');
//     const [selectedDistrict, setSelectedDistrict] = useState('');
//     const [selectedWard, setSelectedWard] = useState('');
//     const [previewImage, setPreviewImage] = useState(null);
//     const [error, setError] = useState('');
//     const { id } = useParams();
//     const [diaChi, setDiaChi] = useState([])

//     const [formData, setFormData] = useState({
//         ma: '',
//         hoTen: '',
//         sdt: '',
//         email: '',
//         gioiTinh: 0,
//         vaiTro: 'User',
//         avatar: null,
//         ngaySinh: '',
//         cccd: '',
//         trangThai: 1,
//     });

//     const [diaChiData, setDiaChiData] = useState({
//         ten: '',
//         sdt: '',
//         diaChiCuThe: '',
//         idTinh: '',
//         idHuyen: '',
//         idXa: '',
//         idTaiKhoan: id,
//         loai: 0
//     });

//     const loadDiaChi = (id) => {
//         axios
//             .get(`http://localhost:8080/api/dia-chi/getAllDiaChi`, {
//                 params: { idTaiKhoan: id },
//             })
//             .then((response) => {
//                 setDiaChi(response.data.content);
//             })
//             .catch((error) => {
//                 console.error("Lỗi khi gọi API:", error);
//             });
//     };

//     useEffect(() => {
//         if (id) {
//             loadDiaChi(id);
//         }
//     }, [id]);

//     useEffect(() => {
//         const fetchUserData = async () => {
//             try {
//                 const [userResponse, addressResponse] = await Promise.all([
//                     fetch(`http://localhost:8080/api/nhan-vien/detail/${id}`),
//                     fetch(`http://localhost:8080/api/dia-chi/tai-khoan/${id}`)

//                 ]);

//                 const userData = await userResponse.json();
//                 const addressData = await addressResponse.json();

//                 setFormData(userData);

//                 if (userData.avatar) {
//                     setPreviewImage(userData.avatar);
//                 }

//                 if (addressData && addressData.length > 0) {
//                     const address = addressData[0];
//                     setDiaChiData({
//                         ten: address.ten || '',
//                         sdt: address.sdt || '',
//                         diaChiCuThe: address.diaChiCuThe || '',
//                         idTinh: address.idTinh || '',
//                         idHuyen: address.idHuyen || '',
//                         idXa: address.idXa || '',
//                     });

//                     setSelectedProvince(address.idTinh || '');

//                     if (address.idTinh) {
//                         const districtResponse = await fetch(`https://provinces.open-api.vn/api/p/${address.idTinh}?depth=2`);
//                         const districtData = await districtResponse.json();
//                         setDistricts(districtData.districts || []);
//                         setSelectedDistrict(address.idHuyen || '');

//                         if (address.idHuyen) {
//                             const wardResponse = await fetch(`https://provinces.open-api.vn/api/d/${address.idHuyen}?depth=2`);
//                             const wardData = await wardResponse.json();
//                             setWards(wardData.wards || []);
//                             setSelectedWard(address.idXa || '');
//                         }
//                     }
//                 }
//             } catch (error) {
//                 console.error('Error fetching user data:', error);
//                 Swal.fire({
//                     icon: 'error',
//                     title: 'Lỗi!',
//                     text: 'Có lỗi xảy ra khi tải dữ liệu! ' + error.message,
//                 });
//             }
//         };

//         if (id) {
//             fetchUserData();
//         }
//     }, [id]);

//     useEffect(() => {
//         const fetchProvinces = async () => {
//             try {
//                 const response = await fetch('https://provinces.open-api.vn/api/p/');
//                 const data = await response.json();
//                 setProvinces(data || []);
//             } catch {
//                 Swal.fire({
//                     icon: 'error',
//                     title: 'Lỗi!',
//                     text: 'Có lỗi xảy ra khi tải danh sách tỉnh/thành!',
//                 });
//             }
//         };
//         fetchProvinces();
//     }, []);

//     const fetchDistricts = async (provinceId) => {
//         try {
//             const response = await fetch(`https://provinces.open-api.vn/api/p/${provinceId}?depth=2`);
//             const data = await response.json();
//             setDistricts(data.districts || []);
//             setSelectedDistrict(''); 
//             setSelectedWard(''); 
//         } catch (error) {
//             console.error('Error fetching districts:', error);
//             setDistricts([]);
//         }
//     };

//     useEffect(() => {
//         if (selectedProvince) {
//             fetchDistricts(selectedProvince);
//         } else {
//             setDistricts([]);
//         }
//     }, [selectedProvince]);


//     const fetchWards = async (districtId) => {
//         try {
//             if (!districtId) {
//                 console.warn('District ID is empty');
//                 setWards([]);
//                 return;
//             }

//             const response = await fetch(`https://provinces.open-api.vn/api/d/${districtId}?depth=2`);

//             if (!response.ok) {
//                 throw new Error(`HTTP error! status: ${response.status}`);
//             }

//             const data = await response.json();

//             if (!data || !data.wards) {
//                 console.warn('No wards data found', data);
//                 setWards([]);
//                 return;
//             }

//             const validWards = data.wards.filter(ward =>
//                 ward && ward.code && ward.name
//             );

//             setWards(validWards);

//             if (validWards.length === 0) {
//                 setSelectedWard('');
//             }
//         } catch (error) {
//             console.error('Error fetching wards:', error);
//             setWards([]);
//             setSelectedWard('');
//         }
//     };

//     useEffect(() => {
//         const safelyFetchWards = async () => {
//             if (selectedDistrict) {
//                 try {
//                     await fetchWards(selectedDistrict);
//                 } catch (error) {
//                     console.error('Error in useEffect fetchWards:', error);
//                 }
//             } else {
//                 setWards([]);
//                 setSelectedWard('');
//             }
//         };

//         safelyFetchWards();
//     }, [selectedDistrict]);


//     const handleInputChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     }

//     const handleImageChange = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             setFormData({ ...formData, avatar: file })
//             const reader = new FileReader()
//             reader.onload = () => {
//                 setPreviewImage(reader.result)
//             }
//             reader.readAsDataURL(file);
//         }
//     };

//     const handleUpdateUser = async (e) => {
//         e.preventDefault();
//         setError('');

//         try {
//             const getAddressIdResponse = await fetch(`http://localhost:8080/api/dia-chi/get-id-dia-chi-by-id-tai-khoan/${id}`);

//             if (!getAddressIdResponse.ok) {
//                 throw new Error('Không thể lấy ID địa chỉ');
//             }

//             const addressId = await getAddressIdResponse.json();
 
//             const formDataToSend = new FormData();

//             formDataToSend.append('hoTen', formData.hoTen);
//             formDataToSend.append('sdt', formData.sdt);
//             formDataToSend.append('email', formData.email);
//             formDataToSend.append('matKhau', formData.matKhau);
//             formDataToSend.append('gioiTinh', formData.gioiTinh);
//             formDataToSend.append('vaiTro', formData.vaiTro);
//             formDataToSend.append('ngaySinh', formData.ngaySinh);
//             formDataToSend.append('cccd', formData.cccd);
//             formDataToSend.append('trangThai', formData.trangThai);

//             if (formData.avatar) {
//                 formDataToSend.append('avatar', formData.avatar);
//             }

//             // Update user account
//             const userResponse = await fetch(`http://localhost:8080/api/tai-khoan/updateTaiKhoan/${id}`, {
//                 method: 'PUT',
//                 body: formDataToSend
//             });

//             if (!userResponse.ok) {
//                 const errorText = await userResponse.text();
//                 throw new Error(`Failed to update user account: ${errorText}`);
//             }

//             const diaChiPayload = {
//                 id: addressId,
//                 taiKhoan: {
//                     id: id  
//                 },
//                 ten: diaChiData.ten,
//                 sdt: diaChiData.sdt,
//                 idTinh: diaChiData.idTinh,
//                 idHuyen: diaChiData.idHuyen,
//                 idXa: selectedWard,
//                 diaChiCuThe: diaChiData.diaChiCuThe,
//                 loai: 0
//             };

//             console.log('DiaChi Payload:', diaChiPayload);

//             const addressResponse = await fetch(`http://localhost:8080/api/dia-chi/updatee/${addressId}`, {
//                 method: 'PUT',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(diaChiPayload),
//             });

//             if (!addressResponse.ok) {
//                 const errorText = await addressResponse.text();
//                 throw new Error(`Failed to update address: ${errorText}`);
//             }

//             const responseData = await addressResponse.json();
//             console.log('Address Update Response:', responseData);

//             Swal.fire({
//                 icon: 'success',
//                 title: 'Thành công!',
//                 text: 'Cập nhật nhân viên thành công!',
//             }).then(() => {
//                 navigate('/admin/tai-khoan/nhan-vien');
//             });
//         } catch (error) {
//             console.error('Error:', error);
//             Swal.fire({
//                 icon: 'error',
//                 title: 'Lỗi!',
//                 text: error.message || 'Có lỗi xảy ra khi cập nhật nhân viên!',
//             });
//         }
//     };

//     const handleNavigateToSale = () => {
//         navigate('/admin/tai-khoan/nhan-vien');
//     };

//     return (
//         <div>
//             <div className="font-bold text-sm">
//                 <span
//                     className="cursor-pointer"
//                     onClick={handleNavigateToSale}
//                 >
//                     Nhân viên
//                 </span>
//                 <span className="text-gray-400 ml-2">/ Chỉnh sửa nhân viên</span>
//             </div>
//             <div className="bg-white p-4 rounded-md shadow-lg">
//                 <div className='flex'>
//                     <div className="w-1/4 pr-4">
//                         <h2 className="text-xl font-semibold text-gray-800 mb-8">Thông tin nhân viên</h2>
//                         <hr />
//                         {/* Ảnh đại diện */}
//                         <div className="flex justify-center items-center mt-4">
//                             <label className="cursor-pointer">
//                                 <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
//                                 <div className="w-32 h-32 border-4 border-dashed border-gray-400 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 overflow-hidden">
//                                     {previewImage ? (
//                                         <img src={previewImage || formData.avatar} alt="Preview" className="w-full h-full object-cover" />
//                                     ) : (
//                                         'Chọn ảnh'
//                                     )}
//                                 </div>
//                             </label>
//                         </div>

//                         <div className="col-span-2 mt-4 hidden">
//                             <input
//                                 type="text"
//                                 name="ma"
//                                 value={formData.ma}
//                                 className="w-full p-4 border-2 border-gray-400 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
//                                 onChange={handleInputChange}
//                             />
//                         </div>

//                         {/* Họ và tên */}
//                         <div className="col-span-2 mt-4">
//                             <label className="block text-sm font-medium text-gray-700">
//                                 <span className="text-red-500">*</span> Họ Và Tên
//                             </label>
//                             <input
//                                 type="text"
//                                 name="hoTen"
//                                 value={formData.hoTen}
//                                 placeholder="Nhập họ và tên"
//                                 className="w-full p-4 border-2 border-gray-400 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
//                                 onChange={handleInputChange}
//                             />
//                         </div>

//                         <div className="col-span-2 mt-4">
//                             <label className="block text-sm font-medium text-gray-700">
//                                 <span className="text-red-500">*</span> Số CCCD
//                             </label>
//                             <input
//                                 type="text"
//                                 name="cccd"
//                                 value={formData.cccd}
//                                 placeholder="Nhập số CCCD"
//                                 className="w-full p-4 border-2 border-gray-400 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
//                                 onChange={handleInputChange}
//                             />
//                         </div>

//                         <div className="col-span-2 mt-4">
//                             <label className="block text-sm font-medium text-gray-700">
//                                 <span className="text-red-500">*</span> Email
//                             </label>
//                             <input
//                                 type="email"
//                                 name="email"
//                                 value={formData.email}
//                                 placeholder="Nhập email"
//                                 className="w-full p-4 border-2 border-gray-400 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
//                                 onChange={handleInputChange}
//                             />
//                         </div>

//                         <div className="col-span-2 mt-4">
//                             <label className="block text-sm font-medium text-gray-700">
//                                 <span className="text-red-500">*</span> Số Điện Thoại
//                             </label>
//                             <input
//                                 type="text"
//                                 name="sdt"
//                                 value={formData.sdt}
//                                 placeholder="Nhập số điện thoại"
//                                 className="w-full p-4 border-2 border-gray-400 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
//                                 onChange={handleInputChange}
//                             />
//                         </div>

//                         <div className="col-span-2 mt-4">
//                             <label className="block text-sm font-medium text-gray-700">
//                                 <span className="text-red-500">*</span> Ngày sinh
//                             </label>
//                             <input
//                                 type="date"
//                                 name="ngaySinh"
//                                 value={formData.ngaySinh}
//                                 className="w-full p-4 border-2 border-gray-400 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
//                                 onChange={handleInputChange}
//                             />
//                         </div>

//                         <div className="col-span-2 mt-4">
//                             <label className="block text-sm font-medium text-gray-700">
//                                 <span className="text-red-500">*</span> Giới tính
//                             </label>
//                             <div className="mt-2 flex items-center gap-4">
//                                 <label className="flex items-center">
//                                     <input
//                                         type="radio"
//                                         name="gioiTinh"
//                                         value={0}
//                                         checked={formData.gioiTinh === 0}
//                                         onChange={(e) => setFormData({
//                                             ...formData,
//                                             gioiTinh: parseInt(e.target.value)
//                                         })}
//                                         className="mr-2"
//                                     />
//                                     Nam
//                                 </label>
//                                 <label className="flex items-center">
//                                     <input
//                                         type="radio"
//                                         name="gioiTinh"
//                                         value={1}
//                                         checked={formData.gioiTinh === 1}
//                                         onChange={(e) => setFormData({
//                                             ...formData,
//                                             gioiTinh: parseInt(e.target.value)
//                                         })}
//                                         className="mr-2"
//                                     />
//                                     Nữ
//                                 </label>
//                             </div>
//                         </div>
//                     </div>

//                     <div className='w-3/4 pl-8'>
//                         <h3 className="text-xl font-semibold">Thông tin địa chỉ</h3>
//                         <hr className='mt-8' />
//                         {diaChi.map((item, index) => (
//                             <div key={index}>
//                                 <div className='mt-4'>
//                                     <span className="font-medium">Địa chỉ</span>

//                                     <div className="p-4">
//                                         <div className="grid grid-cols-12 gap-6">
//                                             <div className="col-span-6">
//                                                 <label className="block font-medium mb-1">
//                                                     <span className="required text-red-500"> *</span>Tên
//                                                 </label>
//                                                 <input
//                                                     type="text"
//                                                     name="name"
//                                                     placeholder="Nhập tên"
//                                                     className="w-full p-4 border-2 border-gray-400 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
//                                                     value={diaChiData.ten}
//                                                     onChange={(e) => setDiaChiData((prev) => ({ ...prev, ten: e.target.value }))}
//                                                 />
//                                             </div>

//                                             <div className="col-span-6">
//                                                 <label className="block font-medium mb-1">
//                                                     <span className="required text-red-500"> *</span>Số điện thoại
//                                                 </label>
//                                                 <input
//                                                     type="text"
//                                                     name="phoneNumber"
//                                                     placeholder="Nhập số điện thoại"
//                                                     className="w-full p-4 border-2 border-gray-400 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
//                                                     value={diaChiData.sdt}
//                                                     onChange={(e) => setDiaChiData((prev) => ({ ...prev, sdt: e.target.value }))}
//                                                 />
//                                             </div>
//                                         </div>

//                                         <div className="grid grid-cols-12 gap-4 mt-6">
//                                             <div className="col-span-4">
//                                                 <label className="block font-medium mb-1">
//                                                     <span className="required text-red-500"> *</span>Tỉnh/thành phố
//                                                 </label>
//                                                 <select
//                                                     value={selectedProvince}
//                                                     onChange={(e) => setSelectedProvince(e.target.value)}
//                                                     className="w-full p-4 border-2 border-gray-400 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
//                                                 >
//                                                     <option value="">Chọn tỉnh/thành phố</option>
//                                                     {provinces.map((province) => (
//                                                         <option key={province.code} value={province.code}>
//                                                             {province.name}
//                                                         </option>
//                                                     ))}
//                                                 </select>
//                                             </div>

//                                             <div className="col-span-4">
//                                                 <label className="block font-medium mb-1">
//                                                     <span className="required text-red-500"> *</span>Quận/huyện
//                                                 </label>
//                                                 <select
//                                                     value={selectedDistrict}
//                                                     onChange={(e) => setSelectedDistrict(e.target.value)}
//                                                     className="w-full p-4 border-2 border-gray-400 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
//                                                     disabled={!selectedProvince}
//                                                 >
//                                                     <option value="">Chọn quận/huyện</option>
//                                                     {districts.map((district) => (
//                                                         <option key={district.code} value={district.code}>
//                                                             {district.name}
//                                                         </option>
//                                                     ))}
//                                                 </select>
//                                             </div>

//                                             <div className="col-span-4">
//                                                 <label className="block font-medium mb-1">
//                                                     <span className="required text-red-500"> *</span>Xã/phường/thị trấn
//                                                 </label>
//                                                 <select
//                                                     value={selectedWard}
//                                                     onChange={(e) => setSelectedWard(e.target.value)}
//                                                     className="w-full p-4 border-2 border-gray-400 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
//                                                     disabled={!selectedDistrict}
//                                                 >
//                                                     <option value="">Chọn xã/phường</option>
//                                                     {wards.map((ward) => (
//                                                         <option key={ward.code} value={ward.code}>
//                                                             {ward.name}
//                                                         </option>
//                                                     ))}
//                                                 </select>
//                                             </div>
//                                         </div>

//                                         <div className="mt-6">
//                                             <label className="block font-medium mb-1">
//                                                 <span className="required text-red-500"> *</span>Địa chỉ cụ thể
//                                             </label>
//                                             <input
//                                                 type="text"
//                                                 value={diaChiData.diaChiCuThe}
//                                                 placeholder="Nhập địa chỉ cụ thể"
//                                                 className="w-full p-4 border-2 border-gray-400 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
//                                                 onChange={(e) =>
//                                                     setDiaChiData((prev) => ({ ...prev, diaChiCuThe: e.target.value }))
//                                                 }
//                                             />
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 </div>

//                 {/* Nút Cập Nhật */}
//                 <div className="mt-8 flex justify-end">
//                     <button
//                         onClick={handleUpdateUser}
//                         className="bg-[#2f19ae] text-white px-8 py-4 rounded-md shadow-md hover:bg-blue-700 transition duration-300"
//                     >
//                         Cập nhật
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default EditUser;


import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function EditUser() {
    const navigate = useNavigate();
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedWard, setSelectedWard] = useState('');
    const [previewImage, setPreviewImage] = useState(null);
    const [error, setError] = useState({});
    const { id } = useParams();
    const [diaChi, setDiaChi] = useState([]);

    const [formData, setFormData] = useState({
        ma: '',
        hoTen: '',
        sdt: '',
        email: '',
        gioiTinh: 0,
        vaiTro: 'User',
        avatar: null,
        ngaySinh: '',
        cccd: '',
        trangThai: 1,
    });

    const [diaChiData, setDiaChiData] = useState({
        ten: '',
        sdt: '',
        diaChiCuThe: '',
        idTinh: '',
        idHuyen: '',
        idXa: '',
        idTaiKhoan: id,
        loai: 0,
    });

    // const [emailExists, setEmailExists] = useState(false);

    // //  kiểm tra email
    // const checkMail = async (email) => {
    //     try {
    //         const response = await axios.get(`http://localhost:8080/auth/check-mail?email=${email}`);
    //         console.log('Full response data:', response.data);

    //         // Log thông tin chi tiết để kiểm tra
    //         console.log('Response status:', response.status);

    //         // Kiểm tra nhiều điều kiện
    //         return !!(
    //             response.data &&
    //             // response.data.id &&
    //             response.data.email === email
    //         );
    //     } catch (error) {
    //         // Xử lý chi tiết các loại lỗi
    //         if (error.response) {
    //             // The request was made and the server responded with a status code
    //             console.log('Error data:', error.response.data);
    //             console.log('Error status:', error.response.status);
    //         } else if (error.request) {
    //             // The request was made but no response was received
    //             console.log('No response received:', error.request);
    //         } else {
    //             // Something happened in setting up the request that triggered an Error
    //             console.log('Error message:', error.message);
    //         }

    //         return false;
    //     }
    // };

    const validateData = async (data) => {
        const errors = {};
        // Lấy ngày hiện tại
        const currentDate = new Date();
        const minBirthYear = 1900;
        let check = 0;

        // validate họ tên
        if (!data.hoTen.trim()) {
            errors.hoTen = '*Bạn chưa nhập họ tên';
            check++;
        } else if (data.hoTen.trim().length > 100) {
            errors.hoTen = '*Họ tên không dài quá 100 ký tự';
            check++;
        } else {
            errors.hoTen = '';
        }

        // validate email
        if (!data.email.trim()) {
            errors.email = '*Bạn chưa nhập địa chỉ email';
            check++;
        } else if (!/\S+@\S+\.\S+/.test(data.email.trim())) {
            errors.email = '*Địa chỉ email không hợp lệ';
            check++;
        } else {
            // Kiểm tra email đã tồn tại
            // const emailExists = await checkMail(data.email);
            // if (emailExists) {
            //     errors.email = '*Email đã tồn tại trong hệ thống';
            //     check++;
            // }
        }

        // validate số điện thoại
        if (!data.sdt.trim()) {
            errors.sdt = '*Bạn chưa nhập số điện thoại';
            check++;
        } else {
            const phoneNumberRegex = /^(0[1-9][0-9]{8})$/;
            if (!phoneNumberRegex.test(data.sdt.trim())) {
                errors.sdt = '*Số điện thoại không hợp lệ';
                check++;
            } else {
                errors.sdt = '';
            }
        }

        // validate ngày sinh
        if (!data.ngaySinh) {
            errors.ngaySinh = '*Bạn chưa nhập ngày sinh';
            check++;
        } else {
            const ngaySinh = new Date(data.ngaySinh);
            if (isNaN(ngaySinh.getTime())) {
                errors.ngaySinh = '*Ngày sinh không hợp lệ';
                check++;
            } else if (ngaySinh.getFullYear() < minBirthYear) {
                errors.ngaySinh = '*Năm sinh không hợp lệ';
                check++;
            } else if (ngaySinh > currentDate) {
                errors.ngaySinh = '*Ngày sinh không hợp lệ';
                check++;
            }
        }

        // validate ngày sinh
        if (data.gioiTinh === null) {
            errors.gioiTinh = '*Bạn chưa chọn giới tính';
            check++;
        } else {
            errors.gioiTinh = '';
        }

        // Kiểm tra mã tỉnh (3 số đầu tiên)
        const validProvinceCodes = [
            '001',
            '002',
            '003',
            '004',
            '005',
            '006',
            '007',
            '008',
            '009',
            '010',
            '011',
            '012',
            '013',
            '014',
            '015',
            '016',
            '017',
            '018',
            '019',
            '020',
            '021',
            '022',
            '023',
            '024',
            '025',
            '026',
            '027',
            '028',
            '029',
            '030',
            '031',
            '032',
            '033',
            '034',
            '035',
            '036',
            '037',
            '038',
            '039',
            '040',
            '041',
            '042',
            '043',
            '044',
            '045',
            '046',
            '047',
            '048',
            '049',
            '050',
            '051',
            '052',
            '053',
            '054',
            '055',
            '056',
            '057',
            '058',
            '059',
            '060',
            '061',
            '062',
            '063',
        ]; // Thêm các mã tỉnh khác nếu cần

        if (!data.cccd.trim()) {
            errors.cccd = '*Bạn chưa nhập cccd';
            check++;
        } else if (data.cccd.trim().length !== 12) {
            errors.cccd = '*CCCD không đúng định dạng';
            check++;
        } else if (!/^\d{12}$/.test(data.cccd.trim())) {
            errors.cccd = '*CCCD chỉ chứa các chữ số';
            check++;
        } else {
            const provinceCode = data.cccd.substring(0, 3);
            if (!validProvinceCodes.includes(provinceCode)) {
                errors.cccd = '*Mã cccd không hợp lệ';
                check++;
            } else {
                errors.cccd = '';
            }
        }

        return { errors, check };
    };

    const validateAddress = (address) => {
        const errors = {};
        let check = 0;

        if (!address.ten.trim()) {
            errors.ten = '*Bạn chưa nhập họ tên';
            check++;
        } else if (address.ten.length > 100) {
            errors.ten = '*Họ tên không dài quá 100 ký tự';
            check++;
        } else {
            const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/;
            if (specialCharsRegex.test(address.ten)) {
                errors.ten = '*Họ tên không chứa ký tự đặc biệt';
                check++;
            } else {
                errors.ten = '';
            }
        }

        if (!address.sdt.trim()) {
            errors.sdt = '*Bạn chưa nhập số điện thoại';
            check++;
        } else {
            const phoneNumberRegex = /^(0[1-9][0-9]{8})$/;
            if (!phoneNumberRegex.test(address.sdt.trim())) {
                errors.sdt = '*Số điện thoại không hợp lệ';
                check++;
            } else {
                errors.sdt = '';
            }
        }

        if (!address.idTinh) {
            errors.idTinh = '*Bạn chưa chọn tỉnh/ thành phố';
            check++;
        }

        if (!address.idHuyen) {
            errors.idHuyen = '*Bạn chưa chọn quận/ huyện';
            check++;
        }

        if (!address.idXa) {
            errors.idXa = '*Bạn chưa chọn xã/ phường';
            check++;
        }

        if (!address.diaChiCuThe.trim()) {
            errors.diaChiCuThe = '*Bạn chưa nhập địa chỉ cụ thể';
            check++;
        } else if (address.diaChiCuThe.length > 255) {
            errors.diaChiCuThe = '*Địa chỉ cụ thể không dài quá 255 ký tự';
        }

        return { errors, check };
    };

    const loadDiaChi = (id) => {
        axios
            .get(`http://localhost:8080/api/dia-chi/getAllDiaChi`, {
                params: { idTaiKhoan: id },
            })
            .then((response) => {
                setDiaChi(response.data.content);
            })
            .catch((error) => {
                console.error('Lỗi khi gọi API:', error);
            });
    };

    useEffect(() => {
        if (id) {
            loadDiaChi(id);
        }
    }, [id]);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const [userResponse, addressResponse] = await Promise.all([
                    fetch(`http://localhost:8080/api/nhan-vien/detail/${id}`),
                    fetch(`http://localhost:8080/api/dia-chi/tai-khoan/${id}`),
                ]);

                const userData = await userResponse.json();
                const addressData = await addressResponse.json();

                setFormData(userData);

                if (userData.avatar) {
                    setPreviewImage(userData.avatar);
                }

                if (addressData && addressData.length > 0) {
                    const address = addressData[0];
                    setDiaChiData({
                        ten: address.ten || '',
                        sdt: address.sdt || '',
                        diaChiCuThe: address.diaChiCuThe || '',
                        idTinh: address.idTinh || '',
                        idHuyen: address.idHuyen || '',
                        idXa: address.idXa || '',
                    });

                    setSelectedProvince(address.idTinh || '');

                    if (address.idTinh) {
                        const districtResponse = await fetch(
                            `https://provinces.open-api.vn/api/p/${address.idTinh}?depth=2`,
                        );
                        const districtData = await districtResponse.json();
                        setDistricts(districtData.districts || []);
                        setSelectedDistrict(address.idHuyen || '');

                        if (address.idHuyen) {
                            const wardResponse = await fetch(
                                `https://provinces.open-api.vn/api/d/${address.idHuyen}?depth=2`,
                            );
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

        if (id) {
            fetchUserData();
        }
    }, [id]);

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
            const data = await response.json();
            setDistricts(data.districts || []);
            setSelectedDistrict('');
            setSelectedWard('');
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
            if (!districtId) {
                console.warn('District ID is empty');
                setWards([]);
                return;
            }

            const response = await fetch(`https://provinces.open-api.vn/api/d/${districtId}?depth=2`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (!data || !data.wards) {
                console.warn('No wards data found', data);
                setWards([]);
                return;
            }

            const validWards = data.wards.filter((ward) => ward && ward.code && ward.name);

            setWards(validWards);

            if (validWards.length === 0) {
                setSelectedWard('');
            }
        } catch (error) {
            console.error('Error fetching wards:', error);
            setWards([]);
            setSelectedWard('');
        }
    };

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

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, avatar: file });
            const reader = new FileReader();
            reader.onload = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();

        const { errors: personalErrors, check: personalCheck } = await validateData(formData);

        // Validate địa chỉ
        const { errors: addressErrors, check: addressCheck } = validateAddress({
            ...diaChiData,
            idTinh: selectedProvince,
            idHuyen: selectedDistrict,
            idXa: selectedWard,
        });

        // Kết hợp lỗi từ cả hai hàm kiểm tra
        const combinedErrors = { ...personalErrors, ...addressErrors };
        const totalCheck = personalCheck + addressCheck;

        if (totalCheck > 0) {
            setError(combinedErrors);
            console.log('Combined errors:', combinedErrors);
            return;
        }

        setError({});

        try {
            const getAddressIdResponse = await fetch(
                `http://localhost:8080/api/dia-chi/get-id-dia-chi-by-id-tai-khoan/${id}`,
            );

            if (!getAddressIdResponse.ok) {
                throw new Error('Không thể lấy ID địa chỉ');
            }

            const addressId = await getAddressIdResponse.json();

            const formDataToSend = new FormData();

            formDataToSend.append('hoTen', formData.hoTen);
            formDataToSend.append('sdt', formData.sdt);
            formDataToSend.append('email', formData.email);
            formDataToSend.append('matKhau', formData.matKhau);
            formDataToSend.append('gioiTinh', formData.gioiTinh);
            formDataToSend.append('vaiTro', formData.vaiTro);
            formDataToSend.append('ngaySinh', formData.ngaySinh);
            formDataToSend.append('cccd', formData.cccd);
            formDataToSend.append('trangThai', formData.trangThai);

            if (formData.avatar) {
                formDataToSend.append('avatar', formData.avatar);
            }

            // Update user account
            const userResponse = await fetch(`http://localhost:8080/api/tai-khoan/updateTaiKhoan/${id}`, {
                method: 'PUT',
                body: formDataToSend,
            });

            if (!userResponse.ok) {
                const errorText = await userResponse.text();
                throw new Error(`Failed to update user account: ${errorText}`);
            }

            const diaChiPayload = {
                id: addressId,
                taiKhoan: {
                    id: id,
                },
                ten: diaChiData.ten,
                sdt: diaChiData.sdt,
                idTinh: diaChiData.idTinh,
                idHuyen: diaChiData.idHuyen,
                idXa: selectedWard,
                diaChiCuThe: diaChiData.diaChiCuThe,
                loai: 0,
            };

            console.log('DiaChi Payload:', diaChiPayload);

            const addressResponse = await fetch(`http://localhost:8080/api/dia-chi/updatee/${addressId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(diaChiPayload),
            });

            if (!addressResponse.ok) {
                const errorText = await addressResponse.text();
                throw new Error(`Failed to update address: ${errorText}`);
            }

            const responseData = await addressResponse.json();
            console.log('Address Update Response:', responseData);

            Swal.fire({
                icon: 'success',
                title: 'Thành công!',
                text: 'Cập nhật nhân viên thành công!',
            }).then(() => {
                navigate('/admin/tai-khoan/nhan-vien');
            });
        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Lỗi!',
                text: error.message || 'Có lỗi xảy ra khi cập nhật nhân viên!',
            });
        }
    };

    const handleNavigateToSale = () => {
        navigate('/admin/tai-khoan/nhan-vien');
    };

    return (
        <div>
            <div className="font-bold text-sm">
                <span className="cursor-pointer" onClick={handleNavigateToSale}>
                    Nhân viên
                </span>
                <span className="text-gray-400 ml-2">/ Chỉnh sửa nhân viên</span>
            </div>
            <div className="bg-white p-4 rounded-md shadow-lg">
                <div className="flex">
                    <div className="w-1/4 pr-4">
                        <h2 className="text-xl font-semibold text-gray-800 mb-5">Thông tin nhân viên</h2>
                        <hr />
                        {/* Ảnh đại diện */}
                        <div className="flex justify-center items-center mt-4">
                            <label className="cursor-pointer">
                                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                                <div className="w-32 h-32 border-2 border-dashed border-gray-400 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 overflow-hidden">
                                    {previewImage ? (
                                        <img
                                            src={previewImage || formData.avatar}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        'Chọn ảnh'
                                    )}
                                </div>
                            </label>
                        </div>

                        <div className="col-span-2 mt-4 hidden">
                            <input
                                type="text"
                                name="ma"
                                value={formData.ma}
                                className="w-full p-3 border-2 border-gray-400 rounded outline-blue-500"
                                onChange={(e) => {
                                    handleInputChange(e);
                                }}
                            />
                        </div>

                        {/* Họ và tên */}
                        <div className="col-span-2 mt-4">
                            <label className="block text-sm font-medium text-gray-700">Họ Và Tên</label>
                            <input
                                type="text"
                                name="hoTen"
                                value={formData.hoTen}
                                placeholder="Nhập họ và tên"
                                className={`w-full p-3 border-2 border-gray-400 rounded outline-blue-500 ${
                                    error.hoTen ? 'border-red-500 hover:border-red-600 outline-red-500' : ''
                                }`}
                                onChange={(e) => {
                                    handleInputChange(e);
                                    setError({ ...error, hoTen: '' });
                                }}
                            />
                            {error.hoTen && (
                                <p className="text-sm" style={{ color: 'red' }}>
                                    {error.hoTen}
                                </p>
                            )}
                        </div>

                        <div className="col-span-2 mt-4">
                            <label className="block text-sm font-medium text-gray-700">Số CCCD</label>
                            <input
                                type="text"
                                name="cccd"
                                value={formData.cccd}
                                placeholder="Nhập số CCCD"
                                className={`w-full p-3 border-2 border-gray-400 rounded outline-blue-500 ${
                                    error.cccd ? 'border-red-500 hover:border-red-600 outline-red-500' : ''
                                }`}
                                onChange={(e) => {
                                    handleInputChange(e);
                                    setError({ ...error, cccd: '' });
                                }}
                            />
                            {error.cccd && (
                                <p className="text-sm" style={{ color: 'red' }}>
                                    {error.cccd}
                                </p>
                            )}
                        </div>

                        <div className="col-span-2 mt-4">
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                placeholder="Nhập email"
                                className={`w-full p-3 border-2 border-gray-400 rounded outline-blue-500 ${
                                    error.email ? 'border-red-500 hover:border-red-600 outline-red-500' : ''
                                }`}
                                onChange={(e) => {
                                    handleInputChange(e);
                                    setError({ ...error, email: '' });
                                }}
                            />
                            {error.email && (
                                <p className="text-sm" style={{ color: 'red' }}>
                                    {error.email}
                                </p>
                            )}
                        </div>

                        <div className="col-span-2 mt-4">
                            <label className="block text-sm font-medium text-gray-700">Số Điện Thoại</label>
                            <input
                                type="text"
                                name="sdt"
                                value={formData.sdt}
                                placeholder="Nhập số điện thoại"
                                className={`w-full p-3 border-2 border-gray-400 rounded outline-blue-500 ${
                                    error.sdt ? 'border-red-500 hover: border-red-600 outline-red-500' : ''
                                }`}
                                onChange={(e) => {
                                    handleInputChange(e);
                                    setError({ ...error, sdt: '' });
                                }}
                            />
                            {error.sdt && (
                                <p className="text-sm" style={{ color: 'red' }}>
                                    {error.sdt}
                                </p>
                            )}
                        </div>

                        <div className="col-span-2 mt-4">
                            <label className="block text-sm font-medium text-gray-700">Ngày sinh</label>
                            <input
                                type="date"
                                name="ngaySinh"
                                value={formData.ngaySinh}
                                className={`w-full p-3 border-2 border-gray-400 rounded outline-blue-500 ${
                                    error.ngaySinh ? 'border-red-500 hover: border-red-600 outline-red-500' : ''
                                }`}
                                onChange={(e) => {
                                    handleInputChange(e);
                                    setError({ ...error, ngaySinh: '' });
                                }}
                            />
                            {error.ngaySinh && (
                                <p className="text-sm" style={{ color: 'red' }}>
                                    {error.ngaySinh}
                                </p>
                            )}
                        </div>

                        <div className="col-span-2 mt-4">
                            <label className="block text-sm font-medium text-gray-700">Giới tính</label>
                            <div className="flex items-center gap-4">
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="gioiTinh"
                                        value={0}
                                        checked={formData.gioiTinh === 0}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                gioiTinh: parseInt(e.target.value),
                                            })
                                        }
                                        className="mr-2"
                                    />
                                    Nam
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="gioiTinh"
                                        value={1}
                                        checked={formData.gioiTinh === 1}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                gioiTinh: parseInt(e.target.value),
                                            })
                                        }
                                        className="mr-2"
                                    />
                                    Nữ
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="w-3/4 pl-8">
                        <h3 className="text-xl font-semibold">Thông tin địa chỉ</h3>
                        <hr className="mt-5" />
                        {diaChi.length > 0 ? (
                            diaChi.map((item, index) => (
                                <div key={index}>
                                    <div className="mt-4">
                                        <span className="font-medium">Địa chỉ</span>

                                        <div className="p-4">
                                            <div className="grid grid-cols-12 gap-6">
                                                <div className="col-span-6">
                                                    <label className="block font-medium mb-1">Tên</label>
                                                    <input
                                                        type="text"
                                                        name="name"
                                                        placeholder="Nhập tên"
                                                        className={`w-full p-3 border-2 border-gray-400 rounded outline-blue-500 ${
                                                            error.ten
                                                                ? 'border-red-500 hover: border-red-600 outline-red-500'
                                                                : ''
                                                        }`}
                                                        value={diaChiData.ten}
                                                        onChange={(e) => {
                                                            setDiaChiData((prev) => ({ ...prev, ten: e.target.value }));
                                                            setError({ ...error, ten: '' });
                                                        }}
                                                    />
                                                    {error.ten && (
                                                        <p className="text-sm" style={{ color: 'red' }}>
                                                            {error.ten}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="col-span-6">
                                                    <label className="block font-medium mb-1">Số điện thoại</label>
                                                    <input
                                                        type="text"
                                                        name="phoneNumber"
                                                        placeholder="Nhập số điện thoại"
                                                        className={`w-full p-3 border-2 border-gray-400 rounded outline-blue-500 ${
                                                            error.sdt
                                                                ? 'border-red-500 hover: border-red-600 outline-red-500'
                                                                : ''
                                                        }`}
                                                        value={diaChiData.sdt}
                                                        onChange={(e) => {
                                                            setDiaChiData((prev) => ({ ...prev, sdt: e.target.value }));
                                                            setError({ ...error, sdt: '' });
                                                        }}
                                                    />
                                                    {error.sdt && (
                                                        <p className="text-sm" style={{ color: 'red' }}>
                                                            {error.sdt}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-12 gap-4 mt-6">
                                                <div className="col-span-4">
                                                    <label className="block font-medium mb-1">Tỉnh/thành phố</label>
                                                    <select
                                                        value={selectedProvince}
                                                        onChange={(e) => {
                                                            setSelectedProvince(e.target.value);
                                                            setError({ ...error, idTinh: '' });
                                                        }}
                                                        className={`w-full p-3 border-2 border-gray-400 rounded outline-blue-500 ${
                                                            error.idTinh
                                                                ? 'border-red-500 hover: border-red-600 outline-red-500'
                                                                : ''
                                                        }`}
                                                    >
                                                        <option value="">Chọn tỉnh/thành phố</option>
                                                        {provinces.map((province) => (
                                                            <option key={province.code} value={province.code}>
                                                                {province.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    {error.idTinh && (
                                                        <p className="text-sm" style={{ color: 'red' }}>
                                                            {error.idTinh}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="col-span-4">
                                                    <label className="block font-medium mb-1">Quận/huyện</label>
                                                    <select
                                                        value={selectedDistrict}
                                                        onChange={(e) => {
                                                            setSelectedDistrict(e.target.value);
                                                            setError({ ...error, idHuyen: '' });
                                                        }}
                                                        className={`w-full p-3 border-2 border-gray-400 rounded outline-blue-500 ${
                                                            error.idHuyen
                                                                ? 'border-red-500 hover: border-red-600 outline-red-500'
                                                                : ''
                                                        }`}
                                                        disabled={!selectedProvince}
                                                    >
                                                        <option value="">Chọn quận/huyện</option>
                                                        {districts.map((district) => (
                                                            <option key={district.code} value={district.code}>
                                                                {district.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    {error.idHuyen && (
                                                        <p className="text-sm" style={{ color: 'red' }}>
                                                            {error.idHuyen}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="col-span-4">
                                                    <label className="block font-medium mb-1">Xã/phường/thị trấn</label>
                                                    <select
                                                        value={selectedWard}
                                                        onChange={(e) => {
                                                            setSelectedWard(e.target.value);
                                                            setError({ ...error, idXa: '' });
                                                        }}
                                                        className={`w-full p-3 border-2 border-gray-400 rounded outline-blue-500 ${
                                                            error.idXa
                                                                ? 'border-red-500 hover: border-red-600 outline-red-500'
                                                                : ''
                                                        }`}
                                                        disabled={!selectedDistrict}
                                                    >
                                                        <option value="">Chọn xã/phường</option>
                                                        {wards.map((ward) => (
                                                            <option key={ward.code} value={ward.code}>
                                                                {ward.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    {error.idXa && (
                                                        <p className="text-sm" style={{ color: 'red' }}>
                                                            {error.idXa}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="mt-6">
                                                <label className="block font-medium mb-1">Địa chỉ cụ thể</label>
                                                <input
                                                    type="text"
                                                    value={diaChiData.diaChiCuThe}
                                                    placeholder="Nhập địa chỉ cụ thể"
                                                    className={`w-full p-3 border-2 border-gray-400 rounded outline-blue-500 ${
                                                        error.diaChiCuThe
                                                            ? 'border-red-500 hover: border-red-600 outline-red-500'
                                                            : ''
                                                    }`}
                                                    onChange={(e) => {
                                                        setDiaChiData((prev) => ({
                                                            ...prev,
                                                            diaChiCuThe: e.target.value,
                                                        }));
                                                        setError({ ...error, diaChiCuThe: '' });
                                                    }}
                                                />
                                                {error.diaChiCuThe && (
                                                    <p className="text-sm" style={{ color: 'red' }}>
                                                        {error.diaChiCuThe}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-gray-500 text-center mt-4">Chưa có địa chỉ nào</p>
                        )}
                    </div>
                </div>

                {/* Nút Cập Nhật */}
                <div className="mt-5 flex justify-end">
                    <button
                        onClick={handleUpdateUser}
                        className="bg-[#2f19ae] text-white px-8 py-3 rounded-sm shadow-md hover:bg-blue-700 transition duration-300"
                    >
                        Cập nhật
                    </button>
                </div>
            </div>
        </div>
    );
}

export default EditUser;
