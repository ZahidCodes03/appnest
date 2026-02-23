import { useState, useEffect, useRef } from 'react'
import { FaWhatsapp, FaTimes, FaPaperPlane } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../lib/api'

const WEBSITE_KNOWLEDGE = {
    general: {
        who_we_are: 'AppNest Technologies Pvt. Ltd is a modern software agency founded with a vision to empower businesses through technology. We specialize in web development, mobile app development, and digital solutions that drive real business results.',
        how_we_help: 'We combine creativity with cutting-edge technology to deliver digital products that not only look stunning but also help businesses grow and thrive in the digital age.',
        get_started: "Getting started is easy! You can share your project details here, or click the 'Talk to Specialist' button to schedule a free consultation with our team.",
        availability: "Yes! We are currently accepting new projects. Whether it's a small website or a complex enterprise app, we're ready to build it for you."
    },
    pricing: [
        { name: 'Basic Website', price: '₹15,000', features: '5 Pages Responsive Website, Contact Form, SEO Optimized, Mobile Friendly, 1 Month Free Support, SSL Certificate' },
        { name: 'Business Website', price: '₹35,000', features: '10+ Pages Dynamic Website, Admin Panel, Advanced SEO, Blog Integration, Social Media Integration, 3 Months Free Support, SSL + Analytics' },
        { name: 'App Development', price: 'Custom Quote', features: 'Android & iOS App, Custom UI/UX Design, Backend API Development, Push Notifications, Payment Integration, 6 Months Support, App Store Deployment' }
    ],
    financial: {
        methods: 'We accept Bank Transfers, UPI (GPay, PhonePe, Paytm), and major Credit/Debit cards for your convenience.',
        installments: 'Yes, we typically offer a 50:50 payment structure—50% advance to start and 50% upon completion. For larger projects, we can break it into smaller monthly milestones.',
        discounts: 'We value long-term partnerships! We offer special discounts for startups on their first project and for non-profits working for a cause.',
        refunds: 'If we haven’t started your project yet, we offer a full refund. Once development begins, we work closely with you via revisions to ensure 100% satisfaction.'
    },
    services_detailed: {
        websites: 'We build custom, responsive websites with cutting-edge technologies for maximum performance, ensuring they look great on all devices.',
        apps: 'We develop native & cross-platform mobile apps for Android & iOS with intuitive user experiences and high performance.',
        uiux: 'Our team creates beautiful, user-centered UI/UX designs that drive engagement and increase conversion rates.',
        ecommerce: 'We specialize in scalable online stores with secure payment integration, inventory management, and smooth checkout flows.',
        custom_software: 'We provide tailored software solutions (Custom Web Applications) to automate and streamline your business operations.',
        redesign: 'We offer redesign services to modernize your existing digital presence, improving performance and user experience.',
        seo: 'Every site we build is SEO-optimized from day one, including fast loading speeds and proper meta tagging to help you rank on Google.',
        branding: 'Yes, we offer full branding services including modern logo design, color palettes, and brand identity guidelines.'
    },
    tech_stack: {
        frontend: 'React, Next.js, Tailwind CSS, Framer Motion',
        backend: 'Node.js, Express, PostgreSQL, Supabase',
        mobile: 'React Native, Flutter',
        security: 'We use industry-standard encryption (SSL), secure API endpoints, and sanitized database queries to keep your data 100% safe.',
        mobile_friendly: 'Yes, every product we build is 100% mobile-friendly and responsive across all screen sizes.'
    },
    process_detailed: {
        steps: [
            '1. Free Consultation: Understanding goals.',
            '2. Planning & Design: Wireframes & roadmap.',
            '3. Development: Agile build with updates.',
            '4. Testing: Thorough QA across devices.',
            '5. Launch: Deployment & go-live.',
            '6. Support & Updates: Ongoing maintenance.'
        ],
        timeframe: 'Basic websites typically ship in 1-2 weeks. Complex web applications or mobile apps take 4-12 weeks based on feature set.',
        info_needed: 'To start, we need your project goals, design preferences, and a brief list of required features.',
        updates: 'We provide regular updates and a live demo link so you can monitor progress in real-time.',
        changes: 'Yes, we use an agile process that comfortably allows for feedback and adjustments during development.',
        revisions: 'We include unlimited minor revisions during the design phase and up to 3 major iterations during development to ensure it’s perfect.'
    },
    support: {
        after_delivery: 'We provide free post-launch support (1-6 months based on package) to ensure everything runs perfectly.',
        maintenance: 'Yes, we offer monthly maintenance plans to keep your product secure, updated, and performing optimally.',
        hosting_domain: 'We can handle everything! We provide premium hosting and help you register the perfect domain for your brand.'
    },
    legal: {
        ownership: '100% Yes! Once the final payment is cleared, you own the full source code and all intellectual property rights.',
        contracts: 'We believe in professionalism. We sign formal service agreements and NDAs (Non-Disclosure Agreements) to protect your ideas.',
        safety: 'Your data safety is our priority. We use secure servers and follow best practices for data privacy.'
    },
    collaboration: {
        simplicity: 'We speak human, not just code! We take pride in explaining technical concepts in simple, everyday terms so you’re always in the loop.',
        no_tech_knowledge: 'Not a problem at all! Most of our successful clients aren’t technical. We guide you through everything—from choosing the right platform to launching your product.',
        ideas: 'We love brainstorming! We don’t just build what you ask; we suggest ideas to improve user retention and business growth.'
    },
    career: {
        hiring: 'We are always looking for passionate talent! You can send your portfolio to careers@appnest.in.',
        internships: 'Yes, we offer paid internships for aspiring developers and designers who want to work on real-world projects.',
        partnerships: 'We love collaborating with other agencies and freelancers. Feel free to reach out to discuss a partnership.'
    },
    trust: {
        portfolio: "We've delivered 50+ successful projects! You can explore them in our Portfolio section. We've worked with Healthcare, E-Commerce, Startups, and more.",
        why_choose_us: 'Choose AppNest for fast delivery, modern premium designs, secure coding, and long-term technical partnership.',
        testimonials: 'Our clients have consistently rated us 5.0/5.0 stars! With over 30+ happy clients, we are proud of our reputation for excellence.'
    },
    founder: {
        name: 'Zahid Qureshi',
        role: 'Lead Developer & Founder',
        bio: 'He is a visionary full-stack developer specializing in high-performance architectures.',
        philosophy: 'Technical excellence, user-centric design, and absolute transparency.'
    },
    contact: {
        email: 'info@appnest.in',
        phone: '+91 60066 42157',
        location: 'Global (HQ in India)',
        hours: 'Mon-Sat, 9 AM - 7 PM IST'
    },
    about: 'AppNest Technologies is a premier software agency specializing in web development, mobile app development, and bespoke digital solutions.',
    mission: 'To empower businesses through innovative technology, delivering high-performance products that drive growth.',
    vision: 'To be the most trusted global technology partner, known for excellence and innovation.',
    industries: ['Healthcare', 'Education', 'E-Commerce', 'Real Estate', 'Solar & Energy', 'Startups']
}

export default function WhatsAppButton() {
    const [isOpen, setIsOpen] = useState(false)
    const [isAtFooter, setIsAtFooter] = useState(false)
    const [inputValue, setInputValue] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const [blogs, setBlogs] = useState([])
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "Hello! 👋 I'm the official AI assistant for AppNest Technologies. I'm here to help you explore our web and mobile development services. How can I assist you today?",
            sender: 'bot',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
    ])
    const chatEndRef = useRef(null)

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        if (isOpen) scrollToBottom()
    }, [messages, isTyping, isOpen])

    useEffect(() => {
        const handleScroll = () => {
            const windowHeight = window.innerHeight
            const documentHeight = document.documentElement.scrollHeight
            const scrollY = window.scrollY
            if (windowHeight + scrollY >= documentHeight - 150) setIsAtFooter(true)
            else setIsAtFooter(false)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const { data } = await api.get('/blogs')
                setBlogs(data.slice(0, 3))
            } catch (error) {
                console.error('Failed to fetch blogs for chatbot', error)
            }
        }
        fetchBlogs()
    }, [])

    const getBotResponse = (text, history = [], currentBlogs = []) => {
        const lowerText = text.toLowerCase()
        
        // Helper to detect casual tone
        const isCasual = lowerText.match(/\b(hi|hello|hey|yo|sup|what's up|how's it going|how are you|thanks|thank you|good morning|good evening)\b/)

        // CORE BEHAVIOR: Conversational Phrases
        const fillers = ["Sure, I can help with that!", "Great question!", "Happy to assist you with that 😊", "That's an excellent point.", "I'd be glad to explain that for you."]
        const getRandomFiller = () => fillers[Math.floor(Math.random() * fillers.length)]

        // 🔹 1. Identity & Persona
        if (lowerText.includes('your name') || lowerText.includes('who are you')) {
            return `I am the official AI assistant of AppNest Technologies. I represent our company to provide accurate, helpful, and professional guidance about our services. ${isCasual ? "You can just think of me as your friendly digital guide! 😊" : "I am here to ensure you have all the information needed to make informed decisions about your digital projects."}`
        }
        if (lowerText.includes('real person') || lowerText.includes('bot') || lowerText.includes('human')) {
            return "I am an intelligent AI assistant representation of AppNest. While I'm powered by advanced technology to assist you 24/7, our lead developers and specialists are always available for more complex technical discussions or project kick-offs."
        }

        // 🔹 2. Website Knowledge - Business Related
        if (lowerText.includes('service') || lowerText.includes('offer') || lowerText.includes('what can you do')) {
            return `${getRandomFiller()} We specialize in:
• Custom Web Development (React, Next.js)
• Mobile App Development (Android & iOS)
• UI/UX Strategy & Design
• E-Commerce Solutions
• Custom Business Software & Dashboards
Every solution we build is tailored specifically to your business goals.`
        }

        if (lowerText.includes('about appnest') || lowerText.includes('tell me about') || lowerText.includes('company')) {
            return `${WEBSITE_KNOWLEDGE.about} ${WEBSITE_KNOWLEDGE.mission} We take pride in our commitment to quality and innovation.`
        }

        if (lowerText.includes('pricing') || lowerText.includes('cost') || lowerText.includes('how much') || lowerText.includes('charge')) {
            const pricingInfo = WEBSITE_KNOWLEDGE.pricing.map(p => `• ${p.name}: Starting at ${p.price}`).join('\n')
            return `We offer competitive and transparent pricing based on the value we deliver. 
${pricingInfo}
For larger or more complex enterprise projects, we provide custom quotes after a detailed consultation to understand your specific needs.`
        }

        if (lowerText.includes('tech stack') || lowerText.includes('technology') || lowerText.includes('what do you use')) {
            return `At AppNest, we use industry-leading tech to build high-performance products:
• Frontend: ${WEBSITE_KNOWLEDGE.tech_stack.frontend}
• Backend: ${WEBSITE_KNOWLEDGE.tech_stack.backend}
• Mobile: ${WEBSITE_KNOWLEDGE.tech_stack.mobile}
This ensures your product is fast, secure, and scalable.`
        }

        if (lowerText.includes('portfolio') || lowerText.includes('previous work') || lowerText.includes('examples')) {
            return `We have a proven track record with over 50+ successful projects. ${WEBSITE_KNOWLEDGE.trust.portfolio} You can view our detailed case studies in the Portfolio section of this website!`
        }

        if (lowerText.includes('location') || lowerText.includes('where are you') || lowerText.includes('address')) {
            return `Our primary operations are ${WEBSITE_KNOWLEDGE.contact.location}. However, we operate as a global agency providing top-tier digital solutions to clients worldwide through seamless remote collaboration.`
        }

        if (lowerText.includes('contact') || lowerText.includes('email') || lowerText.includes('phone') || lowerText.includes('reach you')) {
            return `You can reach us through any of these channels:
• Email: ${WEBSITE_KNOWLEDGE.contact.email}
• WhatsApp/Phone: ${WEBSITE_KNOWLEDGE.contact.phone}
Our core hours are ${WEBSITE_KNOWLEDGE.contact.hours}, but I'm here 24/7 to assist!`
        }

        // 🔹 3. Human-Like Interaction & Tone Adaptation
        if (lowerText.includes('how are you') || lowerText.includes('how\'s it going')) {
            return "I'm doing great, thank you for asking! I'm ready to help you build something extraordinary. How's your day going? 😊"
        }

        if (lowerText.includes('hi') || lowerText.includes('hello') || lowerText.includes('hey')) {
            return `Hey there! 👋 Happy to see you. I'm the AppNest AI assistant—how can I help you today? Whether it's a new project idea or just some questions about our tech, I'm all ears!`
        }

        if (lowerText.includes('thank you') || lowerText.includes('thanks')) {
            return "You're very welcome! It's my pleasure to help. If you need anything else, feel free to ask."
        }

        if (lowerText.includes('sorry') || lowerText.includes('issue') || lowerText.includes('problem')) {
            return "I understand. Let me guide you through this—showing empathy and providing solutions is what we're here for. How can I specifically assist in resolving this for you?"
        }

        // 🔹 4. Problem Solving & Next Steps
        if (lowerText.includes('start') || lowerText.includes('hiring') || lowerText.includes('consultation')) {
            return `${getRandomFiller()} To get started, you can share your project details right here, or we can schedule a free consultation with our lead developer Zahi. Would you like to connect on WhatsApp for a quicker discussion?`
        }

        // 🔹 5. Limitations Handling & Fallback
        // specific generic fallback as requested
        const genericBusinessKeywords = ['web', 'app', 'design', 'seo', 'software', 'dev', 'code', 'pricing', 'timeline', 'process', 'support']
        const isBusinessQuery = genericBusinessKeywords.some(k => lowerText.includes(k))

        if (isBusinessQuery) {
            return "That's a great question about our business services. To give you the most accurate details tailored to your project, I'd recommend a quick chat with our specialist. I don't have that specific information right now, but I'd be happy to help you find it or connect you with the team! 😊"
        }

        return "I don't have that information right now, but I'd be happy to help you find it. Since every project is unique, would you like to speak with one of our human experts to discuss your specific requirements?"
    }

    const handleSendMessage = (e) => {
        e.preventDefault()
        if (!inputValue.trim()) return

        const userMsg = {
            id: Date.now(),
            text: inputValue,
            sender: 'user',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }

        setMessages(prev => [...prev, userMsg])
        const currentInput = inputValue
        setInputValue('')
        setIsTyping(true)

        setTimeout(() => {
            const botMsg = {
                id: Date.now() + 1,
                text: getBotResponse(currentInput, messages, blogs),
                sender: 'bot',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
            setMessages(prev => [...prev, botMsg])
            setIsTyping(false)
        }, 1200)
    }

    const handleWhatsAppRedirect = () => {
        const lastUserMsg = [...messages].reverse().find(m => m.sender === 'user')?.text || 'Hi AppNest, I need help with a project'
        const encodedMessage = encodeURIComponent(lastUserMsg)
        window.open(`https://wa.me/916006642157?text=${encodedMessage}`, '_blank')
    }

    return (
        <div className={`fixed ${isAtFooter ? 'bottom-24' : 'bottom-6'} right-6 z-50 flex flex-col items-end gap-4`}>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20, transformOrigin: 'bottom right' }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        className="w-[320px] sm:w-[400px] bg-white/95 backdrop-blur-xl rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden border border-white/40 flex flex-col mb-2 h-[500px]"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-5 text-white flex items-center justify-between shadow-lg relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full translate-x-8 -translate-y-8 blur-2xl" />
                            <div className="flex items-center gap-3 relative z-10">
                                <div className="relative">
                                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-green-600 font-extrabold text-lg shadow-inner rotate-3 hover:rotate-0 transition-transform cursor-pointer">
                                        AN
                                    </div>
                                    <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full animate-pulse shadow-sm" />
                                </div>
                                <div className="flex flex-col">
                                    <h3 className="font-bold text-base leading-tight">AppNest Support</h3>
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 bg-green-200 rounded-full animate-ping" />
                                        <span className="text-[11px] font-medium opacity-90">Online & Ready</span>
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/20 rounded-xl transition-colors backdrop-blur-sm"><FaTimes /></button>
                        </div>

                        {/* Body */}
                        <div className="flex-1 p-5 bg-[#f8faf9] overflow-y-auto custom-scrollbar flex flex-col gap-4">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} max-w-full`}>
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm break-words ${msg.sender === 'user'
                                            ? 'bg-green-500 text-white rounded-tr-none shadow-green-500/10'
                                            : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                                            }`}
                                    >
                                        <p className="whitespace-pre-wrap">{msg.text}</p>
                                        <span className={`text-[10px] mt-2 block font-medium ${msg.sender === 'user' ? 'text-green-100' : 'text-gray-400'}`}>{msg.time}</span>
                                    </motion.div>
                                </div>
                            ))}

                            {isTyping && (
                                <div className="flex items-start">
                                    <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm flex items-center gap-1.5">
                                        <span className="w-2 h-2 bg-green-400 rounded-full animate-bounce" />
                                        <span className="w-2 h-2 bg-green-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                                        <span className="w-2 h-2 bg-green-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                                    </div>
                                </div>
                            )}

                            {(messages.length > 2 || messages.some(m => m.text.includes('specialist'))) && !isTyping && (
                                <motion.button
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    onClick={handleWhatsAppRedirect}
                                    className="w-full mt-2 py-3.5 bg-green-500 text-white rounded-2xl text-sm font-bold hover:bg-green-600 transition-all flex items-center justify-center gap-2.5 shadow-lg shadow-green-500/20 active:scale-95"
                                >
                                    <FaWhatsapp className="text-xl" />
                                    Talk to Specialist
                                </motion.button>
                            )}
                            <div ref={chatEndRef} />
                        </div>

                        {/* Footer / Input */}
                        <form onSubmit={handleSendMessage} className="p-5 bg-white border-t border-gray-100 flex items-center gap-3">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Write your message..."
                                className="flex-1 bg-gray-100/80 border-none rounded-2xl px-5 py-3.5 text-sm focus:ring-2 focus:ring-green-500 transition-all outline-none text-gray-800 placeholder:text-gray-400"
                            />
                            <button
                                type="submit"
                                disabled={!inputValue.trim() || isTyping}
                                className="bg-green-500 text-white p-3.5 rounded-2xl hover:bg-green-600 disabled:opacity-40 disabled:hover:bg-green-500 transition-all shadow-lg shadow-green-500/20 active:scale-90"
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
                transition={{ delay: 0.5, type: 'spring', damping: 15 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.9 }}
                className="flex items-center gap-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 rounded-[2rem] shadow-2xl shadow-green-500/30 hover:shadow-green-500/40 transition-all duration-300 group relative z-10 border border-white/20"
                aria-label="Toggle WhatsApp Chat"
            >
                <motion.div animate={{ rotate: isOpen ? 90 : 0 }} transition={{ type: 'spring', stiffness: 200 }}>
                    {isOpen ? <FaTimes className="text-2xl" /> : <FaWhatsapp className="text-2xl" />}
                </motion.div>
                {!isOpen && <span className="text-base font-bold tracking-tight">Need Help?</span>}
                {!isOpen && <span className="absolute inset-0 rounded-[2rem] bg-green-400 animate-ping opacity-20" />}
            </motion.button>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 5px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 20px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
            `}</style>
        </div>
    )
}
