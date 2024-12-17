import React, { useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import swal from 'sweetalert';
import TrashIcon from '@heroicons/react/24/outline/TrashIcon';
import Swal from 'sweetalert2';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import numeral from 'numeral';

function OfflineSale() {
    const [bills, setBills] = useState([]);
    const [selectedBill, setSelectedBill] = useState(null);
    const [showProductModal, setShowProductModal] = useState(false);
    const [products, setProducts] = useState([]);
    const [showQuantityModal, setShowQuantityModal] = useState(false);
    const [showCustomerModal, setShowCustomerModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null); // State cho sản phẩm đã chọn\
    const [billDetails, setBillDetails] = useState([]);
    const [quantity, setQuantity] = useState(0);
    const [customers, setCustomers] = useState([]);
    const [transactions, setTransactions] = useState([]);

    const [shippingFee, setShippingFee] = useState(0); // Phí vận chuyển
    const [discount, setDiscount] = useState(0); // Giảm giá
    const [customerPayment, setCustomerPayment] = useState(0); // Khách thanh toán

    const [isModalOpen, setIsModalOpen] = useState(false); // Quản lý trạng thái modal
    const [deleteDetail, setDeleteDetail] = useState(null); // Lưu lại chi tiết để xóa

    const [isModalOpenn, setIsModalOpenn] = useState(false);
    const [totalAmount, setTotalAmount] = useState(0); // Total amount for the modal

    const [selectedTransactionId, setSelectedTransactionId] = useState(null);

    // States for search and filter
    const [searchTerm, setSearchTerm] = useState('');
    const [brandFilter, setBrandFilter] = useState('');
    const [colorFilter, setColorFilter] = useState('');
    const [weightFilter, setWeightFilter] = useState('');
    const [priceFilter, setPriceFilter] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');

    const [bestVoucher, setBestVoucher] = useState(null);

    const [productPrices, setProductPrices] = useState({});
    const [productPromotions, setProductPromotions] = useState({});

    const formatCurrency = (money) => {
        return numeral(money).format('0,0') + ' ₫'
    }

    const handleMoneyChange = (e) => {
        const value = e.target.value.replace(/,/g, "").replace(/\D/g, ""); // Remove commas and non-numeric characters
        setCustomerPayment(value ? parseInt(value, 10) : 0);
    };

    const findBestVoucher = (vouchers, totalPrice) => {
        if (!vouchers || vouchers.length === 0) return null;

        // Lọc ra các voucher còn hiệu lực và đáp ứng điều kiện tổng tiền
        const eligibleVouchers = vouchers.filter(
            (voucher) =>
                voucher.trangThai === 1 &&
                new Date(voucher.ngayBatDau) <= new Date() &&
                new Date(voucher.ngayKetThuc) >= new Date() &&
                totalPrice >= voucher.dieuKienNhoNhat, // Thêm điều kiện tổng tiền
        );

        // Nếu không có voucher nào đáp ứng, trả về null
        if (eligibleVouchers.length === 0) return null;

        // Tìm voucher có giá trị giảm giá cao nhất
        return eligibleVouchers.reduce((best, current) => {
            // So sánh giá trị giảm giá
            if (!best || current.giaTri > best.giaTri) {
                return current;
            }
            return best;
        }, null);
    };

    // Trong useEffect để load vouchers
    useEffect(() => {
        const fetchVouchers = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/voucher/hien-thi');
                const vouchers = response.data;

                // Tính toán tổng tiền từ các chi tiết hóa đơn
                const uniqueProductIds = new Set();
                const uniqueDetails = billDetails
                    .filter((detail) => detail.hoaDonCT && detail.hoaDonCT.hoaDon.id === selectedBill.id)
                    .filter((detail) => {
                        const isUnique = !uniqueProductIds.has(detail.hoaDonCT.id);
                        if (isUnique) {
                            uniqueProductIds.add(detail.hoaDonCT.id);
                        }
                        return isUnique;
                    });

                const totalItems = uniqueDetails.reduce(
                    (acc, detail) => acc + detail.hoaDonCT.soLuong * detail.hoaDonCT.giaBan,
                    0,
                );

                // Tìm voucher tốt nhất với tổng tiền
                const bestVoucher = findBestVoucher(vouchers, totalItems);
                setBestVoucher(bestVoucher);
            } catch (error) {
                console.error('Failed to fetch vouchers', error);
            }
        };
        // Chỉ gọi fetchVouchers khi có hóa đơn được chọn và có chi tiết hóa đơn
        if (selectedBill && billDetails.length > 0) {
            fetchVouchers();
        }
    }, [selectedBill, billDetails]);

    const calculateTotalAmount = () => {
        const uniqueProductIds = new Set();

        // Lọc ra các chi tiết hóa đơn không bị trùng
        const uniqueDetails = billDetails.filter((detail) => {
            // Kiểm tra xem chi tiết có thuộc hóa đơn đã chọn không
            if (detail.hoaDonCT && detail.hoaDonCT.hoaDon.id === selectedBill.id) {
                const isUnique = !uniqueProductIds.has(detail.hoaDonCT.sanPhamCT.id); // Sử dụng id sản phẩm
                if (isUnique) {
                    uniqueProductIds.add(detail.hoaDonCT.sanPhamCT.id); // Thêm id sản phẩm vào tập hợp
                    return true; // Giữ lại chi tiết này
                }
            }
            return false; // Bỏ qua chi tiết này nếu không duy nhất hoặc không thuộc hóa đơn đã chọn
        });

        // Tính toán tổng tiền hàng từ các chi tiết hóa đơn duy nhất
        const totalItems = uniqueDetails.reduce((acc, detail) => {
            const priceInfo = productPrices[detail.hoaDonCT.id] || {
                originalPrice: detail.hoaDonCT.giaBan,
                discountedPrice: detail.hoaDonCT.giaBan,
            };
            return acc + detail.hoaDonCT.soLuong * priceInfo.discountedPrice;
        }, 0);

        // Tính toán tổng số tiền
        const total = totalItems + shippingFee - discount; // Tổng tiền = Tiền hàng + Phí vận chuyển - Giảm giá
        return total;
    };

    const handleOpenModal = () => {
        if (selectedBill) {
            const total = calculateTotalAmount();
            setTotalAmount(total);
            setCustomerPayment(''); // Reset customerPayment khi mở modal
            setIsModalOpenn(true);
            setPaymentMethod('');
        } else {
            swal('Thất bại!', 'Vui lòng chọn hóa đơn trước!', 'warning');
        }
    };

    const handleAddTransaction = async () => {
        // Lấy tổng tiền từ hóa đơn đã chọn
        const totalAmount = calculateTotalAmount(); // Giả sử bạn đã có hàm này để tính tổng tiền

        // Lấy giá trị tiền khách đưa trực tiếp từ state
        const customerPaymentAmount = parseFloat(customerPayment) || 0;

        // Tính toán uniqueDetails
        const uniqueProductIds = new Set();
        const uniqueDetails = billDetails
            .filter((detail) => detail.hoaDonCT && detail.hoaDonCT.hoaDon.id === selectedBill.id)
            .filter((detail) => {
                const isUnique = !uniqueProductIds.has(detail.hoaDonCT.id);
                if (isUnique) {
                    uniqueProductIds.add(detail.hoaDonCT.id);
                }
                return isUnique;
            });

        // Tính toán tổng số lượng
        const totalQuantity = uniqueDetails.reduce((acc, detail) => acc + detail.hoaDonCT.soLuong, 0);

        // Tạo đối tượng giao dịch mới
        const newTransaction = {
            ma: null, // Mã tạm thời để null
            tongTien: customerPaymentAmount, // Sử dụng số tiền khách đưa
            phuongThucThanhToan: paymentMethod === 'cash' ? 'Tiền mặt' : 'Chuyển khoản',
            trangThai: 1, // Trạng thái là 1
            taiKhoan: null, // Tài khoản để null
            ngayTao: new Date(),
            hoaDon: {
                id: selectedBill.id, // ID của hóa đơn đang được chọn
            },
        };

        const lichSuDonHang = {
            taiKhoan: { id: 1 }, // Thay đổi ID này nếu cần
            hoaDon: { id: selectedBill.id },
            moTa: 'Đơn hàng đã được thanh toán',
            ngayTao: new Date(),
            trangThai: 6, // Trạng thái hóa đơn là 6
        };

        try {
            await axios.post('http://localhost:8080/api/lich-su-don-hang', lichSuDonHang);

            // Gửi yêu cầu thêm giao dịch mới
            const response = await axios.post('http://localhost:8080/api/thanh-toan', newTransaction);
            const createdTransaction = response.data;

            // Cập nhật state transactions
            setTransactions((prevTransactions) => [...prevTransactions, createdTransaction]);

            // Không reset customerPayment, giữ nguyên giá trị
            // setCustomerPayment(0); // Dòng này bị comment lại

            swal('Thành công!', 'Giao dịch đã được thêm!', 'success');

            // Lấy thông tin hóa đơn hiện tại
            const existingBillResponse = await axios.get(`http://localhost:8080/api/hoa-don/${selectedBill.id}`);
            const existingBill = existingBillResponse.data;

            // Cập nhật trạng thái hóa đơn thành 6
            const updatedBill = {
                ...existingBill,
                soLuong: totalQuantity,
                tongTien: totalAmount,
                trangThai: 6, // Chỉ cập nhật trạng thái
            };

            // Gửi yêu cầu cập nhật hóa đơn
            await axios.put(`http://localhost:8080/api/hoa-don/${selectedBill.id}`, updatedBill);
        } catch (error) {
            console.error('Có lỗi xảy ra khi thêm giao dịch!', error);
            swal('Thất bại!', 'Có lỗi xảy ra khi thêm giao dịch!', 'error');
        }
    };

    const handleDeleteTransaction = async (transactionId) => {
        try {
            await axios.delete(`http://localhost:8080/api/thanh-toan/${transactionId}`);
            setTransactions(transactions.filter((transaction) => transaction.id !== transactionId)); // Cập nhật lại state
            swal('Thành công!', 'Giao dịch đã được xóa!', 'success');
        } catch (error) {
            console.error('Có lỗi xảy ra khi xóa giao dịch!', error);
            swal('Thất bại!', 'Có lỗi xảy ra khi xóa giao dịch!', 'error');
        }
    };

    const loadBills = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/hoa-don');
            setBills(response.data);
        } catch (error) {
            console.error('Failed to fetch bills', error);
        }
    };

    const loadCustomers = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/tai-khoan');
            setCustomers(response.data);
        } catch (error) {
            console.error('Failed to fetch Customers', error);
        }
    };

    const loadProducts = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/san-pham-ct/with-images');
            setProducts(response.data);
        } catch (error) {
            console.error('Failed to fetch Products', error);
        }
    };

    const loadTransactionsByBillId = async (hoaDonId) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/thanh-toan/hoa-don/${hoaDonId}`);
            const transactionData = response.data;

            if (Array.isArray(transactionData)) {
                setTransactions(transactionData);
            } else if (transactionData && typeof transactionData === 'object') {
                setTransactions([transactionData]);
            } else {
                setTransactions([]);
            }
        } catch (error) {
            console.error('Failed to fetch transactions', error);
            setTransactions([]);
        }
    };

    const calculateTotalFromTransactions = (transactionsToCalculate = transactions) => {
        return transactionsToCalculate
            .filter((transaction) => transaction.trangThai === 1)
            .reduce((total, transaction) => total + transaction.tongTien, 0);
    };

    useEffect(() => {
        loadBills();
        loadProducts();
        loadCustomers();
        console.log(transactions);
    }, []);

    const filteredCustomers = customers.filter((customer) => customer.vaiTro === 'Customer');

    const handleAddBillDetail = async (values) => {
        // Check for duplicate product in billDetails
        const exists = billDetails.some((detail) => detail.hoaDonCT.sanPhamCT.id === values.sanPhamCTId);

        if (exists) {
            swal('Thất bại!', 'Sản phẩm đã tồn tại trong hóa đơn! Vui lòng chọn sản phẩm khác.', 'warning');
            return; // Exit the function if the product already exists
        }

        const newBillDetail = {
            sanPhamCT: {
                id: values.sanPhamCTId,
            },
            hoaDon: {
                id: values.hoaDonId,
            },
            soLuong: values.soLuong,
            giaBan: values.giaBan,
            trangThai: values.trangThai === '1' ? 1 : 0,
        };

        try {
            await axios.post('http://localhost:8080/api/hoa-don-ct', newBillDetail);
            swal('Thành công!', 'Chi tiết hóa đơn đã được thêm!', 'success');
            setQuantity(0);
            setShowQuantityModal(false);

            // Update bill details for the current bill
            await loadBillDetailsWithImages(values.hoaDonId);
        } catch (error) {
            console.error('Có lỗi xảy ra khi thêm chi tiết hóa đơn!', error);
            swal('Thất bại!', 'Có lỗi xảy ra khi thêm chi tiết hóa đơn!', 'error');
        }
    };

    const handleProductModal = () => {
        setShowProductModal(true);
    };

    const handleCloseProductModal = () => {
        setShowProductModal(false);
    };

    const handleQuantityModal = (product) => {
        // Nhận sản phẩm đã chọn
        setSelectedProduct(product); // Cập nhật sản phẩm đã chọn
        setShowQuantityModal(true);
    };

    // const handleCustomerModal = () => {
    //     setShowCustomerModal(true);
    // };
    const openDeleteModal = (detail) => {
        setDeleteDetail(detail); // Gán hóa đơn chi tiết vào state
        setIsModalOpen(true); // Mở modal
    };

    const confirmDelete = () => {
        if (deleteDetail) {
            handleDelete(deleteDetail); // Gọi hàm xóa khi xác nhận
            setIsModalOpen(false); // Đóng modal sau khi xóa
            setDeleteDetail(null); // Reset lại detail sau khi xóa
        }
    };

    const cancelDelete = () => {
        setIsModalOpen(false); // Đóng modal khi hủy
        setDeleteDetail(null); // Reset lại detail khi hủy
    };

    const handleAddBill = async (values) => {
        // Lọc ra các hóa đơn có trạng thái là 1
        const activeBills = bills.filter((bill) => bill.trangThai === 1 && bill.loaiHoaDon === 'Tại quầy');

        // Kiểm tra xem số lượng hóa đơn có trạng thái 1 có lớn hơn hoặc bằng 6 không
        if (activeBills.length >= 6) {
            swal('Thất bại!', 'Chỉ được tạo tối đa 6 hóa đơn có trạng thái đang hoạt động!', 'warning');
            return;
        }

        const newBill = {
            ten: values.billName,
            trangThai: values.status === '1' ? 1 : 0,
            ngayTao: new Date().toISOString(),
            soLuong: 0,
            loaiHoaDon: 'Tại quầy',
        };

        try {
            // Gửi yêu cầu tạo hóa đơn mới
            const response = await axios.post('http://localhost:8080/api/hoa-don', newBill);
            const createdBill = response.data; // Lấy dữ liệu hóa đơn vừa tạo

            // Tạo mã hóa đơn
            const billCode = `HD${createdBill.id}`; // Tạo mã hóa đơn với định dạng "HD" + id

            const lichSuDonHang = {
                taiKhoan: { id: 1 }, // Thay đổi ID này nếu cần
                hoaDon: { id: createdBill.id },
                moTa: 'Đơn hàng đã được tạo',
                ngayTao: new Date(),
                trangThai: 1, // Trạng thái hóa đơn là 1
            };

            await axios.post('http://localhost:8080/api/lich-su-don-hang', lichSuDonHang);

            // Cập nhật hóa đơn với mã hóa đơn
            await axios.put(`http://localhost:8080/api/hoa-don/${createdBill.id}`, {
                ...createdBill,
                ma: billCode, // Thêm mã hóa đơn vào đối tượng hóa đơn
            });

            swal('Thành công!', 'Hóa đơn đã được thêm!', 'success');
            loadBills(); // Tải lại danh sách hóa đơn
        } catch (error) {
            console.error('Có lỗi xảy ra khi thêm hóa đơn!', error);
            swal('Thất bại!', 'Có lỗi xảy ra khi thêm hóa đơn!', 'error');
        }
    };

    const handleDelete = async (detail) => {
        try {
            await axios.delete(`http://localhost:8080/api/hoa-don-ct/${detail.id}`);

            // Update the state after the deletion
            setBillDetails((prevDetails) => prevDetails.filter((d) => d.hoaDonCT.id !== detail.id));

            swal('Thành công!', 'Chi tiết hóa đơn đã được xóa!', 'success');
        } catch (error) {
            console.error('Có lỗi xảy ra khi xóa chi tiết hóa đơn!', error);
            swal('Thất bại!', 'Có lỗi xảy ra khi xóa chi tiết hóa đơn!', 'error');
        }
    };

    const decreaseQuantity = async (detail) => {
        const currentQuantity = detail.hoaDonCT.soLuong;

        if (currentQuantity <= 1) {
            swal('Thất bại!', 'Số lượng phải lớn hơn 1!', 'warning');
            return;
        }

        const updatedDetail = {
            ...detail.hoaDonCT,
            soLuong: currentQuantity - 1,
        };

        try {
            await axios.put(`http://localhost:8080/api/hoa-don-ct/${detail.hoaDonCT.id}`, updatedDetail);

            // Update the bill details after the API call
            setBillDetails((prevDetails) =>
                prevDetails.map((d) => (d.hoaDonCT.id === detail.hoaDonCT.id ? { ...d, hoaDonCT: updatedDetail } : d)),
            );
        } catch (error) {
            console.error('Có lỗi xảy ra khi giảm số lượng!', error);
            swal('Thất bại!', 'Có lỗi xảy ra khi giảm số lượng!', 'error');
        }
    };

    const increaseQuantity = async (detail) => {
        const updatedDetail = {
            ...detail.hoaDonCT,
            soLuong: detail.hoaDonCT.soLuong + 1,
        };

        try {
            await axios.put(`http://localhost:8080/api/hoa-don-ct/${detail.hoaDonCT.id}`, updatedDetail);

            // Update the bill details after the API call
            setBillDetails((prevDetails) =>
                prevDetails.map((d) => (d.hoaDonCT.id === detail.hoaDonCT.id ? { ...d, hoaDonCT: updatedDetail } : d)),
            );
        } catch (error) {
            console.error('Có lỗi xảy ra khi tăng số lượng!', error);
            swal('Thất bại!', 'Có lỗi xảy ra khi tăng số lượng!', 'error');
        }
    };

    const confirmPurchase = async (hoaDonId) => {
        // Tính toán uniqueDetails
        const uniqueProductIds = new Set();
        const uniqueDetails = billDetails
            .filter((detail) => detail.hoaDonCT && detail.hoaDonCT.hoaDon.id === hoaDonId)
            .filter((detail) => {
                const isUnique = !uniqueProductIds.has(detail.hoaDonCT.id);
                if (isUnique) {
                    uniqueProductIds.add(detail.hoaDonCT.id);
                }
                return isUnique;
            });

        // Tính toán tổng tiền hàng
        const totalItems = uniqueDetails.reduce((acc, detail) => {
            const priceInfo = productPrices[detail.hoaDonCT.id] || {
                originalPrice: detail.hoaDonCT.giaBan,
                discountedPrice: detail.hoaDonCT.giaBan,
            };
            return acc + detail.hoaDonCT.soLuong * priceInfo.discountedPrice;
        }, 0);

        // Tính giảm giá từ voucher
        const voucherDiscount = bestVoucher
            ? (() => {
                const discountPercentage = bestVoucher.giaTri / 100;
                const discountAmount = totalItems * discountPercentage;

                // Kiểm tra và trả về giá trị giảm giá không vượt quá giá trị max
                return discountAmount > bestVoucher.giaTriMax ? bestVoucher.giaTriMax : discountAmount;
            })()
            : 0;

        // Tổng số tiền = Tiền hàng - Giảm giá + Phí vận chuyển
        const totalAmount = totalItems - voucherDiscount + shippingFee;

        const totalQuantity = uniqueDetails.reduce((acc, detail) => acc + detail.hoaDonCT.soLuong, 0);

        // Xác thực thanh toán của khách hàng
        const payment = calculateTotalFromTransactions(); // Sử dụng hàm tính tổng từ các giao dịch

        if (payment <= 0) {
            swal('Thất bại!', 'Vui lòng nhập số tiền thanh toán!', 'warning');
            return;
        }

        if (payment < totalAmount) {
            swal('Thất bại!', 'Số tiền thanh toán phải lớn hơn hoặc bằng tổng số tiền!', 'warning');
            return;
        }

        if (bestVoucher) {
            try {
                await axios.put(
                    `http://localhost:8080/api/voucher/giam-so-luong/${bestVoucher.id}`,
                    {},
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    },
                );
            } catch (voucherError) {
                // Nếu giảm voucher thất bại, hủy hóa đơn
                await axios.delete(`http://localhost:8080/api/hoa-don/${hoaDonId}`);

                console.error('Lỗi giảm voucher:', voucherError);
                swal('Lỗi!', 'Không thể sử dụng mã giảm giá', 'error');
                return;
            }
        }

        const lichSuDonHang = {
            taiKhoan: { id: 1 },
            hoaDon: { id: selectedBill.id },
            moTa: 'Đơn hàng đã được thanh toán',
            ngayTao: new Date(),
            trangThai: 7,
        };

        await axios.post('http://localhost:8080/api/lich-su-don-hang', lichSuDonHang);

        try {
            // Gửi yêu cầu xác nhận thanh toán
            const response = await fetch('http://localhost:8080/api/hoa-don-ct/confirm-purchase', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ hoaDonId }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.text(); // Nhận chuỗi phản hồi từ server

            // Hiển thị thông báo xác nhận thanh toán thành công
            Swal.fire({
                title: 'Thanh toán thành công!',
                text: data, // Dữ liệu trả về từ server
                icon: 'success',
                confirmButtonText: 'OK',
            }).then(async () => {
                // Cập nhật trạng thái hóa đơn thành 2 (đã thanh toán)
                await updateBillStatus(hoaDonId, 7);

                // Cập nhật trạng thái giao dịch thành 2
                // Lấy thông tin hóa đơn hiện tại để giữ nguyên các trường cần thiết
                let existingBill;
                try {
                    const existingBillResponse = await axios.get(`http://localhost:8080/api/hoa-don/${hoaDonId}`);
                    existingBill = existingBillResponse.data; // Lưu thông tin hóa đơn vào biến
                } catch (error) {
                    console.error('Có lỗi xảy ra khi lấy thông tin hóa đơn!', error);
                    return; // Dừng hàm nếu không lấy được thông tin hóa đơn
                }

                // Cập nhật thông tin hóa đơn
                const updatedBill = {
                    id: hoaDonId,
                    idVoucher: bestVoucher ? bestVoucher.id : null,
                    soLuong: totalQuantity,
                    tongTien: totalAmount,
                    ma: existingBill.ma, // Giữ nguyên mã hóa đơn cũ
                    loaiHoaDon: existingBill.loaiHoaDon, // Giữ nguyên loại hóa đơn cũ
                    ngayTao: existingBill.ngayTao, // Giữ nguyên ngày tạo cũ
                    trangThai: existingBill.trangThai, // Giữ nguyên trạng thái cũ
                };

                // Gửi yêu cầu cập nhật hóa đơn
                await axios.put(`http://localhost:8080/api/hoa-don/${hoaDonId}`, updatedBill);

                // C ập nhật danh sách hóa đơn trong state để xóa hóa đơn đã thanh toán
                setBills((prevBills) => prevBills.filter((bill) => bill.id !== hoaDonId));

                // Reset lại state liên quan đến hóa đơn đã chọn và chi tiết hóa đơn
                setSelectedBill(null); // Đặt lại hóa đơn đã chọn
                setBillDetails([]); // Đặt lại chi tiết hóa đơn

                loadProducts(); // Tải lại sản phẩm nếu cần
            });
        } catch (error) {
            console.error('Có lỗi xảy ra trong quá trình xác nhận thanh toán:', error);
        }
    };

    // Hàm cập nhật trạng thái giao dịch
    const updateTransactionStatus = async (transactionId, status) => {
        try {
            const response = await fetch(`http://localhost:8080/api/thanh-toan/update-status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ transactionId, status }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json(); // Nhận dữ liệu trả về từ server
            console.log('Trạng thái giao dịch đã được cập nhật:', data);
        } catch (error) {
            console.error('Error updating transaction status:', error);
        }
    };

    // Hàm cập nhật trạng thái hóa đơn
    const updateBillStatus = async (hoaDonId, status) => {
        try {
            const response = await fetch(`http://localhost:8080/api/hoa-don/update-status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ hoaDonId, status }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json(); // Nhận dữ liệu trả về từ server
            console.log('Trạng thái hóa đơn đã được cập nhật:', data);
        } catch (error) {
            console.error('Error updating bill status:', error);
        }
    };

    // Hàm handleDeleteBill đã có, cập nhật lại danh sách hóa đơn trong UI
    const handleDeleteBill = async (billId) => {
        try {
            await axios.delete(`http://localhost:8080/api/hoa-don/delete/${billId}`);

            // Remove the deleted bill from the list in state
            setBills((prevBills) => prevBills.filter((bill) => bill.id !== billId));

            // Optional: Reset UI nếu bạn muốn trở về trạng thái ban đầu
            setSelectedBill(null); // Nếu bạn có một state đang lưu hóa đơn được chọn
            swal('Thành công', 'Xóa hóa đơn thành công', 'success');
        } catch (error) {
            console.error('Có lỗi xảy ra khi xóa hóa đơn!', error);
            swal('Thất bại!', 'Có lỗi xảy ra khi xóa hóa đơn!', 'error');
        }
    };

    // Filtering products based on search and filter criteria
    const filteredProducts = products.filter((product) => {
        const matchesSearchTerm = product.sanPhamTen.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesBrand = brandFilter ? product.thuongHieuTen === brandFilter : true;
        const matchesColor = colorFilter ? product.mauSacTen === colorFilter : true;
        const matchesWeight = weightFilter ? product.trongLuongTen === weightFilter : true;
        const matchesPrice = priceFilter ? product.donGia <= priceFilter : true;

        return matchesSearchTerm && matchesBrand && matchesColor && matchesWeight && matchesPrice;
    });

    useEffect(() => {
        const fetchProductPrices = async () => {
            if (!selectedBill || !billDetails.length) return;

            const uniqueProductIds = new Set();
            const uniqueDetails = billDetails
                .filter(
                    (detail) =>
                        detail.hoaDonCT &&
                        detail.hoaDonCT.hoaDon.id === selectedBill.id &&
                        detail.hoaDonCT.trangThai === 1,
                )
                .filter((detail) => {
                    const isUnique = !uniqueProductIds.has(detail.hoaDonCT.id);
                    if (isUnique) {
                        uniqueProductIds.add(detail.hoaDonCT.id);
                    }
                    return isUnique;
                });

            const pricePromises = uniqueDetails.map(async (detail) => {
                try {
                    const response = await axios.get(
                        `http://localhost:8080/api/san-pham-khuyen-mai/san-pham-ct/${detail.hoaDonCT.sanPhamCT.id}`,
                    );

                    return {
                        [detail.hoaDonCT.id]:
                            response.data.length > 0
                                ? {
                                    originalPrice: detail.hoaDonCT.giaBan,
                                    discountedPrice: response.data[0].giaKhuyenMai,
                                    promotion: response.data[0],
                                }
                                : {
                                    originalPrice: detail.hoaDonCT.giaBan,
                                    discountedPrice: detail.hoaDonCT.giaBan,
                                    promotion: null,
                                },
                    };
                } catch (error) {
                    console.error('Error fetching product promotion:', error);
                    return {
                        [detail.hoaDonCT.id]: {
                            originalPrice: detail.hoaDonCT.giaBan,
                            discountedPrice: detail.hoaDonCT.giaBan,
                            promotion: null,
                        },
                    };
                }
            });

            const priceResults = await Promise.all(pricePromises);
            const priceMap = priceResults.reduce((acc, curr) => ({ ...acc, ...curr }), {});
            setProductPrices(priceMap);
        };

        fetchProductPrices();
    }, [billDetails]);

    const loadBillDetailsWithImages = async (hoaDonId) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/hoa-don-ct/with-images/${hoaDonId}`);
            setBillDetails(response.data);
        } catch (error) {
            console.error('Failed to fetch BillDetails with images', error);
        }
    };

    const handleBillClick = (bill) => {
        setSelectedBill(bill);
        loadBillDetailsWithImages(bill.id);
        loadTransactionsByBillId(bill.id).then(() => {
            setCustomerPayment(0); // Reset customerPayment khi chuyển đổi hóa đơn
        });
    };

    useEffect(() => {
        if (Array.isArray(transactions)) {
            const total = transactions
                .filter((transaction) => transaction.trangThai === 1)
                .reduce((sum, transaction) => sum + transaction.tongTien, 0);

            // Chỉ cập nhật nếu tổng giao dịch khác với giá trị hiện tại
            if (total !== parseFloat(customerPayment)) {
                setCustomerPayment(total);
            }
        }
    }, [transactions]);

    useEffect(() => {
        const fetchPromotions = async () => {
            try {
                if (!filteredProducts?.length) return;

                const promotionPromises = filteredProducts.map(async (product) => {
                    const response = await axios.get(
                        `http://localhost:8080/api/san-pham-khuyen-mai/san-pham-ct/${product.id}`,
                    );
                    return {
                        productId: product.id,
                        promotion: response.data.length > 0 ? response.data[0] : null,
                    };
                });

                const promotionResults = await Promise.all(promotionPromises);

                const promotionMap = promotionResults.reduce((acc, result) => {
                    acc[result.productId] = result.promotion;
                    return acc;
                }, {});

                setProductPromotions(promotionMap);
            } catch (error) {
                console.error('Error fetching promotions:', error);
            }
        };

        const timeoutId = setTimeout(() => {
            fetchPromotions();
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [JSON.stringify(filteredProducts)]);

    return (
        <div className="h-[500px] flex justify-between items-start p-4">
            <div className="container mx-auto p-4">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="font-bold text-xl">Bán hàng</h1>
                    <button
                        className="bg-[#2f19ae] text-white py-2 px-4 rounded-md flex items-center"
                        onClick={() => handleAddBill({ billName: 'Hóa đơn mới', status: '1' })}
                    >
                        <AddIcon style={{ fontSize: 19 }} className="mr-2" />
                        Thêm hóa đơn
                    </button>
                </div>

                {bills.length > 0 ? (
                    <div className="flex items-center border-b-2 border-gray-200 mb-4">
                        {bills
                            .filter(
                                (bill) =>
                                    (bill.trangThai === 1 || bill.trangThai === 6) && bill.loaiHoaDon === 'Tại quầy',
                            )
                            .map(
                                (
                                    bill, // Chỉ hiển thị hóa đơn có trạng thái là 1
                                ) => (
                                    <div
                                        key={bill.id}
                                        className={`flex items-center mr-4 cursor-pointer ${selectedBill?.id === bill.id
                                            ? 'border-b-2 border-blue-800 pb-2 text-blue-500'
                                            : ''
                                            }`}
                                        onClick={() => handleBillClick(bill)}
                                    >
                                        <span className="text-sm text-gray-700">
                                            Hóa đơn {bill.id} - {bill.ten}
                                            <ShoppingCartIcon style={{ fontSize: 18 }} className="mr-2" />
                                        </span>
                                        {/* Red 'X' icon for deleting the bill */}
                                        <span
                                            className="text-red-500 ml-2 cursor-pointer"
                                            onClick={(e) => {
                                                e.stopPropagation(); // Prevent triggering handleBillClick
                                                handleDeleteBill(bill.id); // Handle delete
                                            }}
                                        >
                                            <CloseIcon style={{ fontSize: 18 }} />
                                        </span>
                                    </div>
                                ),
                            )}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center mt-4">
                        <span className="text-gray-500 text-[50px] mt-[200px]">No data found</span>
                    </div>
                )}

                {selectedBill && (
                    <>
                        <div className="mb-4 flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-blue-700">Sản phẩm</h2>
                            <div className="flex space-x-2">
                                <button className="border border-blue-950 text-blue-900 px-2 py-1 rounded">
                                    QUÉT QR SẢN PHẨM
                                </button>
                                <button
                                    className="border border-blue-950 text-blue-900 px-2 py-1 rounded"
                                    onClick={handleProductModal}
                                >
                                    THÊM SẢN PHẨM
                                </button>
                            </div>
                        </div>
                        <hr className="border-gray-300 mb-4" />

                        {selectedBill && (
                            <div className="mt-4">
                                {/* Các chi tiết hóa đơn */}
                                {(() => {
                                    const uniqueProductIds = new Set();
                                    const uniqueDetails = billDetails
                                        .filter(
                                            (detail) =>
                                                detail.hoaDonCT &&
                                                detail.hoaDonCT.hoaDon.id === selectedBill.id && // Sửa từ currentOrder.id thành selectedBill.id
                                                detail.hoaDonCT.trangThai === 1,
                                        )
                                        .filter((detail) => {
                                            const isUnique = !uniqueProductIds.has(detail.hoaDonCT.id);
                                            if (isUnique) {
                                                uniqueProductIds.add(detail.hoaDonCT.id);
                                            }
                                            return isUnique;
                                        });

                                    return uniqueDetails.length > 0 ? (
                                        <>

                                            {uniqueDetails.map((detail) => {
                                                const priceInfo = productPrices[detail.hoaDonCT.id] || {
                                                    originalPrice: detail.hoaDonCT.giaBan,
                                                    discountedPrice: detail.hoaDonCT.giaBan,
                                                    promotion: null,
                                                };

                                                return (
                                                    <div
                                                        key={detail.hoaDonCT.id}
                                                        className="flex items-center border-b py-4"
                                                    >
                                                        <input className="mr-4" type="checkbox" />
                                                        <div className="flex items-center">
                                                            <div className="relative">
                                                                <img
                                                                    src={detail.link || 'default_image.jpg'}
                                                                    alt={detail.hoaDonCT.sanPhamCT.sanPham.ten}
                                                                    className="w-20 h-20 object-cover"
                                                                />
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-gray-800 font-semibold">
                                                                    {detail.hoaDonCT.sanPhamCT.sanPham.ten}
                                                                </div>
                                                                <div className="flex items-center space-x-2">
                                                                    {priceInfo.promotion ? (
                                                                        <>
                                                                            <div className="text-red-500">
                                                                                {priceInfo.discountedPrice.toLocaleString()}{' '}
                                                                                VND
                                                                            </div>
                                                                            <div className="text-gray-400 line-through">
                                                                                {priceInfo.originalPrice.toLocaleString()}{' '}
                                                                                VND
                                                                            </div>
                                                                            <div className="text-green-500 font-bold">
                                                                                {Math.round(
                                                                                    ((priceInfo.originalPrice -
                                                                                        priceInfo.discountedPrice) /
                                                                                        priceInfo.originalPrice) *
                                                                                    100,
                                                                                )}
                                                                                % off
                                                                            </div>
                                                                        </>
                                                                    ) : (
                                                                        <div className="text-gray-400">
                                                                            {priceInfo.originalPrice.toLocaleString()}{' '}
                                                                            VND
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="text-gray-600">
                                                                    Size: {detail.hoaDonCT.sanPhamCT.trongLuong.ten}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center ml-auto">
                                                            <button
                                                                className="border border-gray-300 px-2 py-1"
                                                                onClick={() => decreaseQuantity(detail)}
                                                            >
                                                                {' - '}
                                                            </button>
                                                            <span className="mx-2">{detail.hoaDonCT.soLuong}</span>
                                                            <button
                                                                className="border border-gray-300 px-2 py-1"
                                                                onClick={() => {
                                                                    // Kiểm tra số lượng tối đa trước khi tăng
                                                                    const maxQuantity =
                                                                        detail.hoaDonCT.sanPhamCT.soLuong; // Số lượng tối đa trong kho
                                                                    if (detail.hoaDonCT.soLuong >= maxQuantity) {
                                                                        swal(
                                                                            'Thông báo',
                                                                            `Số lượng sản phẩm đã hết`,
                                                                            'warning',
                                                                        );
                                                                    } else {
                                                                        increaseQuantity(detail);
                                                                    }
                                                                }}
                                                            >
                                                                {' + '}
                                                            </button>
                                                        </div>
                                                        <div className="text-red-500 font-bold ml-8">
                                                            {(
                                                                detail.hoaDonCT.soLuong *
                                                                (priceInfo.discountedPrice || detail.hoaDonCT.giaBan)
                                                            ).toLocaleString()}{' '}
                                                            VND
                                                        </div>
                                                        <button
                                                            className="ml-4 text-red-500"
                                                            onClick={() => openDeleteModal(detail.hoaDonCT)}
                                                        >
                                                            <TrashIcon className="w-5" />
                                                        </button>
                                                    </div>
                                                );
                                            })}

                                            {isModalOpen && (
                                                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                                    <div className="bg-white p-6 rounded shadow-lg">
                                                        <h2 className="text-xl font-bold mb-4">Xác nhận xóa</h2>
                                                        <p>Bạn có chắc chắn muốn xóa sản phẩm này không?</p>
                                                        <div className="flex justify-end mt-4">
                                                            <button
                                                                className="bg-red-500 text-white px-4 py-2 rounded mr-2"
                                                                onClick={confirmDelete}
                                                            >
                                                                Có
                                                            </button>
                                                            <button
                                                                className="bg-gray-300 px-4 py-2 rounded"
                                                                onClick={cancelDelete}
                                                            >
                                                                Không
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Phần khách hàng và thanh toán */}
                                            <div className="max-w-full p-4 bg-white mt-20">
                                                <div className="flex justify-between items-center mb-4">
                                                    <h1 className="text-2xl font-bold text-blue-700">Khách hàng</h1>
                                                    {/* <button
                                                        className="bg-[#2f19ae] text-white px-4 py-2 rounded flex items-center"
                                                        onClick={handleCustomerModal}
                                                    >
                                                        <i className="fas fa-user mr-2"></i> CHỌN KHÁCH HÀNG
                                                    </button> */}
                                                </div>
                                                <hr className="border-gray-300 my-2" />
                                                <div className="flex justify-between items-center mb-4">
                                                    <div className="flex-1">
                                                        <label className="block text-gray-700">Tên khách hàng</label>
                                                    </div>
                                                    <div className="flex justify-center flex-1">
                                                        <span className="bg-gray-200 px-4 py-2 rounded">Khách lẻ</span>
                                                    </div>
                                                    {/* <div className="flex items-center flex-1 justify-end">
                                                        <label className="block text-gray-700 mr-2">Giao hàng</label>
                                                        <input type="checkbox" className="toggle-checkbox" />
                                                    </div> */}
                                                </div>
                                                <div className="flex justify-end mb-6">
                                                    <div className="w-[202px] pr-2">
                                                        <input
                                                            type="text"
                                                            className="border border-gray-300 rounded px-2 py-1 bg-gray-100 cursor-not-allowed w-full"
                                                            placeholder="Phiếu giảm giá"
                                                            value={bestVoucher ? bestVoucher.ma : ''}
                                                            readOnly
                                                        />
                                                    </div>
                                                    <div className="w-[202px] pl-2">
                                                        <input
                                                            type="text"
                                                            className="border border-gray-300 rounded px-2 py-1 bg-gray-100 cursor-not-allowed w-full"
                                                            placeholder="Phần trăm giảm"
                                                            value={bestVoucher ? `${bestVoucher.giaTri}%` : ''}
                                                            readOnly
                                                        />
                                                    </div>
                                                </div>
                                                {/* Phí vận chuyển, Giảm giá và Tổng số tiền */}
                                                <div className="mb-4 flex flex-col items-end space-y-4">
                                                    {/* Tiền hàng */}
                                                    <div className="flex justify-between w-full max-w-[400px] mb-2">
                                                        <span className="text-gray-700">Tiền hàng:</span>
                                                        <div className="text-gray-500 font-bold ml-4">
                                                            {(() => {
                                                                const uniqueProductIds = new Set();
                                                                const uniqueDetails = billDetails
                                                                    .filter(
                                                                        (detail) =>
                                                                            detail.hoaDonCT &&
                                                                            detail.hoaDonCT.hoaDon.id ===
                                                                            selectedBill.id &&
                                                                            detail.hoaDonCT.trangThai === 1,
                                                                    )
                                                                    .filter((detail) => {
                                                                        const isUnique = !uniqueProductIds.has(
                                                                            detail.hoaDonCT.id,
                                                                        );
                                                                        if (isUnique) {
                                                                            uniqueProductIds.add(detail.hoaDonCT.id);
                                                                        }
                                                                        return isUnique;
                                                                    });

                                                                // Tính toán tổng tiền hàng với giá đã giảm
                                                                const totalItems = uniqueDetails.reduce(
                                                                    (acc, detail) => {
                                                                        const priceInfo = productPrices[
                                                                            detail.hoaDonCT.id
                                                                        ] || {
                                                                            originalPrice: detail.hoaDonCT.giaBan,
                                                                            discountedPrice: detail.hoaDonCT.giaBan,
                                                                        };
                                                                        return (
                                                                            acc +
                                                                            detail.hoaDonCT.soLuong *
                                                                            priceInfo.discountedPrice
                                                                        );
                                                                    },
                                                                    0,
                                                                );

                                                                return totalItems.toLocaleString(); // Định dạng số tiền
                                                            })()}{' '}
                                                            VND
                                                        </div>
                                                    </div>

                                                    {/* Phí vận chuyển */}
                                                    {/* <div className="flex justify-between w-full max-w-[400px] mb-2">
                                                        <span className="text-gray-700">Phí vận chuyển:</span>
                                                        <input
                                                            type="number"
                                                            value={shippingFee}
                                                            onChange={(e) =>
                                                                setShippingFee(parseFloat(e.target.value) || 0)
                                                            }
                                                            className="ml-4 px-2 py-1 rounded"
                                                        />
                                                    </div> */}

                                                    {/* Giảm giá */}
                                                    <div className="flex justify-between w-full max-w-[400px] mb-2">
                                                        <span className="text-gray-700">Giảm giá:</span>
                                                        <div className="flex items-center">
                                                            <input
                                                                type="number"
                                                                value={(() => {
                                                                    const total = uniqueDetails.reduce(

                                                                        (acc, detail) => {
                                                                            const priceInfo = productPrices[
                                                                                detail.hoaDonCT.id
                                                                            ] || {
                                                                                originalPrice: detail.hoaDonCT.giaBan,
                                                                                discountedPrice: detail.hoaDonCT.giaBan,
                                                                            };
                                                                            return (
                                                                                acc +
                                                                                detail.hoaDonCT.soLuong *
                                                                                priceInfo.discountedPrice
                                                                            );
                                                                        },
                                                                        0,
                                                                    );

                                                                    if (!bestVoucher) return 0;

                                                                    // Tính toán giảm giá theo phần trăm
                                                                    const discountPercentage = bestVoucher.giaTri / 100;
                                                                    const discountAmount = total * discountPercentage;

                                                                    // Kiểm tra và trả về giá trị giảm giá không vượt quá giá trị max
                                                                    return discountAmount > bestVoucher.giaTriMax
                                                                        ? bestVoucher.giaTriMax
                                                                        : discountAmount;
                                                                })()}
                                                                className="ml-4 px-2 py-1 rounded bg-gray-100 cursor-not-allowed"
                                                                readOnly
                                                            />
                                                            <span className="ml-2">VNĐ</span>
                                                        </div>
                                                    </div>

                                                    {/* Giảm giá */}
                                                    {/* <div className="flex justify-between w-full max-w-[400px] mb-2">
                                                        <span className="text-gray-700">Giảm giá:</span>
                                                        <div className="flex items-center">
                                                            <span className="ml-4 px-2 py-1 rounded bg-gray-100">
                                                                {(() => {
                                                                    const total = uniqueDetails.reduce(
                                                                        (acc, detail) =>
                                                                            acc + detail.hoaDonCT.soLuong * detail.hoaDonCT.giaBan,
                                                                        0
                                                                    );

                                                                    if (!bestVoucher) return 0;

                                                                    // Tính toán giảm giá theo phần trăm
                                                                    const discountPercentage = bestVoucher.giaTri / 100;
                                                                    const discountAmount = total * discountPercentage;

                                                                    // Kiểm tra và trả về giá trị giảm giá không vượt quá giá trị max
                                                                    const amount = discountAmount > bestVoucher.giaTriMax ? bestVoucher.giaTriMax : discountAmount;

                                                                    // Định dạng số với VNĐ
                                                                    return amount.toLocaleString('vi-VN') + ' VNĐ';
                                                                })()}
                                                            </span>
                                                        </div>
                                                    </div> */}


                                                    {/* Tổng số tiền */}
                                                    <div className="flex justify-between w-full max-w-[400px] mb-2">
                                                        <span className="text-gray-700 font-bold">Tổng số tiền:</span>
                                                        <span className="ml-4 text-red-500 font-bold">
                                                            {(() => {
                                                                const uniqueProductIds = new Set();
                                                                const uniqueDetails = billDetails
                                                                    .filter(
                                                                        (detail) =>
                                                                            detail.hoaDonCT &&
                                                                            detail.hoaDonCT.hoaDon.id ===
                                                                            selectedBill.id &&
                                                                            detail.hoaDonCT.trangThai === 1,
                                                                    )
                                                                    .filter((detail) => {
                                                                        const isUnique = !uniqueProductIds.has(
                                                                            detail.hoaDonCT.id,
                                                                        );
                                                                        if (isUnique) {
                                                                            uniqueProductIds.add(detail.hoaDonCT.id);
                                                                        }
                                                                        return isUnique;
                                                                    });

                                                                // Tính toán tổng tiền hàng với giá đã giảm
                                                                const totalItems = uniqueDetails.reduce(

                                                                    (acc, detail) => {
                                                                        const priceInfo = productPrices[
                                                                            detail.hoaDonCT.id
                                                                        ] || {
                                                                            originalPrice: detail.hoaDonCT.giaBan,
                                                                            discountedPrice: detail.hoaDonCT.giaBan,
                                                                        };
                                                                        return (
                                                                            acc +
                                                                            detail.hoaDonCT.soLuong *
                                                                            priceInfo.discountedPrice
                                                                        );
                                                                    },
                                                                    0,
                                                                );

                                                                // Tính toán giảm giá từ voucher (nếu có)
                                                                const voucherDiscount = bestVoucher
                                                                    ? (() => {
                                                                        const discountPercentage =
                                                                            bestVoucher.giaTri / 100;
                                                                        const discountAmount =
                                                                            totalItems * discountPercentage;

                                                                        // Kiểm tra và trả về giá trị giảm giá không vượt quá giá trị max
                                                                        return discountAmount > bestVoucher.giaTriMax
                                                                            ? bestVoucher.giaTriMax
                                                                            : discountAmount;
                                                                    })()
                                                                    : 0;

                                                                // Tổng số tiền = Tiền hàng - Giảm giá + Phí vận chuyển
                                                                const total =
                                                                    totalItems - voucherDiscount + shippingFee;

                                                                return total.toLocaleString();
                                                            })()}{' '}
                                                            VNĐ
                                                        </span>
                                                    </div>

                                                    {/* Khách thanh toán */}
                                                    <div className="flex justify-between w-full max-w-[400px] mb-2">
                                                        <div className="flex items-center">
                                                            <span className="text-md mr-2">Khách thanh toán:</span>
                                                            <button
                                                                className="hover:bg-gray-400 font-medium py-2 px-4 rounded mr-[75px]"
                                                                onClick={handleOpenModal}
                                                            >
                                                                <AccountBalanceWalletIcon className="h-5 w-5" />
                                                            </button>
                                                            <span className="text-red-500 text-md font-bold">
                                                                {calculateTotalFromTransactions().toLocaleString()}
                                                                {' VNĐ'}
                                                                {/* Chuyển đổi sang số và gọi toLocaleString */}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex justify-end">
                                                    <button
                                                        className="bg-[#2f19ae] text-white px-4 py-2 rounded flex items-center"
                                                        onClick={() => confirmPurchase(selectedBill.id)}
                                                    >
                                                        XÁC NHẬN MUA HÀNG
                                                    </button>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-gray-500 font-semibold text-center py-4 text-[50px] mt-[100px]">
                                            No data found
                                        </div>
                                    );
                                })()}
                            </div>
                        )}
                    </>
                )}
            </div>

            {isModalOpenn && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
                    <div className="bg-white rounded-lg shadow-2xl p-6 w-[450px] relative transform transition-all duration-300 ease-in-out">
                        {/* Nút đóng "X" */}
                        <button
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl font-semibold"
                            onClick={() => setIsModalOpenn(false)}
                        >
                            &times;
                        </button>

                        <div className="text-center mb-5">
                            <h1 className="text-xl font-bold text-gray-800">THANH TOÁN</h1>
                        </div>

                        {/* Tổng tiền hàng */}
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-md text-gray-600">Tổng tiền hàng:</span>
                            <span className="text-red-600 text-lg font-semibold">
                                {(() => {
                                    // Tính toán uniqueDetails ngay tại đây
                                    const uniqueProductIds = new Set();
                                    const uniqueDetails = billDetails
                                        .filter(
                                            (detail) =>
                                                detail.hoaDonCT && detail.hoaDonCT.hoaDon.id === selectedBill.id,
                                        )
                                        .filter((detail) => {
                                            const isUnique = !uniqueProductIds.has(detail.hoaDonCT.id);
                                            if (isUnique) {
                                                uniqueProductIds.add(detail.hoaDonCT.id);
                                            }
                                            return isUnique;
                                        });

                                    const totalItems = uniqueDetails.reduce((acc, detail) => {
                                        const priceInfo = productPrices[detail.hoaDonCT.id] || {
                                            originalPrice: detail.hoaDonCT.giaBan,
                                            discountedPrice: detail.hoaDonCT.giaBan,
                                        };
                                        return acc + detail.hoaDonCT.soLuong * priceInfo.discountedPrice;
                                    }, 0);

                                    // Tính giảm giá từ voucher
                                    const voucherDiscount = bestVoucher
                                        ? (() => {
                                            const discountPercentage = bestVoucher.giaTri / 100;
                                            const discountAmount = totalItems * discountPercentage;

                                            // Kiểm tra và trả về giá trị giảm giá không vượt quá giá trị max
                                            return discountAmount > bestVoucher.giaTriMax
                                                ? bestVoucher.giaTriMax
                                                : discountAmount;
                                        })()
                                        : 0;

                                    // Tổng số tiền = Tiền hàng - Giảm giá + Phí vận chuyển
                                    const total = totalItems - voucherDiscount + shippingFee;

                                    return total.toLocaleString();
                                })()}{' '}
                                VNĐ
                            </span>
                        </div>

                        <div className="flex justify-center space-x-3 mb-5">
                            <button
                                className={`py-2 px-4 rounded-full text-sm ${paymentMethod === 'transfer' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600'
                                    }`}
                                onClick={() => setPaymentMethod('transfer')}
                            >
                                CHUYỂN KHOẢN
                            </button>
                            <button
                                className={`py-2 px-4 rounded-full text-sm ${paymentMethod === 'cash' ? 'bg-pink-200 text-pink-600' : 'bg-gray-100 text-gray-600'
                                    }`}
                                onClick={() => setPaymentMethod('cash')}
                            >
                                TIỀN MẶT
                            </button>
                        </div>

                        <div className="flex justify-between mb-5">
                            {paymentMethod === 'cash' ? (
                                <input
                                    type="text"
                                    placeholder="Tiền khách đưa"
                                    className="border-b border-gray-300 focus:border-gray-500 flex-1 p-2 text-sm outline-none"
                                    value={formatCurrency(customerPayment)}
                                    onChange={handleMoneyChange}
                                />
                            ) : (
                                <>
                                    <input
                                        type="text"
                                        placeholder="Tiền khách đưa"
                                        className="border-b border-gray-300 focus:border-gray-500 flex-1 p-2 text-sm outline-none mr-2"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Mã giao dịch"
                                        className="border-b border-gray-300 focus:border-gray-500 flex-1 p-2 text-sm outline-none ml-2"
                                    />
                                </>
                            )}
                        </div>

                        <div className="overflow-x-auto mb-5">
                            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
                                <thead>
                                    <tr className="bg-blue-700 text-white text-[10px]">
                                        <th className="py-2 px-3 text-left whitespace-nowrap">STT</th>
                                        <th className="py-2 px-3 text-left whitespace-nowrap">Mã giao dịch</th>
                                        <th className="py-2 px-3 text-left whitespace-nowrap">Phương thức</th>
                                        <th className="py-2 px-3 text-left whitespace-nowrap">Số tiền</th>
                                        <th className="py-2 px-3 text-left whitespace-nowrap">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Array.isArray(transactions) && transactions.length > 0 ? (
                                        transactions
                                            .filter((transaction) => transaction.trangThai === 1) // Lọc ra các giao dịch có trạng thái là 1
                                            .map((transaction, index) => (
                                                <tr
                                                    key={transaction.id}
                                                    className="border-b border-gray-200 hover:bg-gray-100 transition duration-200 text-[10px]"
                                                >
                                                    <td className="py-2 px-3 text-left">{index + 1}</td>
                                                    <td className="py-2 px-3 text-left">{transaction.ma}</td>
                                                    <td className="py-2 px-3 text-left">
                                                        {transaction.phuongThucThanhToan}
                                                    </td>
                                                    <td className="py-2 px-3 text-left">
                                                        {(() => {
                                                            // Tính toán uniqueDetails ngay tại đây
                                                            const uniqueProductIds = new Set();
                                                            const uniqueDetails = billDetails
                                                                .filter(
                                                                    (detail) =>
                                                                        detail.hoaDonCT &&
                                                                        detail.hoaDonCT.hoaDon.id === selectedBill.id,
                                                                )
                                                                .filter((detail) => {
                                                                    const isUnique = !uniqueProductIds.has(
                                                                        detail.hoaDonCT.id,
                                                                    );
                                                                    if (isUnique) {
                                                                        uniqueProductIds.add(detail.hoaDonCT.id);
                                                                    }
                                                                    return isUnique;
                                                                });

                                                            const totalItems = uniqueDetails.reduce(
                                                                (acc, detail) =>
                                                                    acc +
                                                                    detail.hoaDonCT.soLuong * detail.hoaDonCT.giaBan,
                                                                0,
                                                            );

                                                            // Tính giảm giá từ voucher
                                                            const voucherDiscount = bestVoucher
                                                                ? (totalItems * bestVoucher.giaTri) / 100
                                                                : 0;

                                                            // Tổng số tiền = Tiền hàng - Giảm giá + Phí vận chuyển
                                                            const total = totalItems - voucherDiscount + shippingFee;

                                                            return total.toLocaleString();
                                                        })()}{' '}
                                                        VND
                                                    </td>
                                                    <td
                                                        className="py-2 px-3 text-left text-red-500 cursor-pointer hover:underline"
                                                        onClick={() => handleDeleteTransaction(transaction.id)}
                                                    >
                                                        Xóa
                                                    </td>
                                                </tr>
                                            ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="py-4 text-center text-gray-500">
                                                Không có giao dịch nào.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex justify-between items-center mb-5">
                            <span className="text-md text-gray-600">Tiền thiếu</span>
                            <span className="text-red-600 text-lg font-semibold">
                                {(() => {
                                    const uniqueProductIds = new Set();
                                    const uniqueDetails = billDetails
                                        .filter(
                                            (detail) =>
                                                detail.hoaDonCT && detail.hoaDonCT.hoaDon.id === selectedBill.id,
                                        )
                                        .filter((detail) => {
                                            const isUnique = !uniqueProductIds.has(detail.hoaDonCT.id);
                                            if (isUnique) {
                                                uniqueProductIds.add(detail.hoaDonCT.id);
                                            }
                                            return isUnique;
                                        });

                                    const totalItems = uniqueDetails.reduce((acc, detail) => {
                                        const priceInfo = productPrices[detail.hoaDonCT.id] || {
                                            originalPrice: detail.hoaDonCT.giaBan,
                                            discountedPrice: detail.hoaDonCT.giaBan,
                                        };
                                        return acc + detail.hoaDonCT.soLuong * priceInfo.discountedPrice;
                                    }, 0);

                                    // Tính giảm giá từ voucher
                                    const voucherDiscount = bestVoucher
                                        ? (() => {
                                            const discountPercentage = bestVoucher.giaTri / 100;
                                            const discountAmount = totalItems * discountPercentage;

                                            // Kiểm tra và trả về giá trị giảm giá không vượt quá giá trị max
                                            return discountAmount > bestVoucher.giaTriMax
                                                ? bestVoucher.giaTriMax
                                                : discountAmount;
                                        })()
                                        : 0;

                                    const total = totalItems - voucherDiscount + shippingFee;

                                    // Tính tiền thiếu, cho phép giá trị âm
                                    const remainingAmount = total - parseFloat(customerPayment || 0);

                                    return remainingAmount.toLocaleString(); // Hiển thị cả giá trị âm
                                })()}{' '}
                                VNĐ
                            </span>
                        </div>

                        <div className="flex justify-center">
                            <button
                                className={`bg-green-600 text-white py-2 px-6 rounded-full text-md shadow-md hover:bg-green-500 transition duration-200`}
                                onClick={() => {
                                    // Tính toán tổng tiền
                                    const uniqueProductIds = new Set();
                                    const uniqueDetails = billDetails
                                        .filter(
                                            (detail) =>
                                                detail.hoaDonCT && detail.hoaDonCT.hoaDon.id === selectedBill.id,
                                        )
                                        .filter((detail) => {
                                            const isUnique = !uniqueProductIds.has(detail.hoaDonCT.id);
                                            if (isUnique) {
                                                uniqueProductIds.add(detail.hoaDonCT.id);
                                            }
                                            return isUnique;
                                        });

                                    const totalItems = uniqueDetails.reduce((acc, detail) => {
                                        const priceInfo = productPrices[detail.hoaDonCT.id] || {
                                            originalPrice: detail.hoaDonCT.giaBan,
                                            discountedPrice: detail.hoaDonCT.giaBan,
                                        };
                                        return acc + detail.hoaDonCT.soLuong * priceInfo.discountedPrice;
                                    }, 0);

                                    const voucherDiscount = bestVoucher ? (totalItems * bestVoucher.giaTri) / 100 : 0;
                                    const totalAmount = totalItems - voucherDiscount + shippingFee;

                                    // Kiểm tra điều kiện thanh toán
                                    const payment = parseFloat(customerPayment) || 0;
                                    if (payment < totalAmount) {
                                        swal(
                                            'Thất bại!',
                                            'Số tiền khách đưa phải lớn hơn hoặc bằng tổng tiền hàng!',
                                            'warning',
                                        );
                                    } else {
                                        handleAddTransaction(); // Gọi hàm thêm giao dịch nếu hợp lệ
                                    }
                                }}
                            >
                                XÁC NHẬN
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Custom Modal for Products */}
            {showProductModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-md p-4 w-[1200px] max-h-[550px] overflow-y-auto relative">
                        <h2 className="text-xl font-bold text-center my-4">Thông tin sản phẩm</h2>

                        {/* Nút đóng nằm ở góc phải */}
                        <button
                            className="absolute top-4 right-4 text-blue-500 text-2xl"
                            onClick={handleCloseProductModal}
                        >
                            &times;
                        </button>

                        {/* Search and Filter Section */}
                        <div className="mb-4">
                            <input
                                type="text"
                                placeholder="Tìm tên sản phẩm..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="border border-gray-300 rounded p-2 w-full"
                            />
                        </div>
                        <div className="flex space-x-4 mb-4">
                            <select
                                value={brandFilter}
                                onChange={(e) => setBrandFilter(e.target.value)}
                                className="border border-gray-300 rounded p-2"
                            >
                                <option value="">Tất cả thương hiệu</option>
                                <option value="Yonex">Yonex</option>
                                <option value="Lining">Lining</option>
                                <option value="Victor">Victor</option>
                                <option value="Mizuno">Mizuno</option>
                                <option value="Adidas">Adidas</option>
                            </select>

                            <select
                                value={colorFilter}
                                onChange={(e) => setColorFilter(e.target.value)}
                                className="border border-gray-300 rounded p-2"
                            >
                                <option value="">Tất cả màu sắc</option>
                                <option value="Đỏ">Đỏ</option>
                                <option value="Xanh">Xanh</option>
                                <option value="Trắng">Trắng</option>
                            </select>

                            <select
                                value={weightFilter}
                                onChange={(e) => setWeightFilter(e.target.value)}
                                className="border border-gray-300 rounded p-2"
                            >
                                <option value="">Tất cả trọng lượng</option>
                                <option value="2U">2U</option>
                                <option value="3U">3U</option>
                                <option value="4U">4U</option>
                                <option value="5U">5U</option>
                                <option value="6U">6U</option>
                            </select>

                            <select
                                value={priceFilter}
                                onChange={(e) => setPriceFilter(e.target.value)}
                                className="border border-gray-300 rounded p-2"
                            >
                                <option value="">Tất cả giá</option>
                                <option value="1000000">Dưới 1 triệu</option>
                                <option value="3000000">Dưới 3 triệu</option>
                                <option value="5000000">Dưới 5 triệu</option>
                            </select>
                        </div>

                        {/* Products List */}
                        <div className="grid grid-cols-4 gap-4">
                            {filteredProducts.map((product) => {
                                const promotion = productPromotions[product.id];
                                return (
                                    <div key={product.id} className="border rounded p-2 relative">
                                        {promotion && (
                                            <div className="absolute text-white px-2 py-1 rounded-full text-xs z-10">
                                                <p className="text-green-600 font-semibold">
                                                    -{Math.round((1 - promotion.giaKhuyenMai / product.donGia) * 100)}%
                                                </p>
                                            </div>
                                        )}
                                        <img
                                            src={product.hinhAnhUrls[0]}
                                            alt={product.sanPhamTen}
                                            className="w-full h-[250px] object-cover mb-2"
                                        />
                                        <h3 className="font-semibold">
                                            {product.sanPhamTen} [{product.trongLuongTen}]
                                        </h3>
                                        {promotion ? (
                                            <div className="flex items-center space-x-2">
                                                <p className="text-red-500 font-bold">
                                                    {promotion.giaKhuyenMai.toLocaleString()} VND
                                                </p>
                                                <p className="text-gray-500 line-through">
                                                    {product.donGia.toLocaleString()} VND
                                                </p>
                                            </div>
                                        ) : (
                                            <p className="text-gray-500">{product.donGia.toLocaleString()} VND</p>
                                        )}
                                        <p className="text-gray-500">Số lượng: {product.soLuong}</p>
                                        <button
                                            className="absolute top-2 right-2 text-blue-500 hover:text-blue-700"
                                            onClick={() => handleQuantityModal(product)}
                                        >
                                            <AddIcon />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* Custom Modal for Quantity */}
            {showQuantityModal && selectedProduct && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-md p-4 w-[400px]">
                        <h2 className="text-xl font-bold text-center my-4">Chọn Số Lượng</h2>
                        <div className="mb-4">
                            <p className="font-semibold">{selectedProduct.sanPhamTen}</p>
                            <p className="text-gray-500">Giá: {selectedProduct.donGia.toLocaleString()} VND</p>
                            <p className="text-gray-500">Số lượng hiện có: {selectedProduct.soLuong}</p>
                        </div>
                        <div className="mb-4">
                            <label className="block mb-1">Nhập số lượng:</label>
                            <input
                                type="number"
                                min="1"
                                value={quantity}
                                max={selectedProduct.soLuong}
                                className="border border-gray-300 rounded p-2 w-full"
                                onChange={(e) => setQuantity(e.target.value)}
                            />
                        </div>
                        <div className="flex justify-center">
                            <button
                                className="bg-blue-500 text-white py-2 px-4 rounded"
                                onClick={() => {
                                    // Kiểm tra số lượng
                                    if (quantity > selectedProduct.soLuong) {
                                        swal('Thất bại!', 'Số lượng trong kho không đủ!', 'warning');
                                    } else {
                                        handleAddBillDetail({
                                            sanPhamCTId: selectedProduct.id,
                                            hoaDonId: selectedBill.id,
                                            soLuong: quantity,
                                            giaBan: selectedProduct.donGia,
                                            trangThai: '1',
                                        });
                                    }
                                }}
                            >
                                Thêm vào hóa đơn
                            </button>
                            <button
                                className="bg-red-500 text-white py-2 px-4 rounded ml-2"
                                onClick={() => {
                                    setShowQuantityModal(false);
                                    setSelectedProduct(null); // Reset sản phẩm đã chọn
                                }}
                            >
                                Hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default OfflineSale;
