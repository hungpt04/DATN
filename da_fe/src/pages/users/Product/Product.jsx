'use client';
import ProductCard from './ProductCard';
import { useState, useEffect } from 'react';
import axios from 'axios';

import {
    Dialog,
    DialogBackdrop,
    DialogPanel,
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
} from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { ChevronDownIcon, FunnelIcon, MinusIcon, PlusIcon, Squares2X2Icon } from '@heroicons/react/20/solid';

const sortOptions = [
    { name: 'Phổ biến nhất', href: '#', current: true },
    { name: 'Mới nhất', href: '#', current: false },
    { name: 'Giá từ cao đến thấp', href: '#', current: false },
    { name: 'Giá từ thấp lên cao', href: '#', current: false },
];

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

export default function Product() {
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const [brands, setBrands] = useState([]);
    const [balances, setBalances] = useState([]);
    const [colors, setColors] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [stiffs, setStiffs] = useState([]);
    const [weights, setWeights] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true); // Thêm state loading

    const loadBrands = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/thuong-hieu');
            setBrands(response.data);
        } catch (error) {
            console.error('Failed to fetch brands', error);
        }
    };

    const loadColors = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/mau-sac');
            setColors(response.data);
        } catch (error) {
            console.error('Failed to fetch colors', error);
        }
    };

    const loadStiffs = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/do-cung');
            setStiffs(response.data);
        } catch (error) {
            console.error('Failed to fetch stiffs', error);
        }
    };

    const loadWeights = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/trong-luong');
            setWeights(response.data);
        } catch (error) {
            console.error('Failed to fetch weights', error);
        }
    };

    const loadMaterials = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/chat-lieu');
            setMaterials(response.data);
        } catch (error) {
            console.error('Failed to fetch materials', error);
        }
    };

    const loadBalances = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/diem-can-bang');
            setBalances(response.data);
        } catch (error) {
            console.error('Failed to fetch balances', error);
        }
    };

    const loadProducts = async () => {
        try {
            setLoading(true); // Bắt đầu loading
            const response = await axios.get('http://localhost:8080/api/san-pham-ct/with-images');
            // Group products by name and take first variant of each product
            const uniqueProducts = Object.values(
                response.data.reduce((acc, product) => {
                    if (!acc[product.sanPhamTen]) {
                        acc[product.sanPhamTen] = product;
                    }
                    return acc;
                }, {}),
            );
            setProducts(uniqueProducts);
        } catch (error) {
            console.error('Failed to fetch Products', error);
        } finally {
            setLoading(false); // Kết thúc loading
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                await Promise.all([
                    loadBalances(),
                    loadBrands(),
                    loadColors(),
                    loadMaterials(),
                    loadStiffs(),
                    loadWeights(),
                    loadProducts(),
                ]);
            } catch (error) {
                console.error('Error loading data:', error);
            }
        };

        fetchData();
    }, []);

    const filters = [
        {
            id: 'thuonghieu',
            name: 'Thương hiệu',
            options: brands.map((brand) => ({
                value: brand.ten,
                label: brand.ten,
            })),
        },
        {
            id: 'mausac',
            name: 'Màu sắc',
            options: colors.map((color) => ({
                value: color.ten,
                label: color.ten,
            })),
        },
        {
            id: 'trongluong',
            name: 'Trọng lượng',
            options: weights.map((weight) => ({
                value: weight.ten,
                label: weight.ten,
            })),
        },
        {
            id: 'chatlieu',
            name: 'Chất liệu',
            options: materials.map((material) => ({
                value: material.ten,
                label: material.ten,
            })),
        },
        {
            id: 'diemcanbang',
            name: 'Điểm cân bằng',
            options: balances.map((balance) => ({
                value: balance.ten,
                label: balance.ten,
            })),
        },
        {
            id: 'docung',
            name: 'Độ cứng',
            options: stiffs.map((stiff) => ({
                value: stiff.ten,
                label: stiff.ten,
            })),
        },
    ];

    return (
        <div className="bg-white">
            <div>
                {/* Mobile filter dialog */}
                <Dialog open={mobileFiltersOpen} onClose={setMobileFiltersOpen} className="relative z-40 lg:hidden">
                    <DialogBackdrop
                        transition
                        className="fixed inset-0 bg-black bg-opacity-25 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
                    />

                    <div className="fixed inset-0 z-40 flex">
                        <DialogPanel
                            transition
                            className="relative ml-auto flex h-full w-full max-w-xs transform flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl transition duration-300 ease-in-out data-[closed]:translate-x-full"
                        >
                            <div className="flex items-center justify-between px-4">
                                <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                                <button
                                    type="button"
                                    onClick={() => setMobileFiltersOpen(false)}
                                    className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
                                >
                                    <span className="sr-only">Close menu</span>
                                    <XMarkIcon aria-hidden="true" className="h-6 w-6" />
                                </button>
                            </div>

                            {/* Filters */}
                            <form className="mt-4 border-t border-gray-200">
                                {filters.map((section) => (
                                    <Disclosure
                                        key={section.id}
                                        as="div"
                                        className="border-t border-gray-200 px-4 py-6"
                                    >
                                        <h3 className="-mx-2 -my-3 flow-root">
                                            <DisclosureButton className="group flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
                                                <span className="font-medium text-gray-900">{section.ten}</span>
                                                <span className="ml-6 flex items-center">
                                                    <PlusIcon
                                                        aria-hidden="true"
                                                        className="h-5 w-5 group-data-[open]:hidden"
                                                    />
                                                    <MinusIcon
                                                        aria-hidden="true"
                                                        className="h-5 w-5 [.group:not([data-open])_&]:hidden"
                                                    />
                                                </span>
                                            </DisclosureButton>
                                        </h3>
                                        <DisclosurePanel className="pt-6">
                                            <div className="space-y-6">
                                                {section.options.map((option, optionIdx) => (
                                                    <div key={option.value} className="flex items-center">
                                                        <input
                                                            defaultValue={option.value}
                                                            defaultChecked={option.checked}
                                                            id={`filter-mobile-${section.id}-${optionIdx}`}
                                                            name={`${section.id}[]`}
                                                            type="checkbox"
                                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                        />
                                                        <label
                                                            htmlFor={`filter-mobile-${section.id}-${optionIdx}`}
                                                            className="ml-3 min-w-0 flex-1 text-gray-500"
                                                        >
                                                            {option.label}
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                        </DisclosurePanel>
                                    </Disclosure>
                                ))}
                            </form>
                        </DialogPanel>
                    </div>
                </Dialog>

                <main className="mx-auto px-4 sm:px-6 lg:px-20">
                    <div className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-24">
                        <h1 className="text-4xl font-bold tracking-tight text-gray-900">Sản phẩm mới</h1>

                        <div className="flex items-center">
                            <Menu as="div" className="relative inline-block text-left">
                                <div>
                                    <MenuButton className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                                        Sắp xếp
                                        <ChevronDownIcon
                                            aria-hidden="true"
                                            className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                                        />
                                    </MenuButton>
                                </div>

                                <MenuItems
                                    transition
                                    className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                                >
                                    <div className="py-1">
                                        {sortOptions.map((option) => (
                                            <MenuItem key={option.name}>
                                                <a
                                                    href={option.href}
                                                    className={classNames(
                                                        option.current ? 'font-medium text-gray-900' : 'text-gray-500',
                                                        'block px-4 py-2 text-sm data-[focus]:bg-gray-100',
                                                    )}
                                                >
                                                    {option.name}
                                                </a>
                                            </MenuItem>
                                        ))}
                                    </div>
                                </MenuItems>
                            </Menu>

                            <button type="button" className="-m-2 ml-5 p-2 text-gray-400 hover:text-gray-500 sm:ml-7">
                                <span className="sr-only">View grid</span>
                                <Squares2X2Icon aria-hidden="true" className="h-5 w-5" />
                            </button>
                            <button
                                type="button"
                                onClick={() => setMobileFiltersOpen(true)}
                                className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
                            >
                                <span className="sr-only">Filters</span>
                                <FunnelIcon aria-hidden="true" className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    <section aria-labelledby="products-heading" className="pb-24 pt-6">
                        <h2 id="products-heading" className="sr-only">
                            Products
                        </h2>

                        <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-5">
                            {/* Filters */}
                            <form className="hidden lg:block">
                                {filters.map((section) => (
                                    <Disclosure key={section.id} as="div" className="border-b border-gray-200 py-6">
                                        <h3 className="-my-3 flow-root">
                                            <DisclosureButton className="group flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                                                <span className="font-medium text-gray-900">{section.name}</span>
                                                <span className="ml-6 flex items-center">
                                                    <PlusIcon
                                                        aria-hidden="true"
                                                        className="h-5 w-5 group-data-[open]:hidden"
                                                    />
                                                    <MinusIcon
                                                        aria-hidden="true"
                                                        className="h-5 w-5 [.group:not([data-open])_&]:hidden"
                                                    />
                                                </span>
                                            </DisclosureButton>
                                        </h3>
                                        <DisclosurePanel className="pt-6">
                                            <div className="space-y-4">
                                                {section.options.map((option, optionIdx) => (
                                                    <div key={option.value} className="flex items-center">
                                                        <input
                                                            defaultValue={option.value}
                                                            defaultChecked={option.checked}
                                                            id={`filter-${section.id}-${optionIdx}`}
                                                            name={`${section.id}[]`}
                                                            type="checkbox"
                                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                        />
                                                        <label
                                                            htmlFor={`filter-${section.id}-${optionIdx}`}
                                                            className="ml-3 text-sm text-gray-600"
                                                        >
                                                            {option.label}
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                        </DisclosurePanel>
                                    </Disclosure>
                                ))}
                            </form>

                            {/* Product grid */}
                            <div className="lg:col-span-4 w-full">
                                <div className="flex flex-wrap justify-center bg-white py-5">
                                    {loading ? (
                                        <div>Loading...</div>
                                    ) : (
                                        products.map((product) => <ProductCard key={product.id} product={product} />)
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
}
