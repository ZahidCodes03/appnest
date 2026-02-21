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
    services_detailed: {
        websites: 'We build custom, responsive websites with cutting-edge technologies for maximum performance, ensuring they look great on all devices.',
        apps: 'We develop native & cross-platform mobile apps for Android & iOS with intuitive user experiences and high performance.',
        uiux: 'Our team creates beautiful, user-centered UI/UX designs that drive engagement and increase conversion rates.',
        ecommerce: 'We specialize in scalable online stores with secure payment integration, inventory management, and smooth checkout flows.',
        custom_software: 'We provide tailored software solutions (Custom Web Applications) to automate and streamline your business operations.',
        redesign: 'We offer redesign services to modernize your existing digital presence, improving performance and user experience.'
    },
    tech_stack: {
        frontend: 'React, Next.js, Tailwind CSS, Framer Motion',
        backend: 'Node.js, Express, PostgreSQL, Supabase',
        mobile: 'React Native, Flutter',
        security: 'Industry-standard security (SSL), secure API endpoints, and optimized performance for all digital products.',
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
        changes: 'Yes, we use an agile process that comfortably allows for feedback and adjustments during development.'
    },
    support: {
        after_delivery: 'We provide free post-launch support (1-6 months based on package) to ensure everything runs perfectly.',
        maintenance: 'Yes, we offer monthly maintenance plans to keep your product secure, updated, and performing optimally.',
        future_updates: 'All our solutions are scalable, making it easy to add features or update content as your business evolves.'
    },
    trust: {
        portfolio: "We've delivered 50+ successful projects! You can explore them in our Portfolio section. We've worked with Healthcare, E-Commerce, Startups, and more.",
        why_choose_us: 'Choose AppNest for fast delivery, modern premium designs, secure coding, and long-term technical partnership.',
        testimonials: 'Our clients have consistently rated us 5.0/5.0 stars! With over 30+ happy clients, we are proud of our reputation for excellence, transparency, and high-performance delivery.'
    },
    contact: {
        email: 'zahidqureshi1003@gmail.com',
        phone: '+91 6006642157',
        hours: 'Mon-Sat: 10AM - 7PM IST',
        location: 'Handwara, Jammu & Kashmir',
        international: 'Yes, we work with clients globally (US, UK, Middle East, etc.).'
    },
    founder: {
        name: 'Zahid Qureshi',
        role: 'Lead Developer & Founder',
        bio: 'He is a visionary full-stack developer and the driving force behind AppNest Technologies. With deep expertise in modern web and mobile architectures, he specializes in building high-performance, scalable digital solutions that solve real-world business problems.',
        philosophy: 'His philosophy is built on three pillars: technical excellence, user-centric design, and absolute transparency. He believes that technology should be a tool for empowerment, not just a service.',
        achievements: 'He has successfully led the development of 50+ digital products, ranging from complex enterprise systems to high-conversion eCommerce platforms.'
    },
    about: 'AppNest Technologies Pvt. Ltd is a modern software agency specializing in web development, mobile app development, and digital solutions. Our team of skilled developers and designers is passionate about building software that makes a difference.',
    mission: 'Our mission is to deliver innovative digital solutions that help businesses grow and thrive in the digital age through Quality, Innovation, Transparency, and Long-term Partnership.',
    insights: 'Our Latest Insights section features deep-dives into modern technology, industry trends, and business growth strategies. We regularly publish articles on Web Development, AI, and Digital Transformation to help our clients stay ahead.',
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
            text: "Welcome to AppNest Technologies. 👋I am your virtual assistant, here to assist you with our premium web and software development services. How may I help you today?",
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

        // 🔹 1. General / Greeting
        if (lowerText.includes('who are you') || lowerText.includes('your name')) {
            return "I am the AppNest AI Assistant, your first point of contact for anything related to premium web and mobile development. How can I guide you today?"
        }
        if (lowerText.includes('what is appnest') || lowerText.includes('about the company') || lowerText.includes('appnest summary')) {
            return `${WEBSITE_KNOWLEDGE.about} We combine creativity with cutting-edge technology to deliver products that drive real results.`
        }
        if (lowerText.includes('mission') || lowerText.includes('vision') || lowerText.includes('goal')) {
            return WEBSITE_KNOWLEDGE.mission
        }
        if (lowerText.includes('how can you help') || lowerText.includes('help my business')) {
            return WEBSITE_KNOWLEDGE.general.how_we_help
        }
        if (lowerText.includes('how to start') || lowerText.includes('get started')) {
            return WEBSITE_KNOWLEDGE.general.get_started
        }
        if (lowerText.includes('available') || lowerText.includes('new project')) {
            return WEBSITE_KNOWLEDGE.general.availability
        }

        // 🔹 1.5. Comprehensive Overview
        if (lowerText.includes('everything') || lowerText.includes('all details') || lowerText.includes('complete info') || lowerText.includes('tell me all')) {
            return `Here is a comprehensive overview of AppNest Technologies:

🚀 **Core Services**: We specialize in Premium Web Development, Mobile Apps (iOS/Android), UI/UX Design, and Custom Business Software.

💰 **Pricing**: Our packages range from ₹15,000 (Basic) to ₹35,000 (Business), with custom quoting for advanced apps and software.

🛠️ **Project Process**: We follow a disciplined 6-step roadmap—from Free Consultation to Launch and Ongoing Support—ensuring 100% project success.

🛡️ **Technology & Security**: We use modern stacks like React, Node.js, and Supabase, with a heavy focus on SEO and high-level data security.

Would you like to deep-dive into any of these specific areas, or shall we connect you with our lead developer for a custom quote?`
        }

        // 🔹 2. Services-Related
        if (lowerText.includes('service') || lowerText.includes('offer') || lowerText.includes('what do you do') || lowerText.includes('what you provide')) {
            return `AppNest Technologies provides exhaustive digital solutions:
- **Website Development**: ${WEBSITE_KNOWLEDGE.services_detailed.websites}
- **Mobile App Development**: ${WEBSITE_KNOWLEDGE.services_detailed.apps}
- **UI/UX Design**: ${WEBSITE_KNOWLEDGE.services_detailed.uiux}
- **E-Commerce Solutions**: ${WEBSITE_KNOWLEDGE.services_detailed.ecommerce}
- **Custom Software/Web Apps**: ${WEBSITE_KNOWLEDGE.services_detailed.custom_software}
- **Digital Modernization (Redesign)**: ${WEBSITE_KNOWLEDGE.services_detailed.redesign}

Which of these services can we help you with today?`
        }
        if (lowerText.includes('build website') || lowerText.includes('web development') || lowerText.includes('make website')) {
            return WEBSITE_KNOWLEDGE.services_detailed.websites
        }
        if (lowerText.includes('mobile app') || lowerText.includes('develop app') || lowerText.includes('android') || lowerText.includes('ios')) {
            return WEBSITE_KNOWLEDGE.services_detailed.apps
        }
        if (lowerText.includes('ui/ux') || lowerText.includes('design') || lowerText.includes('look and feel')) {
            return WEBSITE_KNOWLEDGE.services_detailed.uiux
        }
        if (lowerText.includes('ecommerce') || lowerText.includes('online store') || lowerText.includes('e-commerce')) {
            return WEBSITE_KNOWLEDGE.services_detailed.ecommerce
        }
        if (lowerText.includes('custom software') || lowerText.includes('automation') || lowerText.includes('crm')) {
            return WEBSITE_KNOWLEDGE.services_detailed.custom_software
        }
        if (lowerText.includes('redesign') || lowerText.includes('modernize') || lowerText.includes('update')) {
            return WEBSITE_KNOWLEDGE.services_detailed.redesign
        }

        // 🔹 3. Pricing & Packages
        if (lowerText.includes('cost') || lowerText.includes('how much') || lowerText.includes('charge') || lowerText.includes('pricing') || lowerText.includes('price') || lowerText.includes('package')) {
            return `Here are our exact pricing packages:

1. **Basic Website (${WEBSITE_KNOWLEDGE.pricing[0].price})**:
   Features: ${WEBSITE_KNOWLEDGE.pricing[0].features}

2. **Business Website (${WEBSITE_KNOWLEDGE.pricing[1].price})**:
   Features: ${WEBSITE_KNOWLEDGE.pricing[1].features}

3. **App Development (${WEBSITE_KNOWLEDGE.pricing[2].price})**:
   Includes: ${WEBSITE_KNOWLEDGE.pricing[2].features}

All packages include a free consultation and project roadmap. Would you like to discuss a custom quote for your specific needs?`
        }

        // 🔹 4. Project Process & Time
        if (lowerText.includes('process') || lowerText.includes('how you work')) {
            return `Our 6-step process:
${WEBSITE_KNOWLEDGE.process_detailed.steps.join('\n')}
${WEBSITE_KNOWLEDGE.process_detailed.updates}`
        }
        if (lowerText.includes('how long') || lowerText.includes('timeframe') || lowerText.includes('duration')) {
            return WEBSITE_KNOWLEDGE.process_detailed.timeframe
        }
        if (lowerText.includes('information do you need') || lowerText.includes('to start')) {
            return WEBSITE_KNOWLEDGE.process_detailed.info_needed
        }
        if (lowerText.includes('request changes') || lowerText.includes('can i change')) {
            return WEBSITE_KNOWLEDGE.process_detailed.changes
        }

        // 🔹 5. Technical Questions
        if (lowerText.includes('technology') || lowerText.includes('framework') || lowerText.includes('react')) {
            return `We use the latest tech stacks: 
- Web: ${WEBSITE_KNOWLEDGE.tech_stack.frontend} & ${WEBSITE_KNOWLEDGE.tech_stack.backend}
- Mobile: ${WEBSITE_KNOWLEDGE.tech_stack.mobile}`
        }
        if (lowerText.includes('mobile-friendly') || lowerText.includes('responsive')) {
            return WEBSITE_KNOWLEDGE.tech_stack.mobile_friendly
        }
        if (lowerText.includes('seo') || lowerText.includes('google ranking')) {
            return `Yes, we provide search engine optimization. ${WEBSITE_KNOWLEDGE.tech_stack.mobile_friendly}`
        }
        if (lowerText.includes('secure') || lowerText.includes('security')) {
            return WEBSITE_KNOWLEDGE.tech_stack.security
        }

        // 🔹 6. Support & Maintenance
        if (lowerText.includes('support') || lowerText.includes('after delivery')) {
            return WEBSITE_KNOWLEDGE.support.after_delivery
        }
        if (lowerText.includes('maintenance')) {
            return WEBSITE_KNOWLEDGE.support.maintenance
        }

        // 🔹 7. Portfolio & Trust
        if (lowerText.includes('portfolio') || lowerText.includes('previous work') || lowerText.includes('example')) {
            return WEBSITE_KNOWLEDGE.trust.portfolio
        }
        if (lowerText.includes('testimonial') || lowerText.includes('review') || lowerText.includes('client say') || lowerText.includes('what people say') || lowerText.includes('feedback')) {
            return `${WEBSITE_KNOWLEDGE.trust.testimonials} You can read specific feedback from our clients in the Testimonials section on our homepage.`
        }
        if (lowerText.includes('why choose') || lowerText.includes('why should i')) {
            return WEBSITE_KNOWLEDGE.trust.why_choose_us
        }

        // 🔹 8. Contact & Conversion
        if (lowerText.includes('contact') || lowerText.includes('phone') || lowerText.includes('email') || lowerText.includes('reach you') || lowerText.includes('call') || lowerText.includes('address') || lowerText.includes('location') || lowerText.includes('hours')) {
            return `You can connect with AppNest Technologies through multiple channels:

📧 **Email**: ${WEBSITE_KNOWLEDGE.contact.email}
📞 **Phone/WhatsApp**: ${WEBSITE_KNOWLEDGE.contact.phone}
📍 **Headquarters**: ${WEBSITE_KNOWLEDGE.contact.location}
⏰ **Business Hours**: ${WEBSITE_KNOWLEDGE.contact.hours}

We serve clients internationally (${WEBSITE_KNOWLEDGE.contact.international}). How would you prefer to connect?`
        }
        if (lowerText.includes('place an order') || lowerText.includes('buy')) {
            return "To place an order, we first need to discuss your requirements. Would you like to schedule a 5-minute consultation on WhatsApp?"
        }

        // 🔹 9. Founder / Zahid Qureshi
        if (lowerText.includes('founder') || lowerText.includes('owner') || lowerText.includes('zahid')) {
            if (lowerText.includes('who') || lowerText.includes('about') || lowerText.includes('his name')) {
                return `${WEBSITE_KNOWLEDGE.founder.name} is the ${WEBSITE_KNOWLEDGE.founder.role}. ${WEBSITE_KNOWLEDGE.founder.bio}`
            }
            if (lowerText.includes('more') || lowerText.includes('philosophy') || lowerText.includes('experience')) {
                return `Beyond being a lead developer, ${WEBSITE_KNOWLEDGE.founder.philosophy} ${WEBSITE_KNOWLEDGE.founder.achievements}`
            }
            return `${WEBSITE_KNOWLEDGE.founder.name} is our founder and lead developer. Would you like to know more about his background or philosophy?`
        }
        if (lowerText.includes('developer') || lowerText.includes('developed') || lowerText.includes('who made you')) {
            return `I was engineered by the team at AppNest Technologies, led by our founder, ${WEBSITE_KNOWLEDGE.founder.name}.`
        }

        // 🔹 9.5. Insights / Blog
        if (lowerText.includes('insight') || lowerText.includes('blog') || lowerText.includes('article') || lowerText.includes('news')) {
            if (currentBlogs && currentBlogs.length > 0) {
                const blogList = currentBlogs.map(b => `• **${b.title}**: ${b.excerpt}`).join('\n\n')
                return `Here are our latest insights from the blog:\n\n${blogList}\n\nYou can explore all our latest articles in the "Latest Insights" section on our homepage.`
            }
            return `${WEBSITE_KNOWLEDGE.insights} You can explore all our latest articles in the "Latest Insights" section on our homepage.`
        }

        // 🔹 10. Negative Responses / Rejections
        if (lowerText === 'no' || lowerText.includes('no thank') || lowerText.includes('not now') || lowerText.includes('maybe later') || lowerText.includes('not interested')) {
            return "Understood. We respect your time! If you have any further questions or decide to move forward with a project in the future, we're always here to help. Have a productive day!"
        }
        if (lowerText.includes('stop') || lowerText.includes('bye') || lowerText.includes('that is all') || lowerText.includes('nothing else')) {
            return "Thank you for chatting with AppNest! It was a pleasure providing you with information. We look forward to the possibility of working with you soon. Goodbye!"
        }

        // 🔹 11. Affirmative & Gratitude
        if (lowerText === 'yes' || lowerText === 'yeah' || lowerText === 'sure' || lowerText.includes('definitely')) {
            const lastBotMsg = history.filter(m => m.sender === 'bot').pop()?.text
            if (lastBotMsg && lastBotMsg.includes('Would you like to know more about his background or philosophy?')) {
                return `Beyond being a lead developer, ${WEBSITE_KNOWLEDGE.founder.philosophy} ${WEBSITE_KNOWLEDGE.founder.achievements}`
            }
            return "Excellent. To provide the most relevant assistance, would you like to explore our specific service packages, or would you prefer a direct consultation with our lead developer on WhatsApp?"
        }
        if (lowerText.includes('thank you') || lowerText.includes('thanks') || lowerText.includes('thankyou') || lowerText.includes('thx')) {
            return "You are most welcome. It is our priority at AppNest to provide clear, actionable information. Is there anything else I can clarify for you today?"
        }
        if (lowerText.includes('my pleasure') || lowerText.includes('welcome') || lowerText.includes('meet you') || lowerText.includes('nice chatting')) {
            return "The pleasure is ours! We value professional communication as much as we value high-quality development. Please let me know if you require any further assistance."
        }

        if (lowerText.includes('hello') || lowerText.includes('hi') || lowerText.includes('hey') || lowerText.includes('greetings')) {
            return "Thank you for reaching out to AppNest Technologies. I am here to provide you with comprehensive information regarding our high-performance web and mobile solutions. How can I facilitate your project goals today?"
        }

        if (lowerText.includes('good morning') || lowerText.includes('good afternoon') || lowerText.includes('good evening')) {
            return `Good ${lowerText.includes('morning') ? 'morning' : lowerText.includes('afternoon') ? 'afternoon' : 'evening'}! It is a pleasure to assist you. Are you interested in exploring our service packages or discussing a custom project?`
        }

        return "That's an insightful question. To provide the most accurate answer regarding your specific project needs, I recommend a quick consultation with our lead specialist. Would you like to connect now?"
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
