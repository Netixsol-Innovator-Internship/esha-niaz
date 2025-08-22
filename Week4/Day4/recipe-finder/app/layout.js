'use client'
import { Provider } from 'react-redux'
import { store } from '../store/store'
import Navbar from '../components/Navbar'
import { motion, AnimatePresence } from 'framer-motion'
import './globals.css'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Provider store={store}>
          <Navbar />
          <AnimatePresence mode="wait">
            <motion.main
              key={Math.random()} // forces re-animation on route change
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="p-6"
            >
              {children}
            </motion.main>
          </AnimatePresence>
        </Provider>
      </body>
    </html>
  )
}
