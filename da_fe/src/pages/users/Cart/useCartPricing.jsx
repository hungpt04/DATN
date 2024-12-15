// hooks/useCartPricing.js
import { useState, useEffect } from 'react';
import axios from 'axios';

export const useCartPricing = (carts) => {
    const [totalPrice, setTotalPrice] = useState(0);
    const [cartItemsWithPromotion, setCartItemsWithPromotion] = useState([]);

    useEffect(() => {
        const fetchPromotionsAndCalculateTotal = async () => {
            if (carts.length > 0) {
                const cartItemsWithPromotionData = await Promise.all(
                    carts.map(async (cart) => {
                        try {
                            const response = await axios.get(
                                `http://localhost:8080/api/san-pham-khuyen-mai/san-pham-ct/${cart.gioHang.sanPhamCT.id}`,
                            );

                            // Thêm thông tin khuyến mãi vào cart
                            return {
                                ...cart,
                                promotion: response.data.length > 0 ? response.data[0] : null,
                            };
                        } catch (error) {
                            console.error('Error fetching promotion:', error);
                            return { ...cart, promotion: null };
                        }
                    }),
                );

                // Tính tổng tiền
                const total = cartItemsWithPromotionData.reduce((sum, cart) => {
                    const price = cart.promotion
                        ? cart.promotion.giaKhuyenMai * cart.gioHang.soLuong
                        : cart.gioHang.sanPhamCT.donGia * cart.gioHang.soLuong;
                    return sum + price;
                }, 0);

                setCartItemsWithPromotion(cartItemsWithPromotionData);
                setTotalPrice(total);
            }
        };

        fetchPromotionsAndCalculateTotal();
    }, [carts]);

    return { totalPrice, cartItemsWithPromotion };
};
