// import React from 'react';

// const AddressCard = ({ address }) => {
//     return (
//         <div>
//             <div className="space-y-3">
//                 <p className="font-semibold">{`${address?.ten} `}</p>
//                 <p>{`${address?.diaChiCuThe},${address?.idXa}, ${address?.idHuyen}, ${address?.idTinh} `}</p>
//                 <div className="space-y-1">
//                     <p className="font-semibold">Số Điện Thoại</p>
//                     <p>{address?.sdt}</p>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default AddressCard;

import React from 'react';

const AddressCard = ({ address }) => {
    return (
        <div>
            <div className="space-y-1">
                <p className="font-semibold">{`${address?.ten}`}
                    <span className='border-gray-500 text-sm border-l mx-2'></span>
                    <span className='text-gray-600 font-normal text-sm'>{`${address?.sdt}`}</span></p>
                <p>{`${address?.diaChiCuThe}`}</p>
                <p>{`${address?.idXa}, ${address?.idHuyen}, ${address?.idTinh}`}</p>
            </div>
        </div>
    );
};

export default AddressCard;