import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useRef, useState } from 'react'

const Footer = () => {
  const [subscribed, setSubscribed] = useState(false)
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const timerRef = useRef(null)

  // 在组件卸载时清除定时器
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [])

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

    // 使用ref保存定时器ID以便清除
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
    timerRef.current = setTimeout(() => {
      setSubscribed(false)
    }, 3000)
  }

  return (
    <footer className='py-8 bg-white text-dark dark:bg-gray-800 dark:text-white'>
      <div className='container px-4 mx-auto'>
        <div className='flex flex-wrap justify-between'>
          <div className='w-full mb-8 md:mb-0 md:w-1/3'>
            <h2 className='mb-4 text-xl font-bold md:text-2xl'>联系信息</h2>
            <p>
              Email:{' '}
              <a
                href='mailto:308683293@qq.com'
                className='hover:text-emerald-600 hover:underline'
              >
                308683293@qq.com
              </a>
            </p>
            <p>电话: +86 13829600014 余先生</p>
          </div>

          <div className='w-full md:w-1/3'>
            <h2 className='mb-4 text-xl font-bold md:text-2xl'>订阅</h2>
            <form onSubmit={handleSubmit}>
              <div className='flex flex-col md:flex-row'>
                <input
                  type='email'
                  id='email'
                  name='email'
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder='您的电子邮件'
                  className='w-full p-2 mb-2 mr-0 text-black rounded-md dark:bg-gray-700 dark:text-white md:mb-0 md:mr-2 md:w-2/3'
                  autoComplete='email'
                />
                <button
                  type='submit'
                  className='w-full py-2 font-bold text-white bg-green-700 rounded-md hover:bg-green-800 md:w-1/3'
                >
                  订阅
                </button>
              </div>
              <div className='h-6 mt-1'>
                {' '}
                {/* 提供固定高度的容器 */}
                {emailError && <p className='text-red-500'>{emailError}</p>}
              </div>
            </form>
          </div>
        </div>

        {/* 居中显示感谢订阅消息，预留固定高度 */}
        <div className='h-10 mt-4 text-center'>
          {' '}
          {/* 固定高度容器防止布局跳动 */}
          {subscribed && (
            <p className='text-2xl text-green-500'>感谢您的订阅！</p>
          )}
        </div>

        <div className='pt-8 mt-10 text-center border-t border-gray-700'>
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
