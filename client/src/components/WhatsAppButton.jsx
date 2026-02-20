import { useState, useEffect } from 'react'
import { FaWhatsapp } from 'react-icons/fa'
import { motion } from 'framer-motion'

export default function WhatsAppButton() {
    const [isAtFooter, setIsAtFooter] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            const windowHeight = window.innerHeight
            const documentHeight = document.documentElement.scrollHeight
            const scrollY = window.scrollY

            // If we are within 150px of the bottom, move the button up
            if (windowHeight + scrollY >= documentHeight - 150) {
                setIsAtFooter(true)
            } else {
                setIsAtFooter(false)
            }
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <motion.a
            href="https://wa.me/916006642157?text=Hi%20AppNest%2C%20I%20need%20help%20with%20a%20project"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 2.5, type: 'spring' }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={`fixed ${isAtFooter ? 'bottom-24' : 'bottom-6'} right-6 z-50 flex items-center gap-2 bg-green-500 text-white px-4 py-3 rounded-full shadow-lg shadow-green-500/30 hover:bg-green-600 transition-all duration-300 group`}
            aria-label="Chat with us on WhatsApp"
        >
            <FaWhatsapp className="w-6 h-6" />
            <span className="hidden sm:inline text-sm font-medium">Chat with us</span>
            {/* Pulse ring */}
            <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-20" />
        </motion.a>
    )
}
