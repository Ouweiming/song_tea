import { Tooltip } from '@nextui-org/react'
import PropTypes from 'prop-types'
import { FaShoppingCart } from 'react-icons/fa'

const ShoppingCart = ({ product }) => {
  return (
    <div className='mx-auto max-w-lg overflow-hidden rounded-lg bg-white shadow-lg transition-transform duration-300 hover:-translate-y-1 dark:bg-teal-800'>
      <div className='p-6'>
        <div className='mb-4 flex items-center justify-center'>
          <img
            className='h-64 w-64 rounded-full object-cover shadow-lg transition-transform duration-200 hover:scale-105'
            src={product.image}
            alt={product.name}
          />
        </div>
        <div className='text-center'>
          <h3 className='mb-2 text-xl font-bold text-gray-800 dark:text-gray-100'>
            {product.name}
          </h3>

          {/* 简短描述区域 */}
          <p className='mb-4 text-gray-600 dark:text-gray-300'>
            {product.description}
          </p>

          {/* 分类标签 */}
          <div className='flex justify-center'>
            <span className='inline-block rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-800 dark:bg-emerald-800/50 dark:text-emerald-200'>
              {product.category}
            </span>
          </div>
        </div>
      </div>
      <div className='border-t border-gray-200 px-6 py-4 dark:border-teal-700'>
        <Tooltip
          content='暂时无法购买，即将上线'
          color='warning'
          placement='bottom'
        >
          <div className='w-full'>
            <button
              disabled
              className='flex w-full cursor-not-allowed items-center justify-center rounded-lg bg-emerald-500 px-4 py-3 font-bold text-white opacity-70 transition-colors duration-200 dark:bg-emerald-600 dark:text-white'
            >
              <FaShoppingCart className='mr-2' /> Taobao
              <span className='ml-2 rounded-full bg-yellow-500 px-2 py-1 text-xs text-white'>
                敬请期待
              </span>
            </button>
          </div>
        </Tooltip>
      </div>
    </div>
  )
}

ShoppingCart.propTypes = {
  product: PropTypes.shape({
    image: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
  }).isRequired,
}

export default ShoppingCart
