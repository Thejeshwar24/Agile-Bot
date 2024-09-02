import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MenuOutlined } from '@ant-design/icons';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-blue-500 p-4 shadow-lg">
      <div className="container mx-auto flex items-center justify-between">
        <div className="text-white font-bold text-xl">
          <Link to="/">Agile Management</Link>
        </div>
        <div className="block lg:hidden">
          <button onClick={toggleMenu} className="text-white">
            <MenuOutlined className="text-2xl" />
          </button>
        </div>
        <ul className={`lg:flex lg:items-center lg:space-x-8 ${isOpen ? 'block' : 'hidden'} lg:block`}>
          <li>
            <Link to="/" className="text-white font-semibold block lg:inline-block py-2 px-4 hover:bg-blue-600 rounded-lg">
              Home
            </Link>
          </li>
          <li>
            <Link to="/epic" className="text-white font-semibold block lg:inline-block py-2 px-4 hover:bg-blue-600 rounded-lg">
              Create Epic
            </Link>
          </li>
          <li>
            <Link to="/assignments" className="text-white font-semibold block lg:inline-block py-2 px-4 hover:bg-blue-600 rounded-lg">
              Check Assignments
            </Link>
          </li>
          <li>
            <Link to="/tree" className="text-white font-semibold block lg:inline-block py-2 px-4 hover:bg-blue-600 rounded-lg">
              Tree View
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;
