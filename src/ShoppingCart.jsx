import React from 'react';
import Product from "./assets/product.jpg";
import { FaShoppingCart } from 'react-icons/fa'; // 导入购物车图标

const ShoppingCart = () => {
  return (
    <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="p-8">
        <div className="flex items-center justify-center align-middle">
        <img className="w-64 h-64 rounded-full mr-4 transition-transform duration-200 transform hover:scale-110" src={Product} alt="Product" />
        </div>
      </div>
      <div className="px-8 py-6 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <p className="text-gray-900 font-semibold">Total</p>
          <p className="text-gray-900 font-semibold">$16</p>
        </div>
        
        <button className="w-full mt-4 bg-emerald-400 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg transition-colors duration-200 flex justify-center items-center">
          <FaShoppingCart className="mr-2" /> Taobao
        </button>

      </div>
    </div>
  );
}

export default ShoppingCart;