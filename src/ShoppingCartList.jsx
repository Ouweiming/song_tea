import React from 'react';
import ShoppingCart from './ShoppingCart'; // 确保路径正确

const ShoppingCartList = () => {
  return (
    <div className="flex flex-col items-center gap-8 p-4 md:gap-12 md:p-8">
      <h2 className="text-emerald-600 text-3xl md:text-4xl font-bold text-center mb-4 md:mb-8">产品体验</h2>
      <div className="flex flex-wrap justify-center gap-8 md:gap-12">
        <ShoppingCart />
        <ShoppingCart />
        <ShoppingCart />
        <ShoppingCart />

        {/* 根据需要复制更多的 ShoppingCart 组件 */}
      </div>
    </div>
  );
}

export default ShoppingCartList;