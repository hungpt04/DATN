// import React, { useEffect, useState } from 'react';
// import { Link, useParams } from 'react-router-dom';
// import './Order.css';
// import axios from 'axios';
// import numeral from 'numeral';
// import swal from 'sweetalert';

// export default function OrderDetail() {
//     const { id } = useParams();
//     const [billDetail, setBillDetail] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [voucherId, setVoucherId] = useState(null);
//     const [voucher, setVoucher] = useState(null);
//     const [hoaDonChiTiet, setHoaDonChiTiet] = useState(null);
//     const [sanPhamChiTietId, setSanPhamChiTietId] = useState(null);
//     const [previewImage, setPreviewImage] = useState(null);

//     const formatCurrency = (money) => {
//         return numeral(money).format('0,0') + ' ₫'
//     }

//     const loadHoaDonById = (id) => {
//         return axios.get(`http://localhost:8080/api/hoa-don/${id}`)
//             .then((response) => {
//                 setBillDetail(response.data);
//                 setVoucherId(response.data.idVoucher)
//             })
//             .catch((error) => {
//                 console.error("Failed to fetch orders:", error);
//             })
//     }


//     const getHoaDonCT = (id) => {
//         return axios.get(`http://localhost:8080/api/hoa-don-ct/get-hd-ct-by-id-hd/${id}`)
//             .then((response) => {
//                 console.log(response.data); // In ra dữ liệu để kiểm tra cấu trúc

//                 // Giả sử response.data là một mảng
//                 if (response.data.length > 0) {
//                     setHoaDonChiTiet(response.data); // Lưu toàn bộ chi tiết hóa đơn
//                     setSanPhamChiTietId(response.data[0].sanPhamCT.id);
//                     // Lấy id của sanPhamCT từ phần tử đầu tiên
//                 } else {
//                     console.warn("Không có dữ liệu hóa đơn chi tiết.");
//                 }
//             })
//             .catch((error) => {
//                 console.error("Failed to fetch orders:", error);
//             });
//     }

//     const getAnhByHoaDon = (id) => {
//         return axios.get(`http://localhost:8080/api/hoa-don/anh-san-pham/${id}/${sanPhamChiTietId}`)
//             .then((response) => {
//                 console.log("image", response.data)
//                 setPreviewImage(response.data);
//             })
//             .catch((error) => {
//                 console.error("Failed to fetch orders:", error);
//             })
//     }

//     const getVoucher = async (voucherId) => {
//         try {
//             if (!voucherId) {
//                 console.error("Voucher ID is null");
//                 return;
//             }
//             const response = await axios.get(`http://localhost:8080/api/voucher/detail/${voucherId}`);
//             setVoucher(response.data);
//             console.log(response.data)
//         } catch (error) {
//             console.error("Failed to fetch voucher:", error);
//         }
//     }

//     useEffect(() => {
//         if (voucherId) {
//             getVoucher(voucherId)
//         }
//     }, [voucherId])

//     useEffect(() => {
//         setLoading(true);
//         Promise.all([
//             loadHoaDonById(id),
//             getHoaDonCT(id),
//         ])
//         .finally(() => {
//             setLoading(false);
//         });
//     }, [id]);

//     useEffect(() => {
//         if (sanPhamChiTietId) {
//             getAnhByHoaDon(id);
//         }
//     }, [sanPhamChiTietId]);


//     // Hàm tính toán giảm giá
//     const calculateDiscountAmount = () => {
//         if (!voucher || !hoaDonChiTiet) return 0;

//         const totalAmount = hoaDonChiTiet.reduce(
//             (total, item) => total + (item.giaBan * item.soLuong),
//             0
//         );

//         // Nếu voucher giảm theo %
//         if (voucher.kieuGiaTri === 0) {
//             return totalAmount * (voucher.giaTri / 100);
//         }

//         // Nếu voucher giảm cố định
//         if (voucher.kieuGiaTri === 1) {
//             return voucher.giaTri;
//         }

//         return 0;
//     }

//     const handleHuyDonHang = (id) => {
//         const title = 'Xác nhận hủy đơn hàng?';
//         const text = 'Bạn chắc chắn muốn hủy đơn hàng này?';

//         // Hiển thị SweetAlert để xác nhận
//         swal({
//             title: title,
//             text: text,
//             icon: 'warning',
//             buttons: {
//                 cancel: "Hủy",
//                 confirm: "Xác nhận",
//             },
//         }).then((willConfirm) => {
//             if (willConfirm) {
//                 // Thực hiện gọi API với axios
//                 axios.put(`http://localhost:8080/api/hoa-don/update-status/${id}`, {
//                     headers: {
//                         'Content-Type': 'application/json',
//                     },
//                 })
//                     .then(() => {
//                         swal('Thành công!', 'Hủy đơn hàng thành công', 'success');

//                     })
//                     .catch((error) => {
//                         console.error("Lỗi cập nhật:", error);
//                         swal('Thất bại!', 'Hủy đơn hàng thất bại', 'error');
//                     });
//             }
//         });
//     }

//     return (
//         <div>
//             {loading ? (
//                 <div>Loading...</div>
//             ) : (
//                 <>
//                     <h2 className="text-2xl font-semibold">Địa chỉ nhận hàng</h2>
//                     <div className="mt-4">
//                         <p>{billDetail.tenNguoiNhan}</p>
//                         <p>{billDetail.sdtNguoiNhan}</p>
//                         <p>{billDetail.diaChiNguoiNhan}</p>
//                     </div>

//                     <h3 className="mt-6 text-xl font-semibold">Chi tiết đơn hàng</h3>
//                     <div className="overflow-auto max-h-96">
//                         {hoaDonChiTiet.map((item) => (
//                             <div key={item.id} className="border rounded p-4 mb-4 bg-white shadow">
//                                 <div className="flex">
//                                     <img src={previewImage} alt="anh" className="w-24 h-24 object-cover" />
//                                     <div className="ml-4">
//                                         <h4 className="font-bold">{item.sanPhamCT.sanPham.ten}</h4>
//                                         <p>Giá: {formatCurrency(item.sanPhamCT.donGia)}</p>
//                                         <p>Số lượng: {item.hoaDon.soLuong}</p>
//                                     </div>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>

//                     <div className="mt-4">
//                         <h3 className="text-lg font-semibold">Tổng kết</h3>
//                         <div className="flex justify-between">
//                             <span>Tổng tiền hàng:</span>
//                             <span>
//                                 {formatCurrency(
//                                     hoaDonChiTiet.reduce((total, item) => total + (item.giaBan * item.soLuong), 0)
//                                 )}
//                             </span>
//                         </div>
//                         <div className="flex justify-between">
//                             <span>Phí vận chuyển:</span>
//                             <span>25,000 đ</span>
//                         </div>
//                         <div className="flex justify-between">
//                             <span>Giảm giá:</span>
//                             <span>{voucher
//                                 ? formatCurrency(calculateDiscountAmount())
//                                 : formatCurrency(0)
//                             }</span>
//                         </div>
//                         <div className="flex justify-between">
//                             <span>Tổng tiền phải trả:</span>
//                             <span>{formatCurrency(billDetail.tongTien)}</span>
//                         </div>
//                     </div>
//                 </>
//             )}
//             <div className='flex justify-between items-center'>
//                 <Link
//                     to={`/profile/order`}
//                     className="mt-2 inline-block bg-indigo-500 text-white px-4 py-2 rounded-sm"
//                 >
//                     Trở về
//                 </Link>
//                 {billDetail.trangThai === 1 && (
//                     <button onClick={() => handleHuyDonHang(billDetail.id)} className="mt-2 inline-block bg-orange-400 text-white px-4 py-2 rounded-sm ml-2">
//                         Hủy đơn hàng
//                     </button>
//                 )}
//             </div>
//         </div>
//     );
// }


import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import './Order.css';
import axios from 'axios';
import numeral from 'numeral';
import swal from 'sweetalert';

export default function OrderDetail() {
    const { id } = useParams();
    const [billDetail, setBillDetail] = useState([]);
    const [voucherId, setVoucherId] = useState(null);
    const [voucher, setVoucher] = useState(null);
    const [hoaDonChiTiet, setHoaDonChiTiet] = useState(null);
    const [sanPhamChiTietId, setSanPhamChiTietId] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);

    const formatCurrency = (money) => {
        return numeral(money).format('0,0') + ' ₫'
    }

    const loadHoaDonById = (id) => {
        return axios.get(`http://localhost:8080/api/hoa-don-kh/hoa-don/${id}`)
            .then((response) => {
                console.log("ds sp", response.data)
                setBillDetail(response.data);
            })
            .catch((error) => {
                console.error("Failed to fetch orders:", error);
            })
    }

    useEffect(() => {
        loadHoaDonById(id)
    }, [id]);



    // Hàm tính toán giảm giá
    const calculateDiscountAmount = () => {
        if (!voucher || !hoaDonChiTiet) return 0;

        const totalAmount = hoaDonChiTiet.reduce(
            (total, item) => total + (item.giaBan * item.soLuong),
            0
        );

        // Nếu voucher giảm theo %
        if (voucher.kieuGiaTri === 0) {
            return totalAmount * (voucher.giaTri / 100);
        }

        // Nếu voucher giảm cố định
        if (voucher.kieuGiaTri === 1) {
            return voucher.giaTri;
        }

        return 0;
    }

    const handleHuyDonHang = (id) => {
        const title = 'Xác nhận hủy đơn hàng?';
        const text = 'Bạn chắc chắn muốn hủy đơn hàng này?';

        // Hiển thị SweetAlert để xác nhận
        swal({
            title: title,
            text: text,
            icon: 'warning',
            buttons: {
                cancel: "Hủy",
                confirm: "Xác nhận",
            },
        }).then((willConfirm) => {
            if (willConfirm) {
                // Thực hiện gọi API với axios
                axios.put(`http://localhost:8080/api/hoa-don/update-status/${id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                    .then(() => {
                        swal('Thành công!', 'Hủy đơn hàng thành công', 'success');

                    })
                    .catch((error) => {
                        console.error("Lỗi cập nhật:", error);
                        swal('Thất bại!', 'Hủy đơn hàng thất bại', 'error');
                    });
            }
        });
    }

    return (
        <div>
            <h2 className="text-2xl font-semibold">Địa chỉ nhận hàng</h2>
            {billDetail.length > 0 ? (
                <div className="mt-4">
                    <p>Tên người nhận: {billDetail[0].tenNguoiNhan}</p>
                    <p>Số điện thoại: {billDetail[0].sdtNguoiNhan}</p>
                    <p>Địa chỉ: {billDetail[0].diaChiNguoiNhan}</p>
                </div>
            ) : (
                <p>Không có thông tin đơn hàng.</p>
            )}

            <h3 className="mt-6 text-xl font-semibold">Chi tiết đơn hàng</h3>
            <div className="overflow-auto max-h-96">
                {billDetail.map((bill, index) => (
                    <div key={index} className="border rounded p-4 mb-4 bg-white shadow">
                        <div className="flex">
                            <img
                                src={bill.hinhAnhLink}
                                alt="anhSanPham"
                                className="w-24 h-24 object-cover"
                            />
                            <div className="ml-4">
                                <h4 className="font-bold">{bill.sanPhamTen}</h4>
                                <p>Giá: {formatCurrency(bill.giaBan)}</p>
                                <p>Số lượng: {bill.soLuongMua}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-4">
                <h3 className="text-lg font-semibold">Tổng kết</h3>
                {billDetail.length > 0 ? (
                    <div className="mt-4">
                        <div className="flex justify-between">
                            <span>Phí vận chuyển:</span>
                            <span>{formatCurrency(billDetail[0].phiShip)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Tổng tiền phải trả:</span>
                            <span>{formatCurrency(billDetail[0].tongTien)}</span>
                        </div>
                    </div>
                ) : (
                    <p>Không có thông tin đơn hàng.</p>
                )}
                {/* <div className="flex justify-between">
                    <span>Tổng tiền hàng:</span>
                    <span> */}
                        {/* {formatCurrency(
                            hoaDonChiTiet.reduce((total, item) => total + (item.giaBan * item.soLuong), 0)
                        )} */}
                    {/* </span> */}
                {/* </div>
                <div className="flex justify-between">
                    <span>Phí vận chuyển:</span>
                    <span>{formatCurrency(billDetail[0].phiShip)}</span>
                </div>
                <div className="flex justify-between">
                    <span>Giảm giá:</span> */}
                    {/* <span>{voucher
                        ? formatCurrency(calculateDiscountAmount())
                        : formatCurrency(0)
                    }</span> */}
                {/* </div>
                <div className="flex justify-between">
                    <span>Tổng tiền phải trả:</span>
                    <span>{formatCurrency(billDetail[0].tongTien)}</span>
                </div> */}

            </div>


            <div className='flex justify-between items-center'>
                <Link
                    to={`/profile/order`}
                    className="mt-2 inline-block bg-indigo-500 text-white px-4 py-2 rounded-sm"
                >
                    Trở về
                </Link>
                {billDetail.trangThai === 1 && (
                    <button onClick={() => handleHuyDonHang(billDetail.id)} className="mt-2 inline-block bg-orange-400 text-white px-4 py-2 rounded-sm ml-2">
                        Hủy đơn hàng
                    </button>
                )}
            </div>
        </div>
    );
}
