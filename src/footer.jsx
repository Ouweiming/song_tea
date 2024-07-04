import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons'

const Footer = () => {
  const [subscribed, setSubscribed] = useState(false)
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')

  const handleSubmit = e => {
    e.preventDefault()
    // 检查电子邮件是否为空或不符合格式
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError('请输入合法的邮箱信息')
      return
    }

    // 添加订阅逻辑
    setSubscribed(true)
    setEmail('')
    setEmailError('') // 清除错误消息

    setTimeout(() => {
      setSubscribed(false)
    }, 3000)
  }

  return (
    <footer className='bg-white dark:bg-gray-800 text-dark dark:text-white py-8'>
      <div className='container mx-auto px-4'>
        <div className='flex flex-wrap justify-between'>
          <div className='w-full md:w-1/3 mb-8 md:mb-0'>
            <h2 className='text-xl md:text-2xl font-bold mb-4'>联系信息</h2>
            <p>
              Email:{' '}
              <a
                href='mailto:308683293@qq.com'
                className='hover:underline hover:text-emerald-600'
              >
                308683293@qq.com
              </a>
            </p>
            <p>电话: +86 13829600014 余先生</p>
          </div>

          <div className='w-full md:w-1/3'>
            <h2 className='text-xl md:text-2xl font-bold mb-4'>订阅</h2>
            <form onSubmit={handleSubmit}>
              <div className='flex flex-col md:flex-row'>
                <input
                  type='email'
                  id='email'
                  name='email'
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder='您的电子邮件'
                  className='w-full md:w-2/3 p-2 rounded-md mb-2 md:mb-0 mr-0 md:mr-2 dark:text-white text-black dark:bg-gray-700'
                  autoComplete='email'
                />
                <button
                  type='submit'
                  className='w-full md:w-1/3 bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-md'
                >
                  订阅
                </button>
              </div>
              {emailError && <p className='text-red-500'>{emailError}</p>}
            </form>
          </div>
        </div>

        {/* 居中显示感谢订阅消息 */}
        <div className='mt-4 text-center'>
          {subscribed && (
            <p className='text-green-500 text-2xl '>感谢您的信赖！</p>
          )}
        </div>

        <div className='mt-10 border-t border-gray-700 pt-8 text-center'>
          <p>&copy;2024 醉茶小皇帝. All Rights Reserved.</p>
          <p className='mt-2'>
            Made with{' '}
            <FontAwesomeIcon
              icon={faHeartRegular}
              style={{ color: '#63E6BE' }}
              className='mx-1'
            />
            by 咩
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
