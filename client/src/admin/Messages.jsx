import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiOutlinePaperAirplane, HiOutlineUser } from 'react-icons/hi'
import api from '../lib/api'
import { useAuth } from '../context/AuthContext'

export default function AdminMessages() {
    const { user } = useAuth()
    const [conversations, setConversations] = useState([])
    const [activeClient, setActiveClient] = useState(null)
    const [messages, setMessages] = useState([])
    const [input, setInput] = useState('')
    const bottomRef = useRef(null)
    const [loading, setLoading] = useState(true)

    // Fetch conversations (unique clients)
    const fetchConversations = async () => {
        try {
            const { data } = await api.get('/admin/conversations')
            setConversations(data)
            if (data.length > 0 && !activeClient) {
                setActiveClient(data[0]) // Auto-select first
            }
        } catch (error) { console.error('Failed to fetch conversations') }
        finally { setLoading(false) }
    }

    // Fetch messages for active client
    const fetchMessages = async () => {
        if (!activeClient) return
        try {
            const { data } = await api.get(`/messages/${activeClient.id}`)
            setMessages(data)
        } catch { console.error('Failed to fetch messages') }
    }

    useEffect(() => {
        fetchConversations()
    }, [])

    useEffect(() => {
        fetchMessages()
        const interval = setInterval(fetchMessages, 5000) // Poll
        return () => clearInterval(interval)
    }, [activeClient])

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const sendMessage = async (e) => {
        e.preventDefault()
        if (!input.trim() || !activeClient) return
        try {
            const { data } = await api.post('/messages', { receiver_id: activeClient.id, text: input })
            setMessages([...messages, data])
            setInput('')
            // Refresh conversations to update "last message" snippet (optional but nice)
            fetchConversations()
        } catch { console.error('Failed to send') }
    }

    if (loading) return <div className="text-center p-20">Loading messages...</div>

    return (
        <div className="flex h-[calc(100vh-10rem)] bg-white rounded-2xl border border-gray-100 overflow-hidden">
            {/* Sidebar List */}
            <div className="w-1/3 border-r border-gray-100 flex flex-col">
                <div className="p-4 border-b border-gray-100 font-bold text-gray-700 bg-gray-50/50">Conversations</div>
                <div className="flex-1 overflow-y-auto">
                    {conversations.length === 0 ? <p className="p-4 text-sm text-gray-500 text-center">No conversations yet.</p> : conversations.map(c => (
                        <div
                            key={c.id}
                            onClick={() => setActiveClient(c)}
                            className={`p-4 border-b border-gray-50 cursor-pointer transition-colors ${activeClient?.id === c.id ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold shrink-0">
                                    {c.name?.charAt(0) || <HiOutlineUser />}
                                </div>
                                <div className="overflow-hidden">
                                    <div className="font-medium text-gray-900 truncate">{c.name}</div>
                                    <div className={`text-xs truncate ${activeClient?.id === c.id ? 'text-blue-600' : 'text-gray-500'}`}>
                                        {c.last_message || 'No messages'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col bg-gray-50/30">
                {activeClient ? (
                    <>
                        <div className="p-4 border-b border-gray-100 bg-white flex items-center justify-between">
                            <h3 className="font-bold text-gray-900">{activeClient.name}</h3>
                            <span className="text-xs text-gray-400">{activeClient.email}</span>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {messages.map((msg, i) => {
                                const isMe = msg.sender_id === user.id
                                return (
                                    <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
                                        className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[75%] rounded-2xl px-4 py-3 ${isMe ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-900'}`}>
                                            <p className="text-sm">{msg.text}</p>
                                            <div className={`text-[10px] mt-1 text-right ${isMe ? 'text-blue-200' : 'text-gray-400'}`}>
                                                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                    </motion.div>
                                )
                            })}
                            <div ref={bottomRef} />
                        </div>

                        <form onSubmit={sendMessage} className="p-4 bg-white border-t border-gray-100 flex gap-2">
                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Type a reply..."
                                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                            />
                            <button type="submit" className="btn-primary !px-4"><HiOutlinePaperAirplane className="w-5 h-5 rotate-90" /></button>
                        </form>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-400">Select a conversation</div>
                )}
            </div>
        </div>
    )
}
