import React from 'react';

const AddressCard = ({ address }) => {
    return (
        <div>
            <div className="space-y-3">
                <p className="font-semibold">{`${address?.ten} `}</p>
                <p>{`${address?.diaChiCuThe},${address?.idXa}, ${address?.idHuyen}, ${address?.idTinh} `}</p>
                <div className="space-y-1">
                    <p className="font-semibold">Số Điện Thoại</p>
                    <p>{address?.sdt}</p>
                </div>
            </div>
        </div>
    );
};

export default AddressCard;
