import { useState } from 'react'

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    interest: '',
    message: '',
    source: '',
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const handleChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))

    // 清除该字段的错误
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }))
    }
  }

  // 使用批处理来减少回流
  const validateForm = () => {
    // 延迟批量处理所有状态更新
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = '请输入您的姓名'
    }

    if (!formData.email.trim()) {
      newErrors.email = '请输入您的邮箱'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = '邮箱格式不正确'
    }

    if (!formData.message.trim()) {
      newErrors.message = '请输入留言内容'
    }

    // 批量一次性更新错误状态，而不是多次单独更新
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // 优化表单提交函数
  const handleSubmit = e => {
    e.preventDefault()

    if (validateForm()) {
      // 使用requestAnimationFrame在视觉上优化状态变化
      requestAnimationFrame(() => {
        setIsSubmitting(true)

        // 使用CSS类而不是JS控制动画，减少回流
        // 模拟表单提交
        setTimeout(() => {
          // 批处理状态更新
          requestAnimationFrame(() => {
            setIsSubmitting(false)
            setSubmitSuccess(true)
            setFormData({
              name: '',
              email: '',
              company: '',
              interest: '',
              message: '',
              source: '',
            })
          })

          // 使用CSS transition代替JS动画，减少回流
          setTimeout(() => {
            setSubmitSuccess(false)
          }, 3000)
        }, 1000)
      })
    }
  }

  return (
    <div
      id='contact'
      className='flex min-h-screen items-center justify-center bg-gradient-to-r from-green-900 to-emerald-800 px-4 py-16 sm:px-6 lg:px-8'
    >
      <div className='w-full max-w-7xl space-y-8'>
        <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
          <div className='space-y-20 text-white'>
            <h1 className='text-on-dark text-4xl font-bold text-white'>
              加入我们的茶叶世界，共创辉煌
            </h1>
            <p className='text-on-dark text-gray-100'>
              如果您对加入后花园宋茶品牌有兴趣，欢迎随时联系我们。我们期待与您共同开创茶叶市场的新篇章。
            </p>

            <div>
              <h2 className='text-on-dark text-xl font-semibold text-white'>
                联系我们
              </h2>
              <p className='text-gray-100'>联系人：余先生</p>
              <p className='text-gray-100'>电话：(+86) 13829600014</p>
              <p className='text-gray-100'>
                联系邮箱：
                <a
                  href='mailto:308683293@qq.com'
                  className='text-emerald-300 underline hover:text-emerald-200'
                >
                  308683293@qq.com
                </a>
              </p>
            </div>
            <div>
              <p className='text-sm text-gray-300'>
                Copyright &copy;2024 醉茶小皇帝
              </p>
            </div>
          </div>

          <div className='space-y-6 rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800'>
            {submitSuccess && (
              <div className='mb-4 rounded-md bg-green-100 p-4 text-green-800 dark:bg-green-800 dark:text-green-100'>
                <p className='text-center font-medium'>
                  提交成功！我们会尽快与您联系。
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className='w-full'>
                <label className='block text-sm font-medium text-gray-800 dark:text-white'>
                  姓名 <span className='text-red-500'>*</span>
                </label>
                <input
                  type='text'
                  name='name'
                  value={formData.name}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-emerald-500 sm:text-sm ${
                    errors.name
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:border-emerald-500'
                  }`}
                />
                {errors.name && (
                  <p className='mt-1 text-sm text-red-500'>{errors.name}</p>
                )}
              </div>

              <div className='mt-4 flex space-x-4'>
                <div className='w-full'>
                  <label className='block text-sm font-medium text-gray-700 dark:text-white'>
                    邮箱 <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type='email'
                    name='email'
                    value={formData.email}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-emerald-500 sm:text-sm ${
                      errors.email
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-gray-300 focus:border-emerald-500'
                    }`}
                  />
                  {errors.email && (
                    <p className='mt-1 text-sm text-red-500'>{errors.email}</p>
                  )}
                </div>
                <div className='w-full'>
                  <label className='block text-sm font-medium text-gray-700 dark:text-white'>
                    公司名称（如适用）
                  </label>
                  <input
                    type='text'
                    name='company'
                    value={formData.company}
                    onChange={handleChange}
                    className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 sm:text-sm'
                  />
                </div>
              </div>

              <div className='mt-4'>
                <label className='block text-sm font-medium text-gray-700 dark:text-white'>
                  兴趣领域
                </label>
                <select
                  name='interest'
                  value={formData.interest}
                  onChange={handleChange}
                  className='mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 dark:text-black sm:text-sm'
                >
                  <option>请选择</option>
                  <option>选项 1</option>
                  <option>选项 2</option>
                  <option>选项 3</option>
                </select>
              </div>

              <div className='mt-4'>
                <label className='block text-sm font-medium text-gray-700 dark:text-white'>
                  留言 <span className='text-red-500'>*</span>
                </label>
                <textarea
                  name='message'
                  value={formData.message}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-emerald-500 sm:text-sm ${
                    errors.message
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:border-emerald-500'
                  }`}
                  rows='4'
                ></textarea>
                {errors.message && (
                  <p className='mt-1 text-sm text-red-500'>{errors.message}</p>
                )}
              </div>

              <div className='mt-4'>
                <label className='block text-sm font-medium text-gray-700 dark:text-white'>
                  您是如何得知我们的？
                </label>
                <select
                  name='source'
                  value={formData.source}
                  onChange={handleChange}
                  className='mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 dark:text-black sm:text-sm'
                >
                  <option>请选择</option>
                  <option>选项 1</option>
                  <option>选项 2</option>
                  <option>选项 3</option>
                </select>
              </div>

              <div className='mt-6'>
                <button
                  type='submit'
                  disabled={isSubmitting}
                  className='w-full rounded-md border border-transparent bg-emerald-800 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:ring-offset-2 disabled:opacity-75'
                >
                  {isSubmitting ? '提交中...' : '提交'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactForm
