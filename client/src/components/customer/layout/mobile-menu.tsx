import { routePath } from "@/constants/routes";
import Link from "next/link";
import { BiSolidPhoneCall } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import { FaRegHeart } from "react-icons/fa";
import { IoCartOutline, IoLocationOutline } from "react-icons/io5";
import DefaultButton from "../UI/button/default-button";
import { Dropdown, MenuProps } from "antd";
import { RiLoginBoxLine } from "react-icons/ri";
import { UserOutlined } from "@ant-design/icons";
import { MdArrowDropDown, MdArrowDropUp } from "react-icons/md";
import { useState } from "react";
import { ProductMenu } from "./product-menu";

const profileItems: MenuProps["items"] = [
  {
    label: <Link href={routePath.signIn}>Đăng nhập</Link>,
    key: routePath.signIn,
    icon: <RiLoginBoxLine className="!text-lg" />,
  },
  {
    label: <Link href={routePath.signUp}>Đăng ký</Link>,
    key: routePath.signUp,
    icon: <UserOutlined className="!text-lg" />,
  },
];

const menuItems = [
  {
    path: routePath.customer.home,
    label: "Trang chủ",
  },
  {
    path: routePath.customer.products(),
    label: "Sản phẩm",
    key: "product",
  },
  {
    path: routePath.customer.products(),
    label: "Sản phẩm khuyến mãi",
  },
  {
    path: routePath.customer.news,
    label: "Tin tức",
  },
  {
    path: routePath.customer.introduce,
    label: "Giới  thiệu",
  },
  {
    path: routePath.customer.contact,
    label: "Liên hệ",
  },
  {
    path: routePath.customer.membershipPolicy,
    label: "Chính sách thành viên",
  },
];

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const [isProductMenuOpen, setIsProductMenuOpen] = useState(false);

  return (
    <div
      className={`fixed inset-0 bg-white z-50 transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex flex-col h-full overflow-y-auto">
        <div className="flex justify-end p-4">
          <button className="text-2xl" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="flex flex-col gap-4 p-4">
          <DefaultButton
            suffix={<BiSolidPhoneCall className="text-2xl" />}
            className="!font-semibold"
          >
            0975209429
          </DefaultButton>
          <Dropdown menu={{ items: profileItems }} trigger={["click"]}>
            <DefaultButton
              suffix={<CgProfile className="text-2xl" />}
              className="!font-semibold"
            >
              Tài khoản
            </DefaultButton>
          </Dropdown>
          <DefaultButton
            suffix={<IoLocationOutline className="text-2xl" />}
            className="!font-semibold"
          >
            Địa chỉ
          </DefaultButton>
          <DefaultButton
            suffix={<FaRegHeart className="text-2xl" />}
            className="!font-semibold"
          >
            Yêu thích
          </DefaultButton>
          <DefaultButton
            suffix={<IoCartOutline className="text-2xl" />}
            className="!font-semibold"
          >
            Giỏ hàng
          </DefaultButton>
        </div>
        <nav className="mt-4">
          <ul className="flex flex-col">
            {menuItems.map((item) => (
              <li key={item.label} className="border-b border-gray-200">
                {item.key === "product" ? (
                  <div>
                    <button
                      className="flex justify-between items-center w-full p-4 text-left"
                      onClick={() => setIsProductMenuOpen(!isProductMenuOpen)}
                    >
                      {item.label}
                      <span className="text-lg">
                        {isProductMenuOpen ? (
                          <MdArrowDropUp />
                        ) : (
                          <MdArrowDropDown />
                        )}
                      </span>
                    </button>
                    {isProductMenuOpen && <ProductMenu />}
                  </div>
                ) : (
                  <Link
                    href={item.path}
                    className="block p-4 hover:bg-gray-100"
                    onClick={onClose}
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
