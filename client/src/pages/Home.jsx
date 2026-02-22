import { motion, useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaCode, FaMobileAlt, FaPalette, FaShoppingCart, FaLaptopCode, FaTools, FaSearch, FaRocket, FaShieldAlt, FaHandshake, FaDollarSign, FaHeadset, FaUsers, FaStar, FaCheck, FaArrowRight, FaArrowLeft, FaHospital, FaGraduationCap, FaStore, FaBuilding, FaSolarPanel, FaLightbulb, FaQuoteLeft, FaEnvelope, FaPhone, FaMapMarkerAlt, FaClock, FaDownload } from 'react-icons/fa'
import toast from 'react-hot-toast'
import api from '../lib/api'

/* ========== Animation Wrapper ========== */
function FadeIn({ children, delay = 0, direction = 'up', className = '' }) {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: '-50px' })
    const dirs = { up: { y: 40 }, down: { y: -40 }, left: { x: 40 }, right: { x: -40 } }
    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, ...dirs[direction] }}
            animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
            transition={{ duration: 0.6, delay, ease: 'easeOut' }}
            className={className}
        >
            {children}
        </motion.div>
    )
}

/* ========== Star Gradient Definition ========== */
const StarGradient = () => (
    <svg width="0" height="0" className="absolute">
        <defs>
            <linearGradient id="star-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2563eb" />
                <stop offset="100%" stopColor="#7c3aed" />
            </linearGradient>
        </defs>
    </svg>
)

/* ========== Animated Counter ========== */
function Counter({ target, suffix = '', label }) {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true })
    const [count, setCount] = useState(0)
    useEffect(() => {
        if (!isInView) return
        let start = 0
        const end = parseInt(target)
        const duration = 2000
        const step = end / (duration / 16)
        const timer = setInterval(() => {
            start += step
            if (start >= end) { setCount(end); clearInterval(timer) }
            else setCount(Math.floor(start))
        }, 16)
        return () => clearInterval(timer)
    }, [isInView, target])
    return (
        <div ref={ref} className="text-center">
            <div className="text-4xl md:text-5xl font-extrabold gradient-text">{count}{suffix}</div>
            <div className="text-gray-400 mt-2 font-medium">{label}</div>
        </div>
    )
}

/* ========== HERO ========== */
function Hero() {
    return (
        <section id="home" className="hero-bg min-h-screen flex items-center pt-24 md:pt-32">
            {/* Floating particles */}
            {[...Array(6)].map((_, i) => (
                <div
                    key={i}
                    className="particle"
                    style={{
                        width: `${20 + i * 15}px`,
                        height: `${20 + i * 15}px`,
                        top: `${10 + i * 15}%`,
                        left: `${5 + i * 16}%`,
                        animationDelay: `${i * 1.2}s`,
                        animationDuration: `${6 + i * 2}s`,
                    }}
                />
            ))}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div>
                        {/* <FadeIn>
                            <span className="inline-block bg-violet-100 text-violet-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
                                🚀 #1 Software Agency
                            </span>
                        </FadeIn> */}
                        <FadeIn delay={0.1}>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
                                We Build Modern{' '}
                                <span className="gradient-text">Websites & Mobile Apps</span>{' '}
                                That Grow Businesses.
                            </h1>
                        </FadeIn>
                        <FadeIn delay={0.2}>
                            <p className="mt-6 text-lg text-gray-600 leading-relaxed max-w-xl">
                                Helping startups and businesses create high-performing digital products with modern design and scalable technology.
                            </p>
                        </FadeIn>
                        <FadeIn delay={0.3}>
                            <div className="mt-8 flex flex-wrap gap-4">
                                <a href="#contact" className="btn-primary text-base">
                                    Get a Free Quote <FaArrowRight className="w-4 h-4" />
                                </a>
                                <a href="#contact" className="btn-secondary text-base">
                                    Book a Consultation
                                </a>
                                <button
                                    onClick={() => document.getElementById('lead-modal')?.classList.remove('hidden')}
                                    className="flex items-center gap-2 text-violet-600 font-semibold hover:text-violet-700 transition-colors px-4 py-3"
                                >
                                    <FaDownload /> Download Proposal
                                </button>
                            </div>
                        </FadeIn>
                    </div>
                    <FadeIn delay={0.4} direction="right">
                        <div className="relative hidden lg:block">
                            <div className="w-full h-96 bg-gradient-to-br from-violet-500/10 to-cyan-400/10 rounded-3xl flex items-center justify-center">
                                <img src="/logo.png" alt="AppNest Technologies" className="w-48 h-48 object-contain animate-float" />
                            </div>
                            {/* Floating cards */}
                            <motion.div
                                animate={{ y: [-5, 5, -5] }}
                                transition={{ duration: 4, repeat: Infinity }}
                                className="absolute -top-4 -right-4 glass-card rounded-2xl p-4 shadow-xl"
                            >
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                        <FaCheck className="w-4 h-4 text-green-600" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-500">Projects</div>
                                        <div className="font-bold text-gray-900">50+ Delivered</div>
                                    </div>
                                </div>
                            </motion.div>
                            <motion.div
                                animate={{ y: [5, -5, 5] }}
                                transition={{ duration: 5, repeat: Infinity }}
                                className="absolute -bottom-4 -left-4 glass-card rounded-2xl p-4 shadow-xl"
                            >
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center">
                                        <FaStar className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-500">Rating</div>
                                        <div className="font-bold text-gray-900">5.0 ⭐</div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </FadeIn>
                </div>
            </div>
        </section>
    )
}

/* ========== SERVICES ========== */
const services = [
    { icon: FaCode, title: 'Website Development', desc: 'Custom, responsive websites built with cutting-edge technologies for maximum performance.' },
    { icon: FaMobileAlt, title: 'Mobile App Development', desc: 'Native & cross-platform mobile apps for Android & iOS with intuitive user experiences.' },
    { icon: FaPalette, title: 'UI/UX Design', desc: 'Beautiful, user-centered designs that drive engagement and conversion rates.' },
    { icon: FaShoppingCart, title: 'E-Commerce Websites', desc: 'Scalable online stores with secure payment integration and inventory management.' },
    { icon: FaLaptopCode, title: 'Custom Web Applications', desc: 'Tailored software solutions to automate and streamline your business operations.' },
    { icon: FaTools, title: 'Maintenance & Support', desc: '24/7 technical support and maintenance to keep your applications running smoothly.' },
    { icon: FaSearch, title: 'SEO & Performance', desc: 'Optimize your online presence with advanced SEO strategies and performance tuning.' },
]

function Services() {
    return (
        <section id="services" className="py-20 md:py-28 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <FadeIn>
                    <div className="text-center mb-16">
                        <span className="text-violet-600 font-semibold text-sm uppercase tracking-wider">What We Do</span>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-3">Our Services</h2>
                        <div className="section-divider mx-auto mt-4 bg-gradient-to-r from-blue-600 to-violet-600" />
                        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">Comprehensive digital solutions to transform your business and drive growth.</p>
                    </div>
                </FadeIn>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {services.map((s, i) => (
                        <FadeIn key={s.title} delay={i * 0.08}>
                            <div className="service-card bg-gradient-to-br from-blue-600 to-violet-600 rounded-2xl p-6 border border-blue-400/30 hover:shadow-2xl hover:shadow-violet-500/20 transition-all duration-300 h-full group">
                                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-5 text-violet-600 shadow-lg group-hover:scale-110 transition-transform">
                                    <s.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">{s.title}</h3>
                                <p className="text-blue-50 text-sm leading-relaxed">{s.desc}</p>
                            </div>
                        </FadeIn>
                    ))}
                </div>
            </div>
        </section>
    )
}

/* ========== WHY CHOOSE US ========== */
const features = [
    { icon: FaRocket, title: 'Fast Delivery', desc: 'Projects delivered on time' },
    { icon: FaPalette, title: 'Modern Designs', desc: 'Trendy, premium aesthetics' },
    { icon: FaShieldAlt, title: 'Secure Coding', desc: 'Industry-standard security' },
    { icon: FaDollarSign, title: 'Affordable Packages', desc: 'Best value for money' },
    { icon: FaHandshake, title: 'Long-Term Support', desc: 'We stand by our work' },
    { icon: FaUsers, title: 'Experienced Team', desc: 'Skilled developers & designers' },
]

function WhyChoose() {
    return (
        <section className="py-20 md:py-28 bg-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <FadeIn>
                    <div className="text-center mb-16">
                        <span className="text-violet-600 font-semibold text-sm uppercase tracking-wider">Why Us</span>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-3">Why Choose AppNest?</h2>
                        <div className="section-divider mx-auto mt-4 bg-gradient-to-r from-blue-600 to-violet-600" />
                    </div>
                </FadeIn>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                    {features.map((f, i) => (
                        <FadeIn key={f.title} delay={i * 0.08}>
                            <div className="flex gap-4 p-6 rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 border border-blue-400/30 shadow-xl transition-all duration-300 group">
                                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shrink-0 transition-all">
                                    <f.icon className="w-5 h-5 text-white transition-colors" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white transition-colors">{f.title}</h3>
                                    <p className="text-blue-50 text-sm mt-1 transition-colors">{f.desc}</p>
                                </div>
                            </div>
                        </FadeIn>
                    ))}
                </div>
                {/* Counters */}
                <FadeIn>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
                        <Counter target="50" suffix="+" label="Projects Delivered" />
                        <Counter target="30" suffix="+" label="Happy Clients" />
                        <Counter target="5" suffix="+" label="Years Experience" />
                    </div>
                </FadeIn>
            </div>
        </section>
    )
}

/* ========== PORTFOLIO ========== */
const getGradient = (i) => {
    const gradients = [
        'from-blue-600 to-blue-400',
        'from-cyan-500 to-teal-400',
        'from-indigo-600 to-blue-400',
        'from-purple-500 to-indigo-400',
        'from-orange-500 to-amber-400',
        'from-emerald-500 to-green-400',
    ]
    return gradients[i % gradients.length]
}

function Portfolio() {
    const fallbackItems = [
        { title: 'Modern E-Commerce', tech: 'React, Node.js, PostgreSQL', category: 'Web Development', description: 'A full-featured online store with payment gateway integration and real-time inventory.', screenshot_url: 'https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&q=80', demo_url: '#' },
        { title: 'HealthSync App', tech: 'React Native, Firebase', category: 'Mobile App', description: 'Comprehensive health tracking app with telemedicine integration and live consultation.', screenshot_url: 'https://images.unsplash.com/photo-1576091160550-217359f42f8c?auto=format&fit=crop&q=80', demo_url: '#' },
        { title: 'EduPro LMS', tech: 'Next.js, Tailwind, Prisma', category: 'Web Application', description: 'Institutional learning management system with video streaming and interactive quizzes.', screenshot_url: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&q=80', demo_url: '#' },
    ]
    const [portfolioItems, setPortfolioItems] = useState(fallbackItems)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [direction, setDirection] = useState(0)

    useEffect(() => {
        const fetchPortfolio = async () => {
            try {
                const { data } = await api.get('/portfolio')
                if (data && data.length > 0) setPortfolioItems(data)
            } catch (error) {
                console.error('Failed to fetch portfolio', error)
            }
        }
        fetchPortfolio()
    }, [])

    // Auto-slide every 4 seconds
    useEffect(() => {
        if (portfolioItems.length <= 1) return
        const timer = setInterval(() => {
            setDirection(1)
            setCurrentIndex(prev => (prev + 1) % portfolioItems.length)
        }, 4000)
        return () => clearInterval(timer)
    }, [portfolioItems.length])

    const getImageUrl = (url) => {
        if (!url) return null
        if (url.includes('localhost')) {
            const parts = url.split('/uploads/')
            if (parts[1]) url = `/uploads/${parts[1]}`
        }
        if (url.startsWith('http')) return url
        const backendUrl = import.meta.env.VITE_API_URL || ''
        return `${backendUrl}${url}`
    }

    const goTo = (index) => {
        setDirection(index > currentIndex ? 1 : -1)
        setCurrentIndex(index)
    }

    const goPrev = () => {
        setDirection(-1)
        setCurrentIndex(prev => (prev - 1 + portfolioItems.length) % portfolioItems.length)
    }

    const goNext = () => {
        setDirection(1)
        setCurrentIndex(prev => (prev + 1) % portfolioItems.length)
    }

    const slideVariants = {
        enter: (dir) => ({ x: dir > 0 ? 300 : -300, opacity: 0, scale: 0.95 }),
        center: { x: 0, opacity: 1, scale: 1 },
        exit: (dir) => ({ x: dir > 0 ? -300 : 300, opacity: 0, scale: 0.95 }),
    }

    // Get visible cards (current + neighbours for desktop)
    const getVisibleIndices = () => {
        const len = portfolioItems.length
        if (len <= 3) return portfolioItems.map((_, i) => i)
        const prev = (currentIndex - 1 + len) % len
        const next = (currentIndex + 1) % len
        return [prev, currentIndex, next]
    }

    return (
        <section id="portfolio" className="py-20 md:py-28 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <FadeIn>
                    <div className="text-center mb-16">
                        <span className="text-violet-600 font-semibold text-sm uppercase tracking-wider">Our Work</span>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-3">Portfolio</h2>
                        <div className="section-divider mx-auto mt-4" />
                        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">Showcasing our best projects across various industries.</p>
                    </div>
                </FadeIn>

                {/* Desktop: 3-card slider */}
                <div className="hidden md:block relative">
                    <div className="grid grid-cols-3 gap-6">
                        {getVisibleIndices().map((idx, pos) => {
                            const p = portfolioItems[idx]
                            return (
                                <motion.div
                                    key={`${p.id || idx}-${currentIndex}`}
                                    initial={{ opacity: 0, x: direction > 0 ? 60 : -60 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5, ease: 'easeOut' }}
                                    className={`group rounded-2xl overflow-hidden bg-gradient-to-br from-blue-600 to-violet-600 border border-blue-400/30 shadow-lg transition-all duration-300 h-full flex flex-col ${pos === 1 ? 'ring-2 ring-violet-400/50 shadow-xl shadow-violet-500/20 scale-[1.02]' : 'opacity-80 hover:opacity-100'
                                        }`}
                                >
                                    <div className="h-48 bg-gray-900 flex items-center justify-center relative overflow-hidden shrink-0">
                                        <div className="absolute inset-0 bg-black/5" />
                                        {p.screenshot_url ? (
                                            <img
                                                src={getImageUrl(p.screenshot_url)}
                                                alt={p.title}
                                                className="w-full h-full object-cover"
                                                loading="eager"
                                            />
                                        ) : null}
                                        <div className={`absolute inset-0 items-center justify-center ${p.screenshot_url ? 'hidden' : 'flex'}`}>
                                            <FaLaptopCode className="w-16 h-16 text-white/40" />
                                        </div>
                                        <span className="absolute top-4 left-4 bg-white/20 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 rounded-full">{p.category}</span>
                                    </div>
                                    <div className="p-5 flex flex-col flex-1">
                                        <h3 className="font-bold text-white text-lg">{p.title}</h3>
                                        <p className="text-violet-100 text-xs mt-1 font-medium">{p.tech}</p>
                                        <p className="text-blue-50 text-sm mt-3 line-clamp-3 mb-4 flex-1">{p.description}</p>
                                        <a href={p.demo_url || '#'} target="_blank" rel="noopener noreferrer" className="mt-auto text-white text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                                            View Details <FaArrowRight className="w-3 h-3" />
                                        </a>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </div>

                    {/* Navigation arrows */}
                    {portfolioItems.length > 3 && (
                        <>
                            <button onClick={goPrev} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center text-gray-600 hover:text-violet-600 hover:shadow-xl transition-all z-10">
                                <FaArrowLeft className="w-4 h-4" />
                            </button>
                            <button onClick={goNext} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center text-gray-600 hover:text-violet-600 hover:shadow-xl transition-all z-10">
                                <FaArrowRight className="w-4 h-4" />
                            </button>
                        </>
                    )}
                </div>

                {/* Mobile: Single card slider */}
                <div className="md:hidden relative overflow-hidden">
                    <motion.div
                        key={currentIndex}
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        transition={{ duration: 0.4, ease: 'easeInOut' }}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={0.2}
                        onDragEnd={(_, info) => {
                            if (info.offset.x < -50) goNext()
                            else if (info.offset.x > 50) goPrev()
                        }}
                    >
                        {(() => {
                            const p = portfolioItems[currentIndex]
                            return (
                                <div className="group rounded-2xl overflow-hidden bg-gradient-to-br from-blue-600 to-violet-600 border border-blue-400/30 shadow-lg flex flex-col">
                                    <div className="h-48 bg-gray-900 flex items-center justify-center relative overflow-hidden shrink-0">
                                        <div className="absolute inset-0 bg-black/5" />
                                        {p.screenshot_url ? (
                                            <img
                                                src={getImageUrl(p.screenshot_url)}
                                                alt={p.title}
                                                className="w-full h-full object-cover"
                                                loading="eager"
                                                onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling && (e.target.nextSibling.style.display = 'flex'); }}
                                            />
                                        ) : null}
                                        <div className={`absolute inset-0 items-center justify-center ${p.screenshot_url ? 'hidden' : 'flex'}`}>
                                            <FaLaptopCode className="w-16 h-16 text-white/40" />
                                        </div>
                                        <span className="absolute top-4 left-4 bg-white/20 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 rounded-full">{p.category}</span>
                                    </div>
                                    <div className="p-5 flex flex-col flex-1">
                                        <h3 className="font-bold text-white text-lg">{p.title}</h3>
                                        <p className="text-violet-100 text-xs mt-1 font-medium">{p.tech}</p>
                                        <p className="text-blue-50 text-sm mt-3 line-clamp-3 mb-4 flex-1">{p.description}</p>
                                        <a href={p.demo_url || '#'} target="_blank" rel="noopener noreferrer" className="mt-auto text-white text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                                            View Details <FaArrowRight className="w-3 h-3" />
                                        </a>
                                    </div>
                                </div>
                            )
                        })()}
                    </motion.div>
                </div>

                {/* Dot indicators */}
                {portfolioItems.length > 1 && (
                    <div className="flex justify-center gap-2 mt-8">
                        {portfolioItems.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => goTo(i)}
                                className={`h-2.5 rounded-full transition-all duration-300 ${i === currentIndex ? 'w-8 bg-gradient-to-r from-blue-600 to-violet-600' : 'w-2.5 bg-gray-300 hover:bg-gray-400'}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}

/* ========== INDUSTRIES ========== */
const industries = [
    { icon: FaHospital, name: 'Healthcare' },
    { icon: FaGraduationCap, name: 'Education' },
    { icon: FaStore, name: 'E-Commerce' },
    { icon: FaBuilding, name: 'Real Estate' },
    { icon: FaSolarPanel, name: 'Solar & Energy' },
    { icon: FaLightbulb, name: 'Startups' },
]

function Industries() {
    return (
        <section className="py-20 md:py-28 bg-gradient-to-b from-gray-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <FadeIn>
                    <div className="text-center mb-16">
                        <span className="text-violet-600 font-semibold text-sm uppercase tracking-wider">Who We Serve</span>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-3">Industries We Serve</h2>
                        <div className="section-divider mx-auto mt-4" />
                    </div>
                </FadeIn>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
                    {industries.map((ind, i) => (
                        <FadeIn key={ind.name} delay={i * 0.08}>
                            <div className="text-center p-6 rounded-2xl hover:bg-white hover:shadow-lg transition-all duration-300 group cursor-pointer">
                                <div className="w-16 h-16 mx-auto mb-4 bg-blue-50 rounded-2xl flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-blue-600 group-hover:to-violet-600 transition-all">
                                    <ind.icon className="w-7 h-7 icon-gradient" />
                                </div>
                                <h3 className="font-semibold text-gray-900 text-sm">{ind.name}</h3>
                            </div>
                        </FadeIn>
                    ))}
                </div>
            </div>
        </section>
    )
}

/* ========== TESTIMONIALS (Dynamic from API) ========== */
function Testimonials() {
    const [testimonials, setTestimonials] = useState([])
    const [current, setCurrent] = useState(0)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const { data } = await api.get('/testimonials')
                setTestimonials(data)
            } catch (error) {
                console.error('Failed to fetch testimonials', error)
            } finally {
                setLoading(false)
            }
        }
        fetchTestimonials()
    }, [])

    useEffect(() => {
        if (testimonials.length === 0) return
        const timer = setInterval(() => setCurrent((c) => (c + 1) % testimonials.length), 5000)
        return () => clearInterval(timer)
    }, [testimonials.length])

    if (loading || testimonials.length === 0) return null

    return (
        <section className="py-20 md:py-28 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <FadeIn>
                    <div className="text-center mb-16">
                        <span className="text-violet-600 font-semibold text-sm uppercase tracking-wider">Testimonials</span>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-3">What Our Clients Say</h2>
                        <div className="section-divider mx-auto mt-4" />
                    </div>
                </FadeIn>
                <FadeIn>
                    <div className="max-w-3xl mx-auto">
                        <div className="relative bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl p-8 md:p-12">
                            <FaQuoteLeft className="w-10 h-10 text-blue-200 mb-6" />
                            <motion.div
                                key={current}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <p className="text-gray-700 text-lg leading-relaxed mb-6">"{testimonials[current].feedback}"</p>
                                <div className="flex items-center gap-1 mb-3">
                                    {[...Array(testimonials[current].rating)].map((_, i) => (
                                        <FaStar key={i} className="w-5 h-5 icon-gradient" />
                                    ))}
                                </div>
                                <div>
                                    <div className="font-bold text-gray-900">{testimonials[current].name}</div>
                                    <div className="text-violet-600 text-sm">{testimonials[current].business}</div>
                                </div>
                            </motion.div>
                            {/* Dots */}
                            <div className="flex justify-center gap-2 mt-8">
                                {testimonials.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrent(i)}
                                        className={`w-3 h-3 rounded-full transition-all ${i === current ? 'bg-violet-600 w-8' : 'bg-violet-200'}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </FadeIn>
            </div>
        </section>
    )
}

/* ========== SUBMIT A REVIEW (goes into testimonials) ========== */
function ReviewForm() {
    const [form, setForm] = useState({ name: '', email: '', business: '', feedback: '', rating: 5 })
    const [sending, setSending] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSending(true)
        try {
            await api.post('/testimonials/submit', { ...form, rating: Number(form.rating) })
            toast.success('Thank you! Your review has been submitted and will appear after approval.')
            setForm({ name: '', email: '', business: '', feedback: '', rating: 5 })
        } catch {
            toast.error('Failed to submit review. Please try again.')
        } finally {
            setSending(false)
        }
    }

    return (
        <section className="py-20 md:py-28 bg-gradient-to-b from-blue-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <FadeIn>
                    <div className="text-center mb-12">
                        <span className="text-violet-600 font-semibold text-sm uppercase tracking-wider">Share Your Experience</span>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-3">Leave Us a Review</h2>
                        <div className="section-divider mx-auto mt-4" />
                        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">Your feedback helps us improve. Share your experience working with AppNest Technologies.</p>
                    </div>
                </FadeIn>
                <FadeIn>
                    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 space-y-5">
                        <div className="grid sm:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Your Name *</label>
                                <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm" placeholder="John Doe" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Business Name (optional)</label>
                                <input type="text" value={form.business} onChange={(e) => setForm({ ...form, business: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm" placeholder="e.g. Acme Corp" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email (optional)</label>
                            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm" placeholder="you@example.com" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Rating *</label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((r) => (
                                    <button
                                        type="button"
                                        key={r}
                                        onClick={() => setForm({ ...form, rating: r })}
                                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${form.rating >= r ? 'bg-gradient-to-br from-blue-600/10 to-violet-600/10 border-blue-200 shadow-sm' : 'bg-gray-100 text-gray-400 hover:bg-gray-200 border-transparent'} border group`}
                                    >
                                        <FaStar className={`w-5 h-5 ${form.rating >= r ? 'icon-gradient' : ''}`} />
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Your Review *</label>
                            <textarea required rows={4} value={form.feedback} onChange={(e) => setForm({ ...form, feedback: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm resize-none" placeholder="Tell us about your experience working with AppNest..." />
                        </div>
                        <button type="submit" disabled={sending} className="btn-primary w-full justify-center text-base !py-3.5">
                            {sending ? 'Submitting...' : 'Submit Review'} {!sending && <FaArrowRight />}
                        </button>
                        <p className="text-gray-400 text-xs text-center">Your review will be published after approval by our team.</p>
                    </form>
                </FadeIn>
            </div>
        </section >
    )
}

/* ========== PROCESS TIMELINE ========== */
const steps = [
    { title: 'Free Consultation', desc: 'We understand your requirements and goals.' },
    { title: 'Planning & Design', desc: 'Wireframes, UI design, and project roadmap.' },
    { title: 'Development', desc: 'Agile development with regular updates.' },
    { title: 'Testing', desc: 'Thorough QA testing across devices.' },
    { title: 'Launch', desc: 'Deployment and go-live support.' },
    { title: 'Support & Updates', desc: 'Ongoing maintenance and feature updates.' },
]

function ProcessTimeline() {
    return (
        <section className="py-20 md:py-28 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <FadeIn>
                    <div className="text-center mb-16">
                        <span className="text-violet-600 font-semibold text-sm uppercase tracking-wider">How We Work</span>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-3">Our Process</h2>
                        <div className="section-divider mx-auto mt-4 bg-gradient-to-r from-blue-600 to-violet-600" />
                    </div>
                </FadeIn>
                <div className="max-w-3xl mx-auto relative">
                    <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-violet-600" />
                    {steps.map((step, i) => (
                        <FadeIn key={step.title} delay={i * 0.1} direction={i % 2 === 0 ? 'right' : 'left'}>
                            <div className={`relative flex items-start gap-6 md:gap-24 mb-12 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} md:text-${i % 2 === 0 ? 'right' : 'left'}`}>
                                <div className="hidden md:block flex-1" />
                                <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-12 h-12 bg-gradient-to-br from-blue-600 to-violet-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg shadow-violet-500/30 z-10">
                                    {i + 1}
                                </div>
                                <div className="flex-1 ml-16 md:ml-0 bg-gradient-to-br from-blue-600 to-violet-600 rounded-2xl p-6 shadow-lg border border-blue-400/30 hover:shadow-violet-500/20 transition-all duration-300">
                                    <h3 className="font-bold text-white text-lg">{step.title}</h3>
                                    <p className="text-blue-50 text-sm mt-1">{step.desc}</p>
                                </div>
                            </div>
                        </FadeIn>
                    ))}
                </div>
            </div>
        </section>
    )
}

/* ========== PRICING ========== */
const packages = [
    {
        name: 'Basic Website',
        price: '₹15,000',
        type: 'One Time',
        features: ['5 Pages Responsive Website', 'Contact Form', 'SEO Optimized', 'Mobile Friendly', '1 Month Free Support', 'SSL Certificate'],
        featured: false,
    },
    {
        name: 'Business Website',
        price: '₹35,000',
        type: 'One Time',
        features: ['10+ Pages Dynamic Website', 'Admin Panel', 'Advanced SEO', 'Blog Integration', 'Social Media Integration', '3 Months Free Support', 'SSL + Analytics'],
        featured: true,
    },
    {
        name: 'App Development',
        price: 'Custom',
        type: 'Get a Quote',
        features: ['Android & iOS App', 'Custom UI/UX Design', 'Backend API Development', 'Push Notifications', 'Payment Integration', '6 Months Support', 'App Store Deployment'],
        featured: false,
    },
]

function Pricing() {
    const fallbackPackages = [
        { name: 'Basic Website', price: '₹15,000', type: 'One Time', features: ['5 Pages Responsive Website', 'Contact Form', 'SEO Optimized', 'Mobile Friendly', '1 Month Free Support', 'SSL Certificate'], featured: false },
        { name: 'Business Website', price: '₹35,000', type: 'One Time', features: ['10+ Pages Dynamic Website', 'Admin Panel', 'Advanced SEO', 'Blog Integration', 'Social Media Integration', '3 Months Free Support', 'SSL + Analytics'], featured: true },
        { name: 'App Development', price: 'Custom', type: 'Get a Quote', features: ['Android & iOS App', 'Custom UI/UX Design', 'Backend API Development', 'Push Notifications', 'Payment Integration', '6 Months Support', 'App Store Deployment'], featured: false },
    ]
    const [packages, setPackages] = useState(fallbackPackages)

    useEffect(() => {
        const fetchPricing = async () => {
            try {
                const { data } = await api.get('/pricing')
                if (data && data.length > 0) setPackages(data)
            } catch (error) {
                console.error('Failed to fetch pricing', error)
            }
        }
        fetchPricing()
    }, [])

    return (
        <section id="pricing" className="py-20 md:py-28 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <FadeIn>
                    <div className="text-center mb-16">
                        <span className="text-violet-600 font-semibold text-sm uppercase tracking-wider">Pricing</span>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-3">Our Packages</h2>
                        <div className="section-divider mx-auto mt-4" />
                        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">Transparent pricing with no hidden fees. Choose a plan that fits your needs.</p>
                    </div>
                </FadeIn>
                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {packages.map((pkg, i) => (
                        <FadeIn key={pkg.id || i} delay={i * 0.1}>
                            <div className={`pricing-card rounded-2xl p-8 bg-gradient-to-br from-blue-600 to-violet-600 border border-blue-400/30 ${pkg.featured ? 'shadow-2xl shadow-violet-500/20' : ''} h-full flex flex-col text-white`}>
                                {pkg.featured && (
                                    <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-4 py-1 rounded-full mb-4 self-start">
                                        MOST POPULAR
                                    </span>
                                )}
                                <h3 className="text-xl font-bold text-white">{pkg.name}</h3>
                                <div className="mt-4 mb-6">
                                    <span className="text-4xl font-extrabold text-white">{pkg.price}</span>
                                    <span className="text-violet-100 text-sm ml-2">/ {pkg.type}</span>
                                </div>
                                <ul className="space-y-3 mb-8 flex-1">
                                    {(Array.isArray(pkg.features) ? pkg.features : (typeof pkg.features === 'string' ? JSON.parse(pkg.features) : [])).map((f, index) => (
                                        <li key={index} className="flex items-start gap-2 text-blue-50 text-sm">
                                            <FaCheck className="w-4 h-4 text-white mt-0.5 shrink-0 bg-white/20 rounded-full p-0.5" />
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                                <a
                                    href="#contact"
                                    className={`block text-center py-3 px-6 rounded-xl font-semibold transition-all ${pkg.featured
                                        ? 'bg-white text-violet-600 hover:shadow-lg hover:shadow-white/20'
                                        : 'bg-white/10 text-white hover:bg-white/20'
                                        }`}
                                >
                                    Explore Package
                                </a>
                            </div>
                        </FadeIn>
                    ))}
                </div>
            </div>
        </section>
    )
}

/* ========== LATEST INSIGHTS (BLOG) ========== */
function LatestInsights() {
    const [blogs, setBlogs] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const { data } = await api.get('/blogs') // Should return published blogs
                setBlogs(data.slice(0, 3)) // Take top 3
            } catch (error) {
                console.error('Failed to fetch blogs', error)
            } finally {
                setLoading(false)
            }
        }
        fetchBlogs()
    }, [])

    if (loading || blogs.length === 0) return null

    return (
        <section id="blog" className="py-20 md:py-28 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <FadeIn>
                    <div className="text-center mb-16">
                        <span className="text-violet-600 font-semibold text-sm uppercase tracking-wider">Our Blog</span>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-3">Latest Insights</h2>
                        <div className="section-divider mx-auto mt-4" />
                    </div>
                </FadeIn>
                <div className="grid md:grid-cols-3 gap-8">
                    {blogs.map((blog, i) => (
                        <FadeIn key={blog.id} delay={i * 0.1}>
                            <article className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow h-full flex flex-col">
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="text-xs font-semibold text-violet-600 mb-2 uppercase tracking-wide">
                                        {new Date(blog.created_at || blog.date).toLocaleDateString()}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3 hover:text-violet-600 transition-colors">
                                        {blog.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-1">
                                        {blog.excerpt}
                                    </p>
                                    <Link to={`/blog/${blog.slug}`} className="inline-flex items-center gap-2 text-violet-600 font-semibold text-sm mt-auto hover:gap-3 transition-all">
                                        Read More <FaArrowRight className="w-3 h-3" />
                                    </Link>
                                </div>
                            </article>
                        </FadeIn>
                    ))}
                </div>
            </div>
        </section>
    )
}

/* ========== ABOUT ========== */
function About() {
    return (
        <section id="about" className="py-20 md:py-28 bg-gradient-to-b from-gray-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto text-center">
                    <FadeIn>
                        <div>
                            <span className="text-violet-600 font-semibold text-sm uppercase tracking-wider">About Us</span>
                            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-3">AppNest Technologies Pvt. Ltd</h2>
                            <div className="section-divider mt-4 mx-auto" />

                            <div className="mt-8 space-y-6 text-gray-600 leading-relaxed text-lg">
                                <p>
                                    AppNest Technologies is a forward-thinking software agency dedicated to empowering businesses through innovative digital solutions. We specialize in web development, mobile applications, and custom software tailored to startups, small businesses, and enterprises.</p>

                                <p>Our team combines creativity, strategy, and modern technology to deliver scalable, high-performance, and user-focused solutions. By working closely with clients, we ensure every product aligns with their goals and drives real business growth.</p>

                                <p>At AppNest, we don’t just build software—we create impactful digital experiences and long-term partnerships.</p>
                                <p className="text-violet-600 font-bold text-xl mt-10">
                                    Let’s build something extraordinary together.
                                </p>
                            </div>
                        </div>
                    </FadeIn>
                </div>
            </div>
        </section>
    )
}

/* ========== CONTACT ========== */
function Contact() {
    const [form, setForm] = useState({ name: '', email: '', phone: '', project_type: '', budget: '', deadline: '', message: '' })
    const [sending, setSending] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSending(true)
        try {
            await api.post('/inquiries', form)
            toast.success('Thank you! We\'ll contact you within 24 hours.')
            setForm({ name: '', email: '', phone: '', project_type: '', budget: '', deadline: '', message: '' })
        } catch {
            toast.success('Inquiry submitted successfully!')
            setForm({ name: '', email: '', phone: '', project_type: '', budget: '', deadline: '', message: '' })
        } finally {
            setSending(false)
        }
    }

    return (
        <section id="contact" className="py-20 md:py-28 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <FadeIn>
                    <div className="text-center mb-16">
                        <span className="text-violet-600 font-semibold text-sm uppercase tracking-wider">Get In Touch</span>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-3">Contact Us</h2>
                        <div className="section-divider mx-auto mt-4" />
                        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">Talk to our expert today and let's discuss your project.</p>
                    </div>
                </FadeIn>
                <div className="grid lg:grid-cols-5 gap-12">
                    {/* Form */}
                    <FadeIn className="lg:col-span-3">
                        <form onSubmit={handleSubmit} className="bg-gray-50 rounded-2xl p-6 md:p-8 space-y-5">
                            <div className="grid sm:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                                    <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm" placeholder="John Doe" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                                    <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm" placeholder="you@example.com" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                    <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm" placeholder="+91 6006642157" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Project Type</label>
                                    <select value={form.project_type} onChange={(e) => setForm({ ...form, project_type: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm">
                                        <option value="">Select Type</option>
                                        <option>Website Development</option>
                                        <option>Mobile App Development</option>
                                        <option>UI/UX Design</option>
                                        <option>E-Commerce Website</option>
                                        <option>Custom Web Application</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Budget Range</label>
                                    <select value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm">
                                        <option value="">Select Budget</option>
                                        <option>Under ₹15,000</option>
                                        <option>₹15,000 - ₹35,000</option>
                                        <option>₹35,000 - ₹75,000</option>
                                        <option>₹75,000 - ₹1,50,000</option>
                                        <option>₹1,50,000+</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
                                    <select value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm">
                                        <option value="">Select Deadline</option>
                                        <option>Within 1 Week</option>
                                        <option>Within 2 Weeks</option>
                                        <option>Within 1 Month</option>
                                        <option>Within 3 Months</option>
                                        <option>No Rush</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Project Details *</label>
                                <textarea required rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm resize-none" placeholder="Describe your project requirements..." />
                            </div>
                            <button type="submit" disabled={sending} className="btn-primary w-full justify-center text-base !py-3.5">
                                {sending ? 'Sending...' : 'Send Inquiry'} {!sending && <FaArrowRight />}
                            </button>
                        </form>
                    </FadeIn>

                    {/* Contact Info */}
                    <FadeIn direction="right" className="lg:col-span-2 space-y-6">
                        <div className="bg-gradient-to-br from-blue-600 to-violet-600 rounded-2xl p-6 text-white">
                            <h3 className="text-xl font-bold mb-4">Talk to Our Expert</h3>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <FaEnvelope className="w-5 h-5 mt-0.5 shrink-0 opacity-80" />
                                    <div>
                                        <div className="text-sm opacity-80">Email</div>
                                        <a href="mailto:zahidqureshi1003@gmail.com" className="font-medium">zahidqureshi1003@gmail.com</a>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <FaPhone className="w-5 h-5 mt-0.5 shrink-0 opacity-80" />
                                    <div>
                                        <div className="text-sm opacity-80">Phone</div>
                                        <a href="tel:+916006642157" className="font-medium">+91 6006642157</a>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <FaClock className="w-5 h-5 mt-0.5 shrink-0 opacity-80" />
                                    <div>
                                        <div className="text-sm opacity-80">Business Hours</div>
                                        <div className="font-medium">Mon-Sat: 10AM - 7PM IST</div>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <FaMapMarkerAlt className="w-5 h-5 mt-0.5 shrink-0 opacity-80" />
                                    <div>
                                        <div className="text-sm opacity-80">Location</div>
                                        <div className="font-medium">Handwara Jammu & Kashmir </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        {/* Map */}
                        <div className="rounded-2xl overflow-hidden border border-gray-200 h-64">
                            <iframe
                                title="AppNest Office"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d19133.674879454007!2d74.26213805967542!3d34.40604702360136!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38e11cede799fc8d%3A0x37953ecde7a3233c!2sHandwara%20193221!5e1!3m2!1sen!2sin!4v1771605053470!5m2!1sen!2sin"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                            />
                        </div>
                    </FadeIn>
                </div>
            </div>
        </section>
    )
}

/* ========== LEAD MAGNET MODAL ========== */
function LeadModal() {
    const [email, setEmail] = useState('')
    const [submitting, setSubmitting] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitting(true)
        try {
            await api.post('/leads', { email })
            toast.success('Thank you! Your proposal is downloading...')

            // Trigger automatic download
            const link = document.createElement('a')
            link.href = '/proposal.pdf'
            link.download = 'AppNest_Proposal.pdf'
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)

            document.getElementById('lead-modal')?.classList.add('hidden')
            setEmail('')
        } catch {
            toast.success('Thank you! Your proposal will be sent to your email.')
            document.getElementById('lead-modal')?.classList.add('hidden')
            setEmail('')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div id="lead-modal" className="hidden fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
            >
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Download Company Proposal</h3>
                <p className="text-gray-600 text-sm mb-6">Enter your email to receive our detailed company proposal and pricing brochure.</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm"
                        placeholder="your@email.com"
                    />
                    <button type="submit" disabled={submitting} className="btn-primary w-full justify-center">
                        {submitting ? 'Processing...' : '📄 Download Proposal'}
                    </button>
                </form>
                <button onClick={() => document.getElementById('lead-modal')?.classList.add('hidden')} className="w-full text-center text-gray-500 text-sm mt-4 hover:text-gray-700">
                    Close
                </button>
            </motion.div>
        </div>
    )
}

/* ========== HOME PAGE ========== */
export default function Home() {
    return (
        <div className="bg-white">
            <StarGradient />
            <Hero />
            <Services />
            <WhyChoose />
            <Portfolio />
            <Industries />
            <Testimonials />
            <ReviewForm />
            <ProcessTimeline />
            <Pricing />
            <LatestInsights />
            <About />
            <Contact />
            <LeadModal />
        </div>
    )
}
