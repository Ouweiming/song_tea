import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Home from './Homepage'
import Introduction from './Introduction'

const Router = () => {
  return (
    <AnimatePresence>
      <Routes>
        <Route path='/' element={<Home />} />

        <Route path='/Homepage' element={<Home />} />

        <Route path='/Introduction' element={<Introduction />} />
      </Routes>
    </AnimatePresence>
  )
}

export default Router
