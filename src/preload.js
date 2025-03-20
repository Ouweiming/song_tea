// 确保React在使用动画库之前加载
import React from 'react'
import ReactDOM from 'react-dom'

// 导出React以便在其他模块中使用
export { React, ReactDOM }

// 全局暴露React以确保动画库可以访问
window.React = React
