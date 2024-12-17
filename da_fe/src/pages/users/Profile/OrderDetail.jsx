import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
// import ModalUpdateAddressBillClient from './ModalUpdateAddressBillClient';
// import ClientModalThemSP from './ModalThemSPBillClient';
import './Order.css';
import axios from 'axios';
import numeral from 'numeral';

export default function OrderDetail() {
    const { id } = useParams();
    const [billDetail, setBillDetail] = useState([]);
    const [loading, setLoading] = useState(true);
    const [voucherId, setVoucherId] = useState(null);
    const [voucher, setVoucher] = useState(null);
    const [hoaDonChiTiet, setHoaDonChiTiet] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    const [openModalAddProduct, setOpenModalAddProduct] = useState(false);

    const formatCurrency = (money) => {
        return numeral(money).format('0,0') + ' ₫'
    }

    const loadHoaDonById = (id) => {
        return axios.get(`http://localhost:8080/api/hoa-don/${id}`)
            .then((response) => {
                setBillDetail(response.data);
                setVoucherId(response.data.idVoucher)
            })
            .catch((error) => {
                console.error("Failed to fetch orders:", error);
            })
    }

    const getHoaDonCT = (id) => {
        return axios.get(`http://localhost:8080/api/hoa-don-ct/get-hd-ct-by-id-hd/${id}`)
            .then((response) => {
                setHoaDonChiTiet(response.data);         
            })
            .catch((error) => {
                console.error("Failed to fetch orders:", error);
            })
    }

    const getAnhByHoaDon = (id) => {
        return axios.get(`http://localhost:8080/api/hoa-don-ct/with-images/${id}`)
            .then((response) => {
                console.log("image", response.data)
                setPreviewImage(response.data.link);
                
            })
            .catch((error) => {
                console.error("Failed to fetch orders:", error);
            })
    }

    const getVoucher = async (voucherId) => {
        try {
            if (!voucherId) {
                console.error("Voucher ID is null");
                return;
            }
            const response = await axios.get(`http://localhost:8080/api/voucher/detail/${voucherId}`);
            setVoucher(response.data);
            console.log(response.data)
        } catch (error) {
            console.error("Failed to fetch voucher:", error);
        }
    }

    useEffect(() => {
        if (voucherId) {
            getVoucher(voucherId)
        }
    }, [voucherId])

    useEffect(() => {
        setLoading(true);
        Promise.all([
            loadHoaDonById(id),
            getHoaDonCT(id),
            getAnhByHoaDon(id)
        ]).finally(() => setLoading(false));
    }, [id])

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

    return (
        <div>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <>
                    <h2 className="text-2xl font-semibold">Địa chỉ nhận hàng</h2>
                    <div className="mt-4">
                        <p>{billDetail.tenNguoiNhan}</p>
                        <p>{billDetail.sdtNguoiNhan}</p>
                        <p>{billDetail.diaChiNguoiNhan}</p>
                    </div>

                    <h3 className="mt-6 text-xl font-semibold">Chi tiết đơn hàng</h3>
                    <div className="overflow-auto max-h-96">
                        {hoaDonChiTiet.map((item) => (
                            <div key={item.id} className="border rounded p-4 mb-4 bg-white shadow">
                                <div className="flex">
                                    <img src={previewImage} alt="anh" className="w-24 h-24 object-cover" />
                                    <div className="ml-4">
                                        <h4 className="font-bold">{item.sanPhamCT.sanPham.ten}</h4>
                                        <p>Giá: {formatCurrency(item.sanPhamCT.donGia)}</p>
                                        <p>Số lượng: {item.hoaDon.soLuong}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4">
                        <h3 className="text-lg font-semibold">Tổng kết</h3>
                        <div className="flex justify-between">
                            <span>Tổng tiền hàng:</span>
                            <span>
                                {formatCurrency(
                                    hoaDonChiTiet.reduce((total, item) => total + (item.giaBan * item.soLuong), 0)
                                )}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span>Phí vận chuyển:</span>
                            <span>25,000 đ</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Giảm giá:</span>
                            <span>{voucher
                                ? formatCurrency(calculateDiscountAmount())
                                : formatCurrency(0)
                            }</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Tổng tiền phải trả:</span>
                            <span>{formatCurrency(billDetail.tongTien)}</span>
                        </div>
                    </div>

                    <div className="mt-6">
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                            onClick={() => setOpenModalUpdate(true)}
                        >
                            Cập nhật địa chỉ
                        </button>
                        <button
                            className="bg-green-500 text-white px-4 py-2 rounded"
                            onClick={() => setOpenModalAddProduct(true)}
                        >
                            Thêm sản phẩm
                        </button>
                    </div>
                </>
            )}
            <div>
                <Link
                    to={`/profile/order`}
                    className="mt-2 inline-block bg-indigo-500 text-white px-4 py-2 rounded-sm"
                >
                    Trở về
                </Link>
            </div>

            {/* <ModalUpdateAddressBillClient
        loading={setLoading}
        open={openModalUpdate}
        setOPen={setOpenModalUpdate}
        billDetail={billClient}
      />
      <ClientModalThemSP
        open={openModalAddProduct}
        setOPen={setOpenModalAddProduct}
        idBill={billClient.id}
        load={setLoading}
      /> */}
        </div>
    );
}