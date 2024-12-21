// import { useEffect, useState } from 'react';
// import swal from 'sweetalert';
// import { useNavigate } from 'react-router-dom';

// function AddUser() {
//     const navigate = useNavigate();
//     const [provinces, setProvinces] = useState([]);
//     const [districts, setDistricts] = useState([]);
//     const [wards, setWards] = useState([]);
//     const [selectedProvince, setSelectedProvince] = useState('');
//     const [selectedDistrict, setSelectedDistrict] = useState('');
//     const [selectedWard, setSelectedWard] = useState('');
//     const [previewImage, setPreviewImage] = useState(null);

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
//         loai: '',
//         idTaiKhoan: ''
//     });

//     useEffect(() => {
//         fetch('https://provinces.open-api.vn/api/p/')
//             .then((response) => response.json())
//             .then((data) => setProvinces(data));
//     }, []);

//     useEffect(() => {
//         if (selectedProvince) {
//             fetch(`https://provinces.open-api.vn/api/p/${selectedProvince}?depth=2`)
//                 .then((response) => response.json())
//                 .then((data) => setDistricts(data.districts));
//             setDiaChiData((prev) => ({ ...prev, idTinh: selectedProvince }));
//         }
//     }, [selectedProvince]);

//     useEffect(() => {
//         if (selectedDistrict) {
//             fetch(`https://provinces.open-api.vn/api/d/${selectedDistrict}?depth=2`)
//                 .then((response) => response.json())
//                 .then((data) => setWards(data.wards));
//             setDiaChiData((prev) => ({ ...prev, idHuyen: selectedDistrict }));
//         }
//     }, [selectedDistrict]);

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setFormData((prev) => ({
//             ...prev,
//             [name]: value,
//         }));
//     };

//     const handleGenderChange = (value) => {
//         setFormData((prev) => ({
//             ...prev,
//             gioiTinh: value,
//         }));
//     };

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

//     const handleAddUser = async (e) => {
//         e.preventDefault();

//         const formDataToSend = new FormData();

//         formDataToSend.append('hoTen', formData.hoTen);
//         formDataToSend.append('sdt', formData.sdt);
//         formDataToSend.append('email', formData.email);
//         formDataToSend.append('matKhau', formData.matKhau);
//         formDataToSend.append('gioiTinh', formData.gioiTinh);
//         formDataToSend.append('vaiTro', formData.vaiTro);
//         formDataToSend.append('ngaySinh', formData.ngaySinh);
//         formDataToSend.append('cccd', formData.cccd);
//         formDataToSend.append('trangThai', formData.trangThai);

//         if (formData.avatar) {
//             formDataToSend.append('avatar', formData.avatar);
//         }

//         try {
//             const taiKhoanResponse = await fetch('http://localhost:8080/api/nhan-vien/add', {
//                 method: 'POST',
//                 body: formDataToSend,
//             });

//             if (!taiKhoanResponse.ok) {
//                 throw new Error('Failed to create user account');
//             }

//             const taiKhoanData = await taiKhoanResponse.json();
//             const idTaiKhoan = taiKhoanData.id;

//             const obj = {
//                 ten: diaChiData.ten,
//                 sdt: taiKhoanData.sdt,
//                 idTinh: diaChiData.idTinh,
//                 idHuyen: diaChiData.idHuyen,
//                 idXa: selectedWard,
//                 idTaiKhoan: idTaiKhoan,
//                 loai: 0,
//                 diaChiCuThe: diaChiData.diaChiCuThe,
//             }

//             const diaChiResponse = await fetch('http://localhost:8080/api/dia-chi/create', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(obj),
//             });

//             if (!diaChiResponse.ok) {
//                 throw new Error('Failed to create address');
//             }

//             swal({
//                 title: "Thành công!",
//                 text: "Thêm nhân viên thành công!",
//                 icon: "success",
//                 buttons: false,
//                 timer: 2000,
//             }).then(() => {
//                 navigate('/admin/tai-khoan/nhan-vien');
//             });

//         } catch (error) {
//             console.error('Error:', error);
//             swal({
//                 title: "Lỗi!",
//                 text: "Có lỗi xảy ra khi thêm nhân viên!",
//                 icon: "error",
//                 button: "OK",
//             });
//         };
//     }

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
//                 <span className="text-gray-400 ml-2">/ Tạo nhân viên</span>
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
//                                         <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
//                                     ) : (
//                                         'Chọn ảnh'
//                                     )}
//                                 </div>
//                             </label>
//                         </div>
//                         {/* Họ và tên */}
//                         <div className="col-span-2">
//                             <label className="block text-sm font-medium text-gray-700">
//                                 <span className="text-red-500">*</span> Họ Và Tên
//                             </label>
//                             <input
//                                 type="text"
//                                 name="hoTen"
//                                 placeholder="Nhập họ và tên"
//                                 className="w-full p-4 border-2 border-gray-400 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
//                                 onChange={handleInputChange}
//                             />
//                         </div>
//                     </div>

//                     <div className="w-3/4">
//                         <h2 className="text-xl font-semibold text-gray-800 mb-8">Thông tin chi tiết</h2>
//                         <hr />

//                         {/* Số CCCD và Giới tính */}
//                         <div className="grid grid-cols-2 gap-4 mt-4">
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700">
//                                     <span className="text-red-500">*</span> Số CCCD
//                                 </label>
//                                 <input
//                                     type="text"
//                                     name="cccd"
//                                     placeholder="Nhập số CCCD"
//                                     className="w-full p-4 border-2 border-gray-400 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
//                                     onChange={handleInputChange}
//                                 />
//                             </div>
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700">
//                                     <span className="text-red-500">*</span> Giới tính
//                                 </label>
//                                 <div className="mt-2 flex items-center gap-4">
//                                     <label className="flex items-center">
//                                         <input
//                                             type="radio"
//                                             name="gender"
//                                             className="mr-2"
//                                             onChange={() => handleGenderChange(0)}
//                                         />{' '}
//                                         Nam
//                                     </label>
//                                     <label className="flex items-center">
//                                         <input
//                                             type="radio"
//                                             name="gender"
//                                             className="mr-2"
//                                             onChange={() => handleGenderChange(1)}
//                                         />{' '}
//                                         Nữ
//                                     </label>
//                                 </div>
//                             </div>
//                         </div>
//                         {/* Ngày sinh và Email */}
//                         <div className="grid grid-cols-2 gap-4 mt-4">
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700">
//                                     <span className="text-red-500">*</span> Ngày sinh
//                                 </label>
//                                 <input
//                                     type="date"
//                                     name="ngaySinh"
//                                     className="w-full p-4 border-2 border-gray-400 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
//                                     onChange={handleInputChange}
//                                 />
//                             </div>
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700">
//                                     <span className="text-red-500">*</span> Email
//                                 </label>
//                                 <input
//                                     type="email"
//                                     name="email"
//                                     placeholder="Nhập email"
//                                     className="w-full p-4 border-2 border-gray-400 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
//                                     onChange={handleInputChange}
//                                 />
//                             </div>
//                         </div>
//                         {/* Tỉnh/Thành phố, Quận/Huyện, Xã/Phường */}
//                         <div className="grid grid-cols-3 gap-4 mt-4">
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700">
//                                     <span className="text-red-500">*</span> Tỉnh/Thành phố
//                                 </label>
//                                 <select
//                                     onChange={(e) => setSelectedProvince(e.target.value)}
//                                     className="w-full p-4 border-2 border-gray-400 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
//                                 >
//                                     <option value="">Chọn tỉnh/thành phố</option>
//                                     {provinces.map((province) => (
//                                         <option key={province.code} value={province.code}>
//                                             {province.name}
//                                         </option>
//                                     ))}
//                                 </select>
//                             </div>
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700">
//                                     <span className="text-red-500">*</span> Quận/Huyện
//                                 </label>
//                                 <select
//                                     onChange={(e) => setSelectedDistrict(e.target.value)}
//                                     className="w-full p-4 border-2 border-gray-400 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
//                                     disabled={!selectedProvince}
//                                 >
//                                     <option value="">Chọn quận/huyện</option>
//                                     {districts.map((district) => (
//                                         <option key={district.code} value={district.code}>
//                                             {district.name}
//                                         </option>
//                                     ))}
//                                 </select>
//                             </div>
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700">
//                                     <span className="text-red-500">*</span> Xã/Phường/Thị trấn
//                                 </label>
//                                 <select
//                                     onChange={(e) => setSelectedWard(e.target.value)}
//                                     className="w-full p-4 border-2 border-gray-400 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
//                                     disabled={!selectedDistrict}
//                                 >
//                                     <option value="">Chọn xã/phường</option>
//                                     {wards.map((ward) => (
//                                         <option key={ward.code} value={ward.code}>
//                                             {ward.name}
//                                         </option>
//                                     ))}
//                                 </select>
//                             </div>
//                         </div>
//                         {/* Số điện thoại và Địa chỉ cụ thể */}
//                         <div className="grid grid-cols-2 gap-4 mt-4">
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700">
//                                     <span className="text-red-500">*</span> Số Điện Thoại
//                                 </label>
//                                 <input
//                                     type="text"
//                                     name="sdt"
//                                     placeholder="Nhập số điện thoại"
//                                     className="w-full p-4 border-2 border-gray-400 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
//                                     onChange={handleInputChange}
//                                 />
//                             </div>
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700">
//                                     <span className="text-red-500">*</span> Địa chỉ cụ thể
//                                 </label>
//                                 <input
//                                     type="text"
//                                     placeholder="Nhập địa chỉ cụ thể"
//                                     className="w-full p-4 border-2 border-gray-400 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
//                                     onChange={(e) =>
//                                         setDiaChiData((prev) => ({ ...prev, diaChiCuThe: e.target.value }))
//                                     }
//                                 />
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//                 {/* Nút Thêm Nhân Viên */}
//                 <div className="mt-8 flex justify-end">
//                     <button
//                         onClick={handleAddUser}
//                         className="hover:bg-gray-400 border border-gray-300 font-medium py-2 px-4 rounded"
//                     >
//                         Thêm Nhân Viên
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default AddUser;


import { useEffect, useState } from 'react';
import swal from 'sweetalert';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AddUser() {
    const navigate = useNavigate();
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedWard, setSelectedWard] = useState('');
    const [previewImage, setPreviewImage] = useState(null);

    const [errors, setErrors] = useState({});

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
        loai: '',
        idTaiKhoan: '',
    });

    const [emailExists, setEmailExists] = useState(false);

    //  kiểm tra email
    const checkMail = async (email) => {
        try {
            const response = await axios.get(`http://localhost:8080/auth/check-mail?email=${email}`);
            console.log('Full response data:', response.data);

            // Log thông tin chi tiết để kiểm tra
            console.log('Response status:', response.status);

            // Kiểm tra nhiều điều kiện
            return !!(
                response.data &&
                // response.data.id &&
                response.data.email === email
            );
        } catch (error) {
            // Xử lý chi tiết các loại lỗi
            if (error.response) {
                // The request was made and the server responded with a status code
                console.log('Error data:', error.response.data);
                console.log('Error status:', error.response.status);
            } else if (error.request) {
                // The request was made but no response was received
                console.log('No response received:', error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error message:', error.message);
            }

            return false;
        }
    };

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
            const emailExists = await checkMail(data.email);
            if (emailExists) {
                errors.email = '*Email đã tồn tại trong hệ thống';
                check++;
            }
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
            "001", "002", "003", "004", "005", "006", "007", "008", "009", 
            "010", "011", "012", "013", "014", "015", "016", "017", "018", "019",
            "020", "021", "022", "023", "024", "025", "026", "027", "028", "029",
            "030", "031", "032", "033", "034", "035", "036", "037", "038", "039",
            "040", "041", "042", "043", "044", "045", "046", "047", "048", "049",
            "050", "051", "052", "053", "054", "055", "056", "057", "058", "059",
            "060", "061", "062", "063"
        ]; // Thêm các mã tỉnh khác nếu cần

        if (!data.cccd.trim()) {
            errors.cccd = "*Bạn chưa nhập cccd"
            check++
        } else if (data.cccd.trim().length !== 12) {
            errors.cccd = "*CCCD không đúng định dạng"
            check++
        } else if (!/^\d{12}$/.test(data.cccd.trim())) {
            errors.cccd = "*CCCD chỉ chứa các chữ số"
            check++
        } else {
            const provinceCode = data.cccd.substring(0, 3)
            if (!validProvinceCodes.includes(provinceCode)) {
                errors.cccd = "*Mã cccd không hợp lệ"
                check++
            } else {
                errors.cccd = ""
            }
        }

        return { errors, check };
    };

    const validateAddress = (address) => {
        const errors = {};
        let check = 0;

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

    useEffect(() => {
        fetch('https://provinces.open-api.vn/api/p/')
            .then((response) => response.json())
            .then((data) => setProvinces(data));
    }, []);

    useEffect(() => {
        if (selectedProvince) {
            fetch(`https://provinces.open-api.vn/api/p/${selectedProvince}?depth=2`)
                .then((response) => response.json())
                .then((data) => setDistricts(data.districts));
            setDiaChiData((prev) => ({ ...prev, idTinh: selectedProvince }));
        }
    }, [selectedProvince]);

    useEffect(() => {
        if (selectedDistrict) {
            fetch(`https://provinces.open-api.vn/api/d/${selectedDistrict}?depth=2`)
                .then((response) => response.json())
                .then((data) => setWards(data.wards));
            setDiaChiData((prev) => ({ ...prev, idHuyen: selectedDistrict }));
        }
    }, [selectedDistrict]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleGenderChange = (value) => {
        setFormData((prev) => ({
            ...prev,
            gioiTinh: value,
        }));
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

    const handleAddUser = async (e) => {
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
            setErrors(combinedErrors);
            console.log('Combined errors:', combinedErrors);
            return;
        }

        setErrors({});

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

        try {
            const taiKhoanResponse = await fetch('http://localhost:8080/api/nhan-vien/add', {
                method: 'POST',
                body: formDataToSend,
            });

            if (!taiKhoanResponse.ok) {
                throw new Error('Failed to create user account');
            }

            const taiKhoanData = await taiKhoanResponse.json();
            const idTaiKhoan = taiKhoanData.id;

            const obj = {
                ten: diaChiData.ten,
                sdt: taiKhoanData.sdt,
                idTinh: diaChiData.idTinh,
                idHuyen: diaChiData.idHuyen,
                idXa: selectedWard,
                idTaiKhoan: idTaiKhoan,
                loai: 1,
                diaChiCuThe: diaChiData.diaChiCuThe,
            };

            const diaChiResponse = await fetch('http://localhost:8080/api/dia-chi/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(obj),
            });

            if (!diaChiResponse.ok) {
                throw new Error('Failed to create address');
            }

            swal({
                title: 'Thành công!',
                text: 'Thêm nhân viên thành công!',
                icon: 'success',
                buttons: false,
                timer: 2000,
            }).then(() => {
                navigate('/admin/tai-khoan/nhan-vien');
            });
        } catch (error) {
            console.error('Error:', error);
            swal({
                title: 'Lỗi!',
                text: 'Có lỗi xảy ra khi thêm nhân viên!',
                icon: 'error',
                button: 'OK',
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
                <span className="text-gray-400 ml-2">/ Tạo nhân viên</span>
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
                                        <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        'Chọn ảnh'
                                    )}
                                </div>
                            </label>
                        </div>
                        {/* Họ và tên */}
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Họ Và Tên</label>
                            <input
                                type="text"
                                name="hoTen"
                                placeholder="Nhập họ và tên"
                                className={`w-full p-3 border-2 border-gray-400 rounded outline-blue-500 ${
                                    errors.hoTen ? 'border-red-500 hover:border-red-600 outline-red-500' : ''
                                }`}
                                onChange={(e) => {
                                    handleInputChange(e);
                                    setErrors({ ...errors, hoTen: '' });
                                }}
                            />
                            {errors.hoTen && (
                                <p className="text-sm" style={{ color: 'red' }}>
                                    {errors.hoTen}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="w-3/4">
                        <h2 className="text-xl font-semibold text-gray-800 mb-5">Thông tin chi tiết</h2>
                        <hr />

                        {/* Số CCCD và Giới tính */}
                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Số CCCD</label>
                                <input
                                    type="text"
                                    name="cccd"
                                    placeholder="Nhập số CCCD"
                                    className={`w-full p-3 border-2 border-gray-400 rounded outline-blue-500 ${
                                        errors.cccd ? 'border-red-500 hover:border-red-600 outline-red-500' : ''
                                    }`}
                                    onChange={(e) => {
                                        handleInputChange(e);
                                        setErrors({ ...errors, cccd: '' });
                                    }}
                                />
                                {errors.cccd && (
                                    <p className="text-sm" style={{ color: 'red' }}>
                                        {errors.cccd}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Giới tính</label>
                                <div className="flex items-center gap-4">
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="gender"
                                            className="mr-2"
                                            checked
                                            onChange={() => handleGenderChange(0)}
                                        />
                                        Nam
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="gender"
                                            className="mr-2"
                                            onChange={() => handleGenderChange(1)}
                                        />
                                        Nữ
                                    </label>
                                </div>
                            </div>
                        </div>
                        {/* Ngày sinh và Email */}
                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Ngày sinh</label>
                                <input
                                    type="date"
                                    name="ngaySinh"
                                    className={`w-full p-3 border-2 border-gray-400 rounded outline-blue-500 ${
                                        errors.ngaySinh ? 'border-red-500 hover:border-red-600 outline-red-500' : ''
                                    }`}
                                    onChange={(e) => {
                                        handleInputChange(e);
                                        setErrors({ ...errors, ngaySinh: '' });
                                    }}
                                />
                                {errors.ngaySinh && (
                                    <p className="text-sm" style={{ color: 'red' }}>
                                        {errors.ngaySinh}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Nhập email"
                                    className={`w-full p-3 border-2 border-gray-400 rounded outline-blue-500 ${
                                        errors.email ? 'border-red-500 hover:border-red-600 outline-red-500' : ''
                                    }`}
                                    onChange={(e) => {
                                        handleInputChange(e);
                                        setErrors({ ...errors, email: '' });
                                    }}
                                />
                                {errors.email && (
                                    <p className="text-sm" style={{ color: 'red' }}>
                                        {errors.email}
                                    </p>
                                )}
                            </div>
                        </div>
                        {/* Tỉnh/Thành phố, Quận/Huyện, Xã/Phường */}
                        <div className="grid grid-cols-3 gap-4 mt-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Tỉnh/Thành phố</label>
                                <select
                                    onChange={(e) => {
                                        setSelectedWard(e.target.value)
                                        setErrors({...errors, idTinh: ""})
                                    }}
                                    className={`w-full p-3 border-2 border-gray-400 rounded outline-blue-500 ${errors.idTinh? "border-red-500 hover:border-red-600 outline-red-500": ""}`}
                                >
                                    <option value="">Chọn tỉnh/thành phố</option>
                                    {provinces.map((province) => (
                                        <option key={province.code} value={province.code}>
                                            {province.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.idTinh && (
                                    <p className="text-sm" style={{ color: 'red' }}>
                                        {errors.idTinh}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Quận/Huyện</label>
                                <select
                                    onChange={(e) => {
                                        setSelectedWard(e.target.value)
                                        setErrors({...errors, idHuyen: ""})
                                    }}
                                    className={`w-full p-3 border-2 border-gray-400 rounded outline-blue-500 ${errors.idHuyen ? "border-red-500 hover:border-red-600 outline-red-500": ""}`}
                                    disabled={!selectedProvince}
                                >
                                    <option value="">Chọn quận/huyện</option>
                                    {districts.map((district) => (
                                        <option key={district.code} value={district.code}>
                                            {district.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.idHuyen && (
                                    <p className="text-sm" style={{ color: 'red' }}>
                                        {errors.idHuyen}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Xã/Phường/Thị trấn</label>
                                <select
                                    onChange={(e) => {
                                        setSelectedWard(e.target.value)
                                        setErrors({...errors, idXa: ""})
                                    }}
                                    className={`w-full p-3 border-2 border-gray-400 rounded outline-blue-500 ${errors.idXa ? "border-red-500 hover:border-red-600 outline-red-500": ''}`}
                                    disabled={!selectedDistrict}
                                >
                                    <option value="">Chọn xã/phường</option>
                                    {wards.map((ward) => (
                                        <option key={ward.code} value={ward.code}>
                                            {ward.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.idXa && (
                                    <p className="text-sm" style={{ color: 'red' }}>
                                        {errors.idXa}
                                    </p>
                                )}
                            </div>
                        </div>
                        {/* Số điện thoại và Địa chỉ cụ thể */}
                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Số Điện Thoại</label>
                                <input
                                    type="text"
                                    name="sdt"
                                    placeholder="Nhập số điện thoại"
                                    className={`w-full p-3 border-2 border-gray-400 rounded outline-blue-500 ${errors.sdt ? "border-red-500 hover:border-red-600 outline-red-500": ""}`}
                                    onChange={(e) => {
                                        handleInputChange(e)
                                        setErrors({...errors, sdt: ""})
                                    }}
                                />
                                {errors.sdt && <p className='text-sm' style={{color: "red"}}>{errors.sdt}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Địa chỉ cụ thể</label>
                                <input
                                    type="text"
                                    placeholder="Nhập địa chỉ cụ thể"
                                    className={`w-full p-3 border-2 border-gray-400 rounded outline-blue-500 ${errors.diaChiCuThe? "border-red-500 hover:border-red-600 outline-red-500": ""}`}
                                    onChange={(e) =>
                                    {
                                        setDiaChiData((prev) => ({ ...prev, diaChiCuThe: e.target.value }))
                                        setErrors({...errors, diaChiCuThe: ""})
                                    }
                                    }
                                />
                                {errors.diaChiCuThe && <p className='text-sm' style={{color: "red"}}>{errors.diaChiCuThe}</p>}
                            </div>
                        </div>
                    </div>
                </div>
                {/* Nút Thêm Nhân Viên */}
                <div className="mt-8 flex justify-end">
                    <button
                        onClick={handleAddUser}
                        className="hover:bg-gray-400 border border-gray-300 font-medium py-2 px-4 rounded"
                    >
                        Thêm Nhân Viên
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AddUser;
