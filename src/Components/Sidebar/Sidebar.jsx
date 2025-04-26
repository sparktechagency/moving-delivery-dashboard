import { useState } from "react";
import { AiOutlineSetting } from "react-icons/ai";
import { FiUser, FiLogOut } from "react-icons/fi";
import { BiChevronDown } from "react-icons/bi";
import { Link } from "react-router-dom";
import { MdDashboard, MdPrivacyTip } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { RiMoneyDollarCircleLine, RiTerminalWindowLine } from "react-icons/ri";
import brandlogo from "../../assets/image/moving-logo.png";
import { PiUsers } from "react-icons/pi";
import { IoNewspaper } from "react-icons/io5";
import { GrUserSettings } from "react-icons/gr";
import { CiUser } from "react-icons/ci";


const Sidebar = ({ closeDrawer }) => {
  const [active, setActive] = useState("Dashboard");
  const [openDropdown, setOpenDropdown] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const menuItems = [
    {
      icon: <MdDashboard className="w-5 h-5" />,
      label: "Dashboard",
      Link: "/",
    },
    {
      icon: <PiUsers  className="w-5 h-5" />,
      label: "User Management",
      Link: "/user-management",
    },
    {
      icon: <IoNewspaper className="w-5 h-5" />,
      label: "User Request",
      Link: "/user-request",
    },
    {
      icon: <RiMoneyDollarCircleLine className="w-5 h-5" />,
      label: "Earnings",
      Link: "/earnings",
    },
    {
      icon: <GrUserSettings  className="w-5 h-5" />,
      label: "Settings",
      isDropdown: true,
      subItems: [
        {
          icon: <FaEdit className="w-5 h-5" />,
          label: "About Us",
          Link: "/settings/about-us",
        },
        {
          icon: <MdPrivacyTip className="w-5 h-5" />,
          label: "Privacy Policy",
          Link: "/settings/privacy-policy",
        },

        {
          icon: <RiTerminalWindowLine className="w-5 h-5" />,
          label: "Terms & Conditions",
          Link: "/settings/terms-condition",
        },
        {
          icon: <CiUser className="w-5 h-5" />,
          label: "edit-profile",
          Link: "/profile",
        },
      ],
    },
  ];

  // Filter the menu items based on the search term
  const filterMenuItems = (items) => {
    return items.filter((item) => {
      // If the item has subItems, filter them as well
      if (item.isDropdown && item.subItems) {
        const filteredSubItems = item.subItems.filter((subItem) =>
          subItem.label.toLowerCase().includes(searchTerm.toLowerCase())
        );
        // If a subItem matches the search term, we include the parent dropdown
        if (filteredSubItems.length > 0) {
          item.subItems = filteredSubItems;
          return true;
        }
      }

      // Filter the label of the item
      return item.label.toLowerCase().includes(searchTerm.toLowerCase());
    });
  };

  const filteredItems = filterMenuItems(menuItems);

  return (
    <div className="flex flex-col h-full p-3 bg-white w-72">
        <div className="mx-auto">
            <img src={brandlogo} alt="logo" className="" />
          </div>
      <div className="relative pt-8 mb-4 ml-6">
      </div>
      <div className="flex-1 overflow-y-auto max-h-[calc(100vh-150px)]">
        {filteredItems.map((item) => (
          <div key={item.label}>
            <div
              className={`flex justify-between bg-[#3A9CB9] items-center px-5 py-2 my-5 cursor-pointer transition-all rounded-lg ${
                active === item.label
                  ? "bg-[#C9E6ED] text-black font-semibold"
                  : "text-white"
              }`}
              onClick={() =>
                item.isDropdown
                  ? setOpenDropdown(
                      openDropdown === item.label ? "" : item.label
                    )
                  : setActive(item.label)
              }
            >
              <Link to={item.Link} className="flex items-center w-full gap-3">
                {item.icon}
                <p>{item.label}</p>
                {item.isDropdown && (
                  <BiChevronDown
                    className={`${
                      openDropdown === item.label ? "rotate-180" : ""
                    }`}
                  />
                )}
              </Link>
            </div>
            {item.isDropdown && openDropdown === item.label && (
              <div className="flex flex-col pl-8">
                {item.subItems.map((subItem) => (
                  <Link to={subItem.Link} key={subItem.label}>
                    <div
                      className={`py-2 px-5 cursor-pointer my-5 bg-[#3A9CB9] transition-all rounded-lg ${
                        active === subItem.label
                          ? "bg-[#C9E6ED] text-black font-semibold"
                          : "text-white"
                      }`}
                      onClick={() => setActive(subItem.label)}
                    >
                      <p className="flex items-center gap-2">
                        {subItem.icon} {subItem.label}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <Link to="/sign-in">
        <div className="bg-[#52B5D1] text-white w-full py-3 flex justify-center items-center cursor-pointer rounded-lg mt-4">
          <FiLogOut className="text-xl" />
          <p className="ml-2">Log out</p>
        </div>
      </Link>
    </div>
  );
};

export default Sidebar;
