import React from 'react';
import CartItem from './CartItem';
import { Button } from '@mui/material';

const Cart = () => {
    return (
        <div className="mt-10">
            <div className="lg:grid grid-cols-3 lg:px-16 relative">
                <div className="lg:col-span-2 lg:px-5 bg-white">
                    <div className=" space-y-3">
                        <CartItem showButton={true} />
                    </div>
                </div>
                <div className="px-5 sticky top-0 h-[100vh] mt-5 lg:mt-0 ">
                    <div className="border p-5 bg-white shadow-lg rounded-md">
                        <p className="font-bold opacity-60 pb-4">PRICE DETAILS</p>
                        <hr />

                        <div className="space-y-3 font-semibold">
                            <div className="flex justify-between pt-3 text-black ">
                                <span>Price 1 Item</span>
                                <span>1.308.000 ₫</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Discount</span>
                                <span className="text-green-700">-218</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Delivery Charges</span>
                                <span className="text-green-700">Free</span>
                            </div>
                            <hr />
                            <div className="flex justify-between font-bold text-lg">
                                <span>Total Amount</span>
                                <span className="text-green-700">1.090.000 ₫</span>
                            </div>
                        </div>

                        <Button
                            variant="contained"
                            type="submit"
                            sx={{
                                padding: '.8rem 2rem',
                                marginTop: '2rem',
                                width: '100%',
                                backgroundColor: '#2f19ae',
                                '&:hover': { backgroundColor: '#271693' }, // Màu khi hover (có thể điều chỉnh)
                            }}
                        >
                            Check Out
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
