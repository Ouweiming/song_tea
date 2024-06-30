import React from 'react';
import { FaShoppingCart } from 'react-icons/fa'; // 确保你已经安装并导入了react-icons

// 假设 Product 是一个传入的 prop，我们需要修改 ShoppingCart 组件来接受它
const ShoppingCart = ({ product }) => {
  return (
    <div className="max-w-lg mx-auto bg-white dark:bg-teal-800 shadow-lg rounded-lg overflow-hidden">
      <div className="p-8">
        <div className="flex items-center justify-center align-middle">
          {/* 使用传入的 product 图片 URL */}
          <img className="w-64 h-64 rounded-full mr-4 transition-transform duration-200 transform hover:scale-110" src={product.image} alt={product.name} />
        </div>
      </div>
      <div className="px-8 py-6 border-t border-gray-200">

        
        <button className="w-full mt-4 bg-emerald-400 hover:bg-emerald-700 dark:hover:bg-emerald-500 text-white dark:text-teal-900 font-bold py-3 rounded-lg transition-colors duration-200 flex justify-center items-center">
          <FaShoppingCart className="mr-2" /> Taobao
        </button>
      </div>
    </div>
  );
}

export default ShoppingCart;