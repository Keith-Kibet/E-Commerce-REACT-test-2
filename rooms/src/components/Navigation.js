import React, { useState } from "react";
import {
  MenuIcon,
  XIcon,
  SearchIcon,
  HomeIcon,
  UserIcon,
  ShoppingCartIcon,
} from "@heroicons/react/outline";

import { NavLink } from "react-router-dom";
import useStore from "../store";

const Navigation = ({ activeLink, setActiveLink, isWriter }) => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const { cartTotals } = useStore();

  return (
    <>
      {/* Mobile Navigation Bar */}
      <div className="bg-blue-500 p-4 text-white flex justify-start md:hidden">
        <button onClick={() => setIsNavOpen(!isNavOpen)} className="z-30">
          {isNavOpen ? (
            <XIcon className="h-6 w-6" />
          ) : (
            <MenuIcon className="h-6 w-6" />
          )}
        </button>
        <h1 className="text-xl font-bold px-4">Shoplify</h1>
        <div className="flex-grow flex justify-center">
          <div className="relative w-full max-w-xs">
            <input
              type="search"
              name="q"
              className="py-2 text-sm text-black bg-gray-100 rounded-md pl-2 pr-8 w-full focus:bg-white focus:outline-none"
              placeholder="Search..."
              autoComplete="off"
            />
            <SearchIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4  text-gray-500" />
          </div>
        </div>
      </div>

      {/* Sidebar for Mobile */}
      <div
        className={`fixed z-20 inset-0 transform transition-transform duration-300 md:hidden ${
          isNavOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ top: "4rem" }}
      >
        <div className="bg-blue-600 text-white p-4 h-full w-3/5">
          <ul>
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `block p-2 transition duration-300 ${
                    isActive ? "text-black" : "text-white"
                  }`
                }
                onClick={() => {
                  setIsNavOpen(false); // Close the sidebar on click
                  // ...other click handlers if necessary...
                }}
              >
                <HomeIcon className="inline-block h-5 w-5 mr-2" /> Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `block p-2 transition duration-300 ${
                    isActive ? "text-black" : "text-white"
                  }`
                }
                onClick={() => setIsNavOpen(false)} // Close the sidebar on click
              >
                <UserIcon className="inline-block h-5 w-5 mr-2" /> Profile
              </NavLink>
            </li>
            {/* Add other navigation items here */}
            {!isWriter() && (
              <li>
                <NavLink
                  to="/cart"
                  className={({ isActive }) =>
                    `block p-2 transition duration-300 ${
                      isActive ? "text-black" : "text-white"
                    }`
                  }
                  onClick={() => setIsNavOpen(false)}
                >
                  <div className="flex items-center relative">
               <ShoppingCartIcon className="h-5 w-5" />
               <span className="ml-2">Cart</span>
               {cartTotals.totalItems > 0 && (
                 <span className="absolute -top-1 left-full ml-1 bg-black text-white rounded-full h-6 w-6 flex items-center justify-center text-xs">
                   {cartTotals.totalItems}
                 </span>
               )}
             </div>
                </NavLink>
              </li>
            )}

            {/* Add other navigation items here */}
          </ul>
        </div>
      </div>


      {/* Top Navigation Bar for Desktop */}
      <div className="hidden md:flex justify-between items-center bg-blue-500 p-4 text-white">
        <h1 className="text-xl font-bold ">Shoplify</h1>
        <nav className="flex-grow">
          <ul className="flex justify-center space-x-4 items-center">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `hover:text-xl hover:font-bold transition duration-300 ${
                  isActive ? "text-black" : "text-white"
                }`
              }
              onClick={() => setActiveLink("Home")}
            >
              <HomeIcon className="inline-block h-5 w-5 mr-2" /> Home
            </NavLink>

            <li className="relative w-1/3">
              <input
                className="pl-2 pr-12 py-1 w-full rounded-md text-black" // Increased right padding
                type="search"
                placeholder="Search"
              />
              <SearchIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
            </li>

            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `hover:text-xl hover:font-bold transition duration-300 ${
                  isActive ? "text-black" : "text-white"
                }`
              }
              onClick={() => setActiveLink("Profile")}
            >
              <UserIcon className="inline-block h-5 w-5 mr-2" /> Profile
            </NavLink>

            {!isWriter() && (
             <NavLink
             to="/cart"
             className={({ isActive }) =>
               `hover:text-xl hover:font-bold transition duration-300 ${
                 isActive ? "text-black" : "text-white"
               }`
             }
             onClick={() => setActiveLink("Cart")}
           >
             <div className="flex items-center relative">
               <ShoppingCartIcon className="h-5 w-5" />
               <span className="ml-2">Cart</span>
               {cartTotals.totalItems > 0 && (
                 <span className="absolute -top-1 left-full ml-1 bg-black text-white rounded-full h-6 w-6 flex items-center justify-center text-xs">
                   {cartTotals.totalItems}
                 </span>
               )}
             </div>
           </NavLink>
            )}

            {/* Add other navigation items here */}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Navigation;
