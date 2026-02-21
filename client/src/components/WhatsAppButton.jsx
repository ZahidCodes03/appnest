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
    about: 'AppNest Technologies Pvt. Ltd is a modern software agency specializing in web development, mobile app development, and digital solutions.',
    mission: 'To deliver innovative digital solutions that help businesses grow and thrive in the digital age through Quality and Innovation.',
    vision: 'To be the most trusted technology partner globally, known for building products that make a real difference.',
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

        // 🔹 1. Identity & Name
        if (lowerText.includes('your name')) {
            return "I'm the AppNest AI Assistant, your digital guide to extraordinary software solutions! I don't have a human name, but you can call me AP."
        }
        if (lowerText.includes('who are you')) {
            return "I am the official virtual assistant for AppNest Technologies. I'm here to answer your questions about our services, pricing, and how we can help your business grow."
        }
        if (lowerText.includes('real person') || lowerText.includes('bot') || lowerText.includes('human')) {
            return "I'm an advanced AI assistant built by the AppNest team. I'm available 24/7 to help you, but if you'd like to talk to a real person, our lead developer Zahid is just a WhatsApp click away!"
        }

        // 🔹 2. Capabilities & Services
        if (lowerText.includes('what can you do') || lowerText.includes('how can you help')) {
            return "We help businesses succeed by building premium digital products. I can tell you about our web development, mobile apps, UI/UX design, SEO services, and custom business software."
        }
        if (lowerText.includes('service') || lowerText.includes('offer')) {
            return `We offer a wide range of premium services:
• Custom Web Development
• Mobile App Development (iOS/Android)
• UI/UX Strategy & Design
• E-Commerce Solutions
• Custom Business Dashboards & CRM
• SEO & Performance Optimization
• Branding & Logo Design`
        }
        if (lowerText.includes('about your company') || lowerText.includes('tell me about appnest')) {
            return WEBSITE_KNOWLEDGE.about + " " + WEBSITE_KNOWLEDGE.mission
        }
        if (lowerText.includes('location') || lowerText.includes('where are you')) {
            return `Our headquarters is in ${WEBSITE_KNOWLEDGE.contact.location}, but we operate as a global agency.`
        }
        if (lowerText.includes('international') || lowerText.includes('globally')) {
            return "Absolutely! We work with clients all over the world, including the US, UK, Middle East, and Europe. Our process is designed for seamless remote collaboration."
        }
        if (lowerText.includes('how experienced') || lowerText.includes('experience')) {
            return "We have successfully delivered over 50+ high-performance projects across various industries. Our founder and lead developer, Zahid, has years of deep technical expertise."
        }
        if (lowerText.includes('who is behind') || lowerText.includes('founder') || lowerText.includes('zahid')) {
            return `AppNest was founded by ${WEBSITE_KNOWLEDGE.founder.name}. ${WEBSITE_KNOWLEDGE.founder.bio}`
        }

        // 🔹 3. Differentiation & Choice
        if (lowerText.includes('different') || lowerText.includes('why choose') || lowerText.includes('advantage')) {
            return "What makes us different is our commitment to 'extraordinary'. We don't just write code; we build ROI-driven products with premium aesthetics, secure architecture, and a partnership mindset."
        }

        // 🔹 4. Trust & Experience
        if (lowerText.includes('portfolio') || lowerText.includes('previous work') || lowerText.includes('examples')) {
            return `${WEBSITE_KNOWLEDGE.trust.portfolio} You can see them right now in the Portfolio section on our homepage.`
        }
        if (lowerText.includes('worked with clients') || lowerText.includes('happy clients')) {
            return "Yes, we've worked with over 30+ happy clients globally. From small startups to established businesses, our focus is always on quality."
        }
        if (lowerText.includes('industries')) {
            return `We have extensive experience in: ${WEBSITE_KNOWLEDGE.industries.join(', ')}. We love learning about new industries too!`
        }
        if (lowerText.includes('startup')) {
            return "We love working with startups! We understand the need for speed and scalability, and we offer special consultation to help you choose the right MVP features."
        }
        if (lowerText.includes('large project') || lowerText.includes('complex')) {
            return "Yes, we handle large enterprise projects using scalable architectures like microservices and robust database systems. We excel at complexity!"
        }

        // 🔹 5. Technology & Stack
        if (lowerText.includes('technology') || lowerText.includes('tech stack')) {
            return `We use the most modern and reliable stacks:
• Frontend: ${WEBSITE_KNOWLEDGE.tech_stack.frontend}
• Backend: ${WEBSITE_KNOWLEDGE.tech_stack.backend}
• Mobile: ${WEBSITE_KNOWLEDGE.tech_stack.mobile}`
        }
        if (lowerText.includes('react') || lowerText.includes('modern framework')) {
            return "Yes! React and Next.js are our primary tools for building fast, SEO-friendly, and modern web applications."
        }
        if (lowerText.includes('mobile app') || lowerText.includes('ios') || lowerText.includes('android')) {
            return WEBSITE_KNOWLEDGE.services_detailed.apps
        }
        if (lowerText.includes('custom website')) {
            return "Every website we build is 100% custom-coded to your specific needs. We don't believe in one-size-fits-all templates."
        }
        if (lowerText.includes('ui/ux') || lowerText.includes('design')) {
            return WEBSITE_KNOWLEDGE.services_detailed.uiux + " " + WEBSITE_KNOWLEDGE.services_detailed.branding
        }
        if (lowerText.includes('redesign')) {
            return "Yes, we can modernize your current website to improve its performance, security, and user engagement."
        }
        if (lowerText.includes('seo') || lowerText.includes('google ranking')) {
            return WEBSITE_KNOWLEDGE.services_detailed.seo
        }
        if (lowerText.includes('grow my business') || lowerText.includes('online presence')) {
            return "Absolutely! We focus on conversion-driven design and SEO to help turn your website visitors into paying customers."
        }

        // 🔹 6. Project Process
        if (lowerText.includes('how long') || lowerText.includes('timeframe')) {
            return WEBSITE_KNOWLEDGE.process_detailed.timeframe
        }
        if (lowerText.includes('process') || lowerText.includes('how you work')) {
            return `Our 6-step process ensures project success:
${WEBSITE_KNOWLEDGE.process_detailed.steps.join('\n')}`
        }
        if (lowerText.includes('how do i start') || lowerText.includes('how to start')) {
            return WEBSITE_KNOWLEDGE.general.get_started
        }
        if (lowerText.includes('free consultation')) {
            return "Yes! We offer a 100% free consultation to understand your project goals and provide a strategic roadmap."
        }
        if (lowerText.includes('revision')) {
            return WEBSITE_KNOWLEDGE.process_detailed.revisions
        }
        if (lowerText.includes('hosting') || lowerText.includes('domain')) {
            return WEBSITE_KNOWLEDGE.support.hosting_domain
        }
        if (lowerText.includes('source code') || lowerText.includes('own the code')) {
            return WEBSITE_KNOWLEDGE.legal.ownership
        }
        if (lowerText.includes('agreement') || lowerText.includes('contract') || lowerText.includes('nda')) {
            return WEBSITE_KNOWLEDGE.legal.contracts
        }
        if (lowerText.includes('test') || lowerText.includes('quality')) {
            return "Quality is our signature. We perform rigorous manual and automated testing across multiple devices before any launch."
        }

        // 🔹 7. Financial & Payments
        if (lowerText.includes('how much') || lowerText.includes('charge') || lowerText.includes('pricing') || lowerText.includes('cost')) {
            return "We have standard packages for common needs (starting at ₹15,000) and provide custom quotes for more complex apps. Which one would you like to explore?"
        }
        if (lowerText.includes('custom pricing')) {
            return "Yes, we provide tailored quotes based on your specific feature requirements and project complexity."
        }
        if (lowerText.includes('payment method')) {
            return WEBSITE_KNOWLEDGE.financial.methods
        }
        if (lowerText.includes('advance payment') || lowerText.includes('installment')) {
            return WEBSITE_KNOWLEDGE.financial.installments
        }
        if (lowerText.includes('invoice')) {
            return "Yes, we provide official invoices for all payments for your tax and record-keeping purposes."
        }
        if (lowerText.includes('budget') || lowerText.includes('low budget')) {
            return "We strive to be helpful to everyone! Share your budget, and we'll see if we can suggest a phased MVP approach that fits."
        }
        if (lowerText.includes('discount')) {
            return WEBSITE_KNOWLEDGE.financial.discounts
        }
        if (lowerText.includes('refund')) {
            return WEBSITE_KNOWLEDGE.financial.refunds
        }
        if (lowerText.includes('not satisfied')) {
            return "Satisfaction is guaranteed through our collaborative process. If you're not happy with a design, we use our iterations to make it right until it is perfect!"
        }

        // 🔹 8. Support & Safety
        if (lowerText.includes('support') || lowerText.includes('after delivery')) {
            return WEBSITE_KNOWLEDGE.support.after_delivery
        }
        if (lowerText.includes('maintenance')) {
            return WEBSITE_KNOWLEDGE.support.maintenance
        }
        if (lowerText.includes('changes later')) {
            return "Yes, our code is built to be scalable, making it easy and cost-effective to add new features or changes later."
        }
        if (lowerText.includes('emergency')) {
            return "We provide 24/7 emergency support for critical issues like site downtime for our maintenance plan subscribers."
        }
        if (lowerText.includes('contact') || lowerText.includes('reach you')) {
            return `You can reach us via:
• Email: ${WEBSITE_KNOWLEDGE.contact.email}
• WhatsApp: ${WEBSITE_KNOWLEDGE.contact.phone}
• Phone: ${WEBSITE_KNOWLEDGE.contact.phone}`
        }
        if (lowerText.includes('working hours')) {
            return `Our core hours are ${WEBSITE_KNOWLEDGE.contact.hours}, but our AI is here 24/7!`
        }
        if (lowerText.includes('how quickly') || lowerText.includes('respond')) {
            return "We typically respond to emails within 2-4 hours and WhatsApp messages within minutes during business hours."
        }
        if (lowerText.includes('meeting') || lowerText.includes('call')) {
            return "Absolutely! We can schedule a Zoom or Google Meet call to discuss your project in detail."
        }
        if (lowerText.includes('demo')) {
            return "We can provide live demos of our previous work or a clickable prototype for your specific project during the design phase."
        }
        if (lowerText.includes('track progress') || lowerText.includes('monitor')) {
            return WEBSITE_KNOWLEDGE.process_detailed.updates
        }
        if (lowerText.includes('data safe') || lowerText.includes('privacy')) {
            return WEBSITE_KNOWLEDGE.legal.safety + " " + WEBSITE_KNOWLEDGE.tech_stack.security
        }

        // 🔹 9. Feature Specifics
        if (lowerText.includes('fast-loading') || lowerText.includes('speed')) {
            return "Performance is non-negotiable for us. We optimize images, use CDN caching, and write clean code to ensure sub-second load times."
        }
        if (lowerText.includes('api integration')) {
            return "Yes, we have deep experience integrating third-party APIs like payment gateways, CRM tools, maps, and social media."
        }
        if (lowerText.includes('ecommerce') || lowerText.includes('online store')) {
            return WEBSITE_KNOWLEDGE.services_detailed.ecommerce
        }
        if (lowerText.includes('payment gateway')) {
            return "Yes, we can integrate Stripe, Razorpay, PayPal, or any other regional gateway you prefer."
        }
        if (lowerText.includes('wordpress') || lowerText.includes('custom code')) {
            return "We specialize in custom code (React/Node) for high performance, but we also handle WordPress for blogs or simple corporate sites if requested."
        }
        if (lowerText.includes('fix bug') || lowerText.includes('existing website')) {
            return "Yes, our team can help you debug and optimize your current website to make it faster and modern."
        }
        if (lowerText.includes('dashboard') || lowerText.includes('admin panel')) {
            return "Custom admin dashboards are our specialty! We build powerful tools to help you manage your data, users, and content easily."
        }

        // 🔹 10. Misc, Career & Human
        if (lowerText.includes('hiring') || lowerText.includes('join your team')) {
            return WEBSITE_KNOWLEDGE.career.hiring
        }
        if (lowerText.includes('internship')) {
            return WEBSITE_KNOWLEDGE.career.internships
        }
        if (lowerText.includes('partner')) {
            return WEBSITE_KNOWLEDGE.career.partnerships
        }
        if (lowerText.includes('long-term goal')) {
            return WEBSITE_KNOWLEDGE.vision
        }
        if (lowerText.includes('outsourcing')) {
            return "Yes, we handle outsourcing for international agencies looking for a reliable technical partner."
        }
        if (lowerText.includes('technical term') || lowerText.includes('simple term')) {
            return WEBSITE_KNOWLEDGE.collaboration.simplicity
        }
        if (lowerText.includes('no technical knowledge')) {
            return WEBSITE_KNOWLEDGE.collaboration.no_tech_knowledge
        }
        if (lowerText.includes('suggest idea')) {
            return WEBSITE_KNOWLEDGE.collaboration.ideas
        }
        if (lowerText.includes('hire me')) {
            return "We are always on the lookout for stars! Feel free to send your CV to careers@appnest.in."
        }

        // 🔹 11. Greeting & Social
        if (lowerText.includes('how are you') || lowerText.includes('how\'s it going')) {
            return "I'm performing at 100% capacity! Thank you for asking. How can I help you build something extraordinary today?"
        }
        if (lowerText.includes('hi') || lowerText.includes('hello') || lowerText.includes('hey')) {
            return "Hello! I'm the AppNest Assistant. Are you interested in a new project, or just looking around? I'm here to help!"
        }
        if (lowerText.includes('thank you') || lowerText.includes('thanks')) {
            return "You're very welcome! I'm here if you have any more questions. Let's make your next project a success!"
        }
        if (lowerText.includes('joke')) {
            return "Why do programmers prefer dark mode? Because light attracts bugs! 🐛"
        }
        if (lowerText.includes('stay updated')) {
            return "Our team follows the latest industry trends through continuous learning, attending tech conferences, and contributing to open-source projects. We never stop evolving!"
        }

        return "That's a great question! To give you the most accurate and helpful answer, I'd suggest a quick 5-minute chat with our lead developer. Would you like to connect on WhatsApp now?"
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
