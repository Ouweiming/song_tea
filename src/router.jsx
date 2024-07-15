import { AnimatePresence } from 'framer-motion'
import React from 'react'
import { Route, Routes } from 'react-router-dom'

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
