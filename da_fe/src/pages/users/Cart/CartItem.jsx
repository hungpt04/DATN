import React from 'react';
import { Button } from '@mui/material';
import { IconButton } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

const CartItem = ({ showButton }) => {
    return (
        <div className="p-5 shadow-lg border rounded-md">
            <div className="flex items-center">
                <div className="w-[5rem] h-[5rem] lg:w-[9rem] lg:h-[9rem] ">
                    <img
                        className="w-full h-full object-cover object-top"
                        src="https://cdn.shopvnb.com/uploads/gallery/vot-cau-long-yonex-voltric-5-den-xanh-chinh-hang-khong-bao-hanh-1.webp"
                        alt=""
                    />
                </div>
                <div className="ml-5 space-y-1">
                    <p className="font-semibold">Vợt cầu lông Yonex Voltric 5</p>
                    <p className="opacity-70">Size: 3U,White</p>
                    <p className="opacity-70 mt-2">Seller: Yonex</p>
                    <div className="flex space-x-2 items-center pt-3">
                        <p className="font-semibold text-lg">1.090.000 ₫</p>
                        <p className="opacity-50  line-through">1.308.000 ₫</p>
                        <p className="text-green-600 font-semibold">3% off</p>
                    </div>
                </div>
            </div>
            {showButton && (
                <div className="lg:flex items-center lg:space-x-10 pt-4">
                    <div className="flex items-center space-x-2 ">
                        {/* IconButton with custom color */}
                        <IconButton sx={{ color: '#2f19ae' }} aria-label="remove">
                            <RemoveCircleOutlineIcon />
                        </IconButton>

                        <span className="py-1 px-7 border rounded-sm">7651</span>

                        {/* IconButton with custom color */}
                        <IconButton sx={{ color: '#2f19ae' }} aria-label="add">
                            <AddCircleOutlineIcon />
                        </IconButton>
                    </div>
                    <div className="flex text-sm lg:text-base mt-5 lg:mt-0">
                        {/* Remove button with custom color */}
                        <Button variant="text" sx={{ color: '#2f19ae' }}>
                            Remove
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartItem;
