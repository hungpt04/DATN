import React from 'react';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export const SidebarData = [
    {
        title: "Thống kê",
        icon: <AssessmentIcon />,
        link: "/thong-ke"
    },
    {
        title: "Bán hàng tại quầy",
        icon: <ReceiptIcon />,
        link: "/ban-hang-tai-quay"
    },
    {
        title: "Quản lý đơn hàng",
        icon: <ShoppingCartIcon />,
        link: "/quan-ly-don-hang"
    },
    {
        title: "Quản lý sản phẩm",
        icon: <Inventory2Icon />,
        link: "/quan-ly-san-pham",
        subItems: [
            { title: "Thương hiệu", link: "/quan-ly-san-pham/thuong-hieu" },
            { title: "Quấn cán", link: "/quan-ly-san-pham/quan-can" },
            { title: "Cước", link: "/quan-ly-san-pham/cuoc" },
            { title: "Trọng lượng", link: "/quan-ly-san-pham/trong-luong" },
            { title: "Điểm cân bằng", link: "/quan-ly-san-pham/diem-can-bang" }
        ]
    },
    {
        title: "Trả hàng",
        icon: <AssignmentReturnIcon />,
        link: "/tra-hang"
    },
    {
        title: "Giảm giá",
        icon: <TrendingDownIcon />,
        link: "/giam-gia"
    },
    {
        title: "Tài khoản",
        icon: <AccountCircleIcon />,
        link: "/tai-khoan"
    }
];
