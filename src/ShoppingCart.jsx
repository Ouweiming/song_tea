import React from 'react';

const ShoppingCart = () => {
  return (
    <div className="max-w-sm mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-center align-middle">
          <img className="w-48 h-48 rounded-full mr-4" src="src/assets/goods.jpg" alt="Product" />

        </div>
      </div>
      <div className="px-6 py-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <p className="text-gray-900 font-semibold">Total</p>
          <p className="text-gray-900 font-semibold">$16</p>
        </div>
        <button className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 rounded-lg transition-colors duration-200">
          Checkout with Shop Pay
        </button>
        <button className="w-full mt-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 rounded-lg transition-colors duration-200">
          Checkout
        </button>
      </div>
    </div>
  );
}

export default ShoppingCart;