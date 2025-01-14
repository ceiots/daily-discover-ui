import React from 'react';
import { NavLink } from 'react-router-dom';
import './NavBar.css'; // 如果需要样式，可以创建一个 CSS 文件

const NavBar = () => {
  return (
    <nav className="fixed bottom-0 w-full max-w-[375px] bg-white border-t flex items-center justify-around py-2 px-4">
        <NavLink
          to="/"
          className={({ isActive }) => `flex flex-col items-center p-2 ${isActive ? 'text-primary' : 'text-gray-400'}`}
        >
        {({ isActive }) => (
          <>
            <i className={`fas fa-compass ${isActive ? 'text-primary' : 'text-gray-400'}`}></i>
            <span className={`text-xs mt-1 ${isActive ? 'text-primary' : 'text-gray-400'}`}>发现</span>
          </>
        )}
        </NavLink>
        <NavLink className="flex relative">
          <button className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white shadow-lg !rounded-button">
            <i className="fas fa-plus text-xl"></i>
          </button>
        </NavLink>
        <NavLink
          to="/calendar"
          className={({ isActive }) => `flex flex-col items-center p-2 ${isActive ? 'text-primary' : 'text-gray-400'}`}
        >
        {({ isActive }) => (
          <>
            <i className={`fas fa-calendar ${isActive ? 'text-primary' : 'text-gray-400'}`}></i>
            <span className={`text-xs mt-1 ${isActive ? 'text-primary' : 'text-gray-400'}`}>日历</span>
          </>
        )}
        </NavLink>
    </nav>
  );
};

export default NavBar;