import { FaWhatsapp } from 'react-icons/fa'
import { motion } from 'framer-motion'

export default function WhatsAppButton() {
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
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-green-500 text-white px-4 py-3 rounded-full shadow-lg shadow-green-500/30 hover:bg-green-600 transition-colors group"
            aria-label="Chat with us on WhatsApp"
        >
            <FaWhatsapp className="w-6 h-6" />
            <span className="hidden sm:inline text-sm font-medium">Chat with us</span>
            {/* Pulse ring */}
            <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-20" />
        </motion.a>
    )
}
