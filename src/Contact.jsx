import React from 'react'

const ContactForm = () => {
  return (
    <div className='flex min-h-screen items-center justify-center bg-gradient-to-r from-green-800 to-emerald-950 px-4 py-16 sm:px-6 lg:px-8'>
      <div className='w-full max-w-7xl space-y-8'>
        <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
          <div className='space-y-20 text-white'>
            <h1 className='text-4xl font-bold'>加入我们的茶叶世界，共创辉煌</h1>
            <p>
              如果您对加入后花园宋茶品牌有兴趣，欢迎随时联系我们。我们期待与您共同开创茶叶市场的新篇章。
            </p>

            <div>
              <h2 className='text-xl font-semibold'>联系我们</h2>
              <p>联系人：余先生</p>
              <p>电话：(+86) 13829600014</p>
              <p>
                联系邮箱：
                <a
                  href='308683293@qq.com'
                  className='text-emerald-400 underline'
                >
                  308683293@qq.com
                </a>
              </p>
            </div>
            <div>
              <p className='text-sm'>Copyright &copy;2024 醉茶小皇帝</p>
            </div>
          </div>

          <div className='space-y-6 rounded-lg bg-white p-8 shadow-lg dark:bg-teal-900'>
            <div className='flex space-x-4'>
              <div className='w-full'>
                <label className='block text-sm font-medium text-gray-700 dark:text-white'>
                  姓名
                </label>
                <input
                  type='text'
                  className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 sm:text-sm'
                />
              </div>
            </div>
            <div className='flex space-x-4'>
              <div className='w-full'>
                <label className='block text-sm font-medium text-gray-700 dark:text-white'>
                  邮箱
                </label>
                <input
                  type='email'
                  className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 sm:text-sm'
                />
              </div>
              <div className='w-full'>
                <label className='block text-sm font-medium text-gray-700 dark:text-white'>
                  公司名称（如适用）
                </label>
                <input
                  type='text'
                  className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 sm:text-sm'
                />
              </div>
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-white'>
                兴趣领域
              </label>
              <select className='mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 dark:text-black sm:text-sm'>
                <option>请选择</option>
                <option>选项 1</option>
                <option>选项 2</option>
                <option>选项 3</option>
              </select>
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-white'>
                留言
              </label>
              <textarea
                className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 sm:text-sm'
                rows='4'
              ></textarea>
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-white'>
                您是如何得知我们的？
              </label>
              <select className='mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 dark:text-black sm:text-sm'>
                <option>请选择</option>
                <option>选项 1</option>
                <option>选项 2</option>
                <option>选项 3</option>
              </select>
            </div>
            <div>
              <button className='w-full rounded-md border border-transparent bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2'>
                提交
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactForm
