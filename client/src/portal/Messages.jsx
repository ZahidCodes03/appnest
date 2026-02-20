import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { HiOutlinePaperAirplane } from 'react-icons/hi'
import api from '../lib/api'
import { useAuth } from '../context/AuthContext'

export default function Messages() {
    const { user } = useAuth()
    const [messages, setMessages] = useState([])
    const [input, setInput] = useState('')
    const [adminId, setAdminId] = useState(null)
    const bottomRef = useRef(null)

    useEffect(() => {
        const init = async () => {
            try {
                // Get Admin ID
                const { data: admin } = await api.get('/projects/admin-contact')
                setAdminId(admin.id)

                // Get Messages
                const { data: msgs } = await api.get(`/messages/${admin.id}`)
                setMessages(msgs)
            } catch (error) { console.error('Failed to init messages') }
        }
        init()

        // Poll for new messages every 5s
        const interval = setInterval(() => {
            if (adminId) api.get(`/messages/${adminId}`).then(({ data }) => setMessages(data))
        }, 5000)
        return () => clearInterval(interval)
    }, [adminId]) // Add adminId dependency to ensure polling uses correct ID

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const sendMessage = async (e) => {
        e.preventDefault()
        if (!input.trim() || !adminId) return
        try {
            const { data } = await api.post('/messages', { receiver_id: adminId, text: input })
            setMessages([...messages, data])
            setInput('')
        } catch { console.error('Failed to send') }
    }

    return (
        <div className="flex flex-col h-[calc(100vh-12rem)]">
            <div className="flex-1 overflow-y-auto space-y-4 pb-4">
                {messages.length === 0 && <div className="text-center text-gray-400 mt-10">No messages yet. Start a conversation!</div>}
                {messages.map((msg, i) => {
                    const isMe = msg.sender_id === user.id
                    return (
                        <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                            className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${isMe ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-900'}`}>
                                <div className={`text-xs font-medium mb-1 ${isMe ? 'text-blue-100' : 'text-blue-600'}`}>{isMe ? 'You' : 'AppNest Team'}</div>
                                <p className="text-sm">{msg.text}</p>
                                <div className={`text-xs mt-1.5 ${isMe ? 'text-blue-200' : 'text-gray-400'}`}>{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                            </div>
                        </motion.div>
                    )
                })}
                <div ref={bottomRef} />
            </div>
            <form onSubmit={sendMessage} className="flex gap-3 pt-4 border-t border-gray-200">
                <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type a message..." className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-sm bg-white" />
                <button type="submit" className="btn-primary !px-4 !py-3">
                    <HiOutlinePaperAirplane className="w-5 h-5 rotate-90" />
                </button>
            </form>
        </div>
    )
}
