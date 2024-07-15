import React from 'react'
import { FaShoppingCart } from 'react-icons/fa'

// 确保你已经安装并导入了react-icons

// 假设 Product 是一个传入的 prop，我们需要修改 ShoppingCart 组件来接受它
const ShoppingCart = ({ product }) => {
  return (
    <div className='mx-auto max-w-lg overflow-hidden rounded-lg bg-white shadow-lg dark:bg-teal-800'>
      <div className='p-8'>
        <div className='flex items-center justify-center align-middle'>
          {/* 使用传入的 product 图片 URL */}
          <img
            className='mr-4 h-64 w-64 transform rounded-full transition-transform duration-200 hover:scale-110'
            src={product.image}
            alt={product.name}
          />
        </div>
      </div>
      <div className='border-t border-gray-200 px-8 py-6'>
        <button className='mt-4 flex w-full items-center justify-center rounded-lg bg-emerald-400 py-3 font-bold text-white transition-colors duration-200 hover:bg-emerald-700 dark:text-teal-900 dark:hover:bg-emerald-500'>
          <FaShoppingCart className='mr-2' /> Taobao
        </button>
      </div>
    </div>
  )
}

export default ShoppingCart
