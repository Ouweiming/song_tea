// App.jsx 或其他父组件
import React from 'react'

import ShoppingCart from './ShoppingCart'
import Product1 from './assets/goods1.jpg'
import Product2 from './assets/goods2.jpg'
import Product3 from './assets/goods3.jpg'
import Product4 from './assets/goods4.jpg'
import Product5 from './assets/goods5.jpg'

const ShoppingCartList = () => {
  const products = [
    { id: 1, image: Product1 },
    { id: 2, image: Product2 },
    { id: 3, image: Product3 },
    { id: 4, image: Product4 },
    { id: 5, image: Product5 },
  ]

  return (
    <>
      <div className='mb-14'>
        <div className='m-14 text-center'>
          <p className='text-4xl font-bold text-emerald-500 dark:text-emerald-400'>
            产品展示:
          </p>
        </div>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {products.map(product => (
            <ShoppingCart key={product.id} product={product} />
          ))}
        </div>
      </div>
    </>
  )
}

export default ShoppingCartList
