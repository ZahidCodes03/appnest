import { useState, useEffect, useRef } from 'react'
import { FaWhatsapp, FaTimes, FaPaperPlane } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'

export default function WhatsAppButton() {
    const [isOpen, setIsOpen] = useState(false)
    const [isAtFooter, setIsAtFooter] = useState(false)
    const [message, setMessage] = useState('')
    const chatEndRef = useRef(null)

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

    const handleSendMessage = (e) => {
        e.preventDefault()
        if (!message.trim()) return
        
        const encodedMessage = encodeURIComponent(message)
        window.open(`https://wa.me/916006642157?text=${encodedMessage}`, '_blank')
        setMessage('')
        setIsOpen(false)
    }

    return (
        <div className={`fixed ${isAtFooter ? 'bottom-24' : 'bottom-6'} right-6 z-50 flex flex-col items-end gap-4`}>
            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20, transformOrigin: 'bottom right' }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        className="w-[320px] sm:w-[380px] bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-white/20 flex flex-col mb-2"
                    >
                        {/* Header */}
                        <div className="bg-green-500 p-4 text-white flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-green-500 font-bold">
                                        AN
                                    </div>
                                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-green-500 rounded-full animate-pulse" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-sm">AppNest Support</h3>
                                    <p className="text-[10px] opacity-90">Typically replies within minutes</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setIsOpen(false)}
                                className="p-1 hover:bg-white/20 rounded-full transition-colors"
                            >
                                <FaTimes />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-4 bg-gray-50/50 min-h-[150px] max-h-[300px] overflow-y-auto">
                            <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm text-sm text-gray-700 max-w-[85%] mb-4 border border-gray-100">
                                <p>Hi there! 👋 How can we help you today with your project?</p>
                                <span className="text-[10px] text-gray-400 mt-1 block">14:32</span>
                            </div>
                            
                            <div className="flex items-center gap-2 text-[11px] text-gray-500 italic px-2">
                                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce" />
                                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce delay-75" />
                                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce delay-150" />
                                AppNest is typing...
                            </div>
                        </div>

                        {/* Footer / Input */}
                        <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-100 flex items-center gap-2">
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Type your message..."
                                className="flex-1 bg-gray-100 border-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-green-500 transition-all outline-none"
                            />
                            <button
                                type="submit"
                                disabled={!message.trim()}
                                className="bg-green-500 text-white p-2.5 rounded-full hover:bg-green-600 disabled:opacity-50 disabled:hover:bg-green-500 transition-all shadow-md active:scale-95"
                            >
                                <FaPaperPlane className="w-4 h-4" />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: 'spring' }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 bg-green-500 text-white px-4 py-3 rounded-full shadow-lg shadow-green-500/30 hover:bg-green-600 transition-all duration-300 group relative z-10"
                aria-label="Toggle WhatsApp Chat"
            >
                <motion.div
                    animate={{ rotate: isOpen ? 90 : 0 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                >
                    {isOpen ? <FaTimes className="w-6 h-6" /> : <FaWhatsapp className="w-6 h-6" />}
                </motion.div>
                {!isOpen && <span className="hidden sm:inline text-sm font-medium">Chat with us</span>}
                {/* Pulse ring */}
                {!isOpen && <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-20" />}
            </motion.button>
        </div>
    )
}
