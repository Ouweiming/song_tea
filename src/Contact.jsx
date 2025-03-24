import { useState } from 'react'
import { FiSend, FiUser } from 'react-icons/fi'
import {
  RiCustomerService2Line,
  RiLeafLine,
  RiQuestionAnswerLine,
} from 'react-icons/ri'

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const handleChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = e => {
    e.preventDefault()
    setIsSubmitting(true)

    // 模拟表单提交
    setTimeout(() => {
      console.log('表单提交:', formData)
      setIsSubmitting(false)
      setSubmitSuccess(true)
      setFormData({
        name: '',
        company: '',
        email: '',
        message: '',
      })

      // 3秒后重置成功信息
      setTimeout(() => setSubmitSuccess(false), 3000)
    }, 800)
  }

  return (
    <div
      id='contact'
      className='relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-r from-green-900 to-emerald-800 px-4 py-16 sm:px-6 lg:px-8'
    >
      {/* 茶叶装饰元素 - 只在大屏幕显示以优化移动端性能 */}
      <div className='absolute right-0 top-0 hidden h-64 w-64 rotate-45 transform opacity-10 lg:block'>
        <RiLeafLine className='h-full w-full text-white' />
      </div>
      <div className='absolute bottom-0 left-0 hidden h-48 w-48 -rotate-12 transform opacity-10 lg:block'>
        <RiLeafLine className='h-full w-full text-white' />
      </div>

      <div className='relative z-10 w-full max-w-6xl'>
        <div className='mx-auto mb-12 text-center'>
          <div className='mb-4 inline-flex items-center justify-center'>
            <span className='mr-4 h-px w-8 bg-emerald-400'></span>
            <RiLeafLine className='text-2xl text-emerald-400' />
            <span className='ml-4 h-px w-8 bg-emerald-400'></span>
          </div>
          <h1 className='mb-6 text-4xl font-bold text-white md:text-5xl'>
            加入我们的茶叶世界
          </h1>
          <p className='mx-auto max-w-3xl text-xl text-gray-100'>
            如果您对后花园宋茶品牌有兴趣，欢迎填写下方表单咨询。我们期待与您共同开创茶叶市场的新篇章。
          </p>
        </div>

        <div className='grid grid-cols-1 gap-10 lg:grid-cols-12'>
          {/* 左侧：合作内容介绍 */}
          <div className='h-fit rounded-xl bg-white/10 p-6 shadow-lg backdrop-blur-sm sm:p-8 lg:col-span-5'>
            <h2 className='mb-6 flex items-center border-b border-emerald-400 pb-3 text-2xl font-semibold text-white'>
              <RiLeafLine className='mr-2 text-emerald-400' />
              关于合作
            </h2>

            <div className='space-y-8'>
              <div>
                <h3 className='mb-3 flex items-center text-lg font-medium text-white'>
                  <RiCustomerService2Line className='mr-2 text-emerald-300' />
                  我们提供的服务
                </h3>
                <ul className='space-y-3 text-gray-200'>
                  <li className='flex items-start'>
                    <span className='mr-2 mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-400'></span>
                    <span>高品质茶叶定制与批发，满足不同消费群体需求</span>
                  </li>
                  <li className='flex items-start'>
                    <span className='mr-2 mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-400'></span>
                    <span>专业茶叶品鉴会与文化推广活动策划</span>
                  </li>
                  <li className='flex items-start'>
                    <span className='mr-2 mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-400'></span>
                    <span>企业礼品茶定制，提供个性化包装与服务</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className='mb-3 flex items-center text-lg font-medium text-white'>
                  <RiQuestionAnswerLine className='mr-2 text-emerald-300' />
                  为什么选择我们
                </h3>
                <ul className='space-y-3 text-gray-200'>
                  <li className='flex items-start'>
                    <span className='mr-2 mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-400'></span>
                    <span>严选茶源，一手货源直达，确保品质与价格优势</span>
                  </li>
                  <li className='flex items-start'>
                    <span className='mr-2 mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-400'></span>
                    <span>专业团队，从种植到加工全程把控</span>
                  </li>
                  <li className='flex items-start'>
                    <span className='mr-2 mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-400'></span>
                    <span>灵活合作模式，为合作伙伴提供多元化支持</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className='mt-8 rounded-lg border border-emerald-900/20 bg-white/5 p-5'>
              <h3 className='mb-3 text-center text-lg font-medium text-white'>
                我们的客户群体
              </h3>
              <div className='flex flex-wrap justify-center gap-3'>
                <span className='rounded-full bg-emerald-800/50 px-4 py-1.5 text-sm text-white'>
                  茶叶经销商
                </span>
                <span className='rounded-full bg-emerald-800/50 px-4 py-1.5 text-sm text-white'>
                  礼品定制商
                </span>
                <span className='rounded-full bg-emerald-800/50 px-4 py-1.5 text-sm text-white'>
                  茶文化爱好者
                </span>
                <span className='rounded-full bg-emerald-800/50 px-4 py-1.5 text-sm text-white'>
                  企业采购
                </span>
                <span className='rounded-full bg-emerald-800/50 px-4 py-1.5 text-sm text-white'>
                  电商平台
                </span>
              </div>
            </div>
          </div>

          {/* 右侧：联系表单 */}
          <div className='rounded-xl bg-white/10 p-6 shadow-lg backdrop-blur-sm sm:p-8 lg:col-span-7'>
            <h2 className='mb-6 flex items-center border-b border-emerald-400 pb-3 text-2xl font-semibold text-white'>
              <FiSend className='mr-2 text-emerald-400' />
              联系我们
            </h2>

            {submitSuccess ? (
              <div className='rounded-lg border border-emerald-500 bg-emerald-800/50 p-6 text-center'>
                <RiLeafLine className='mx-auto mb-3 text-5xl text-emerald-400' />
                <p className='text-xl font-medium text-white'>感谢您的留言</p>
                <p className='mt-2 text-gray-200'>
                  我们已收到您的咨询信息，将在一个工作日内回复您
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className='space-y-5'>
                <div>
                  <label
                    htmlFor='name'
                    className='mb-1.5 block text-sm font-medium text-gray-200'
                  >
                    您的姓名 <span className='text-emerald-400'>*</span>
                  </label>
                  <input
                    type='text'
                    id='name'
                    name='name'
                    value={formData.name}
                    onChange={handleChange}
                    required
                    autoComplete='name'
                    className='w-full rounded-md border border-emerald-900/30 bg-white/5 px-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50'
                    placeholder='请输入您的姓名'
                  />
                </div>

                <div>
                  <label
                    htmlFor='company'
                    className='mb-1.5 block text-sm font-medium text-gray-200'
                  >
                    公司/机构名称
                  </label>
                  <input
                    type='text'
                    id='company'
                    name='company'
                    value={formData.company}
                    onChange={handleChange}
                    autoComplete='organization'
                    className='w-full rounded-md border border-emerald-900/30 bg-white/5 px-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50'
                    placeholder='请输入您的公司或机构名称（选填）'
                  />
                </div>

                <div>
                  <label
                    htmlFor='email'
                    className='mb-1.5 block text-sm font-medium text-gray-200'
                  >
                    电子邮箱 <span className='text-emerald-400'>*</span>
                  </label>
                  <input
                    type='email'
                    id='email'
                    name='email'
                    value={formData.email}
                    onChange={handleChange}
                    required
                    autoComplete='email'
                    className='w-full rounded-md border border-emerald-900/30 bg-white/5 px-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50'
                    placeholder='请输入您的电子邮箱'
                  />
                  <p className='mt-1 text-xs text-gray-400'>
                    我们将通过此邮箱与您联系，请确保填写正确
                  </p>
                </div>

                <div>
                  <label
                    htmlFor='message'
                    className='mb-1.5 block text-sm font-medium text-gray-200'
                  >
                    咨询内容 <span className='text-emerald-400'>*</span>
                  </label>
                  <textarea
                    id='message'
                    name='message'
                    value={formData.message}
                    onChange={handleChange}
                    required
                    autoComplete='off'
                    rows='5'
                    className='w-full resize-none rounded-md border border-emerald-900/30 bg-white/5 px-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50'
                    placeholder='请详细描述您的需求或问题，我们会为您提供专业解答'
                  ></textarea>
                </div>

                <div className='flex items-center justify-between'>
                  <div className='text-xs text-gray-300'>
                    <span className='text-emerald-400'>*</span> 为必填项
                  </div>
                  <button
                    type='submit'
                    disabled={isSubmitting}
                    className={`flex items-center justify-center rounded-md bg-emerald-600 px-6 py-3 text-white transition-colors hover:bg-emerald-700 ${isSubmitting ? 'cursor-not-allowed opacity-70' : ''}`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className='-ml-1 mr-2 h-4 w-4 animate-spin text-white'
                          xmlns='http://www.w3.org/2000/svg'
                          fill='none'
                          viewBox='0 0 24 24'
                        >
                          <circle
                            className='opacity-25'
                            cx='12'
                            cy='12'
                            r='10'
                            stroke='currentColor'
                            strokeWidth='4'
                          ></circle>
                          <path
                            className='opacity-75'
                            fill='currentColor'
                            d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                          ></path>
                        </svg>
                        提交中...
                      </>
                    ) : (
                      <>
                        <FiSend className='mr-2' /> 提交咨询
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            <div className='mt-8 rounded-lg bg-white/5 p-4 text-center'>
              <div className='flex items-center justify-center'>
                <FiUser className='mr-2 text-emerald-400' />
                <p className='text-emerald-200'>
                  联系负责人：余先生（专业茶叶顾问）
                </p>
              </div>
              <p className='mt-2 text-sm text-gray-300'>
                我们将在1-2个工作日内与您联系，感谢您的耐心等待
              </p>
            </div>
          </div>
        </div>

        <div className='mt-12 text-center text-gray-300'>
          <p className='flex items-center justify-center text-sm'>
            <RiLeafLine className='mr-1 text-emerald-400' />
            <span>共品好茶，共创未来</span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default ContactSection
