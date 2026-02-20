import { Link } from 'react-router-dom'
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa'

const quickLinks = [
    { name: 'Home', href: '/#home' },
    { name: 'Services', href: '/#services' },
    { name: 'Portfolio', href: '/#portfolio' },
    { name: 'About Us', href: '/#about' },
    { name: 'Pricing', href: '/#pricing' },
    { name: 'Contact', href: '/#contact' },
]

const services = [
    'Website Development',
    'Mobile App Development',
    'UI/UX Design',
    'E-Commerce Solutions',
    'Custom Web Apps',
    'SEO Optimization',
]

const socials = [
    { icon: FaFacebookF, href: '#', label: 'Facebook' },
    { icon: FaTwitter, href: '#', label: 'Twitter' },
    { icon: FaLinkedinIn, href: '#', label: 'LinkedIn' },
    { icon: FaInstagram, href: 'https://www.instagram.com/_zahiiiiiii', label: 'Instagram' },
]

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300">
            {/* Top CTA Bar */}
            <div className="bg-gradient-to-r from-blue-600 to-cyan-500">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                        <h3 className="text-xl md:text-2xl font-bold text-white">Ready to Start Your Project?</h3>
                        <p className="text-blue-100 mt-1">Let's build something amazing together.</p>
                    </div>
                    <a
                        href="/#contact"
                        className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-all shadow-lg"
                    >
                        Get a Free Quote
                    </a>
                </div>
            </div>

            {/* Main Footer */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <img src="/logo.png" alt="AppNest" className="h-10 w-10 object-contain" />
                            <div>
                                <span className="font-bold text-lg text-white">App</span>
                                <span className="font-bold text-lg text-cyan-400">Nest</span>
                            </div>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                            Building modern websites & mobile apps that grow businesses. Your trusted technology partner for digital transformation.
                        </p>
                        <div className="flex gap-3">
                            {socials.map((s) => (
                                <a
                                    key={s.label}
                                    href={s.href}
                                    aria-label={s.label}
                                    className="w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-all duration-300"
                                >
                                    <s.icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2.5">
                            {quickLinks.map((link) => (
                                <li key={link.name}>
                                    <a href={link.href} className="text-gray-400 hover:text-cyan-400 text-sm transition-colors">
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Our Services</h4>
                        <ul className="space-y-2.5">
                            {services.map((s) => (
                                <li key={s}>
                                    <span className="text-gray-400 text-sm">{s}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Contact Info</h4>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3">
                                <FaMapMarkerAlt className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                                <span className="text-gray-400 text-sm">Handwara Jammu & Kashmir </span>
                            </li>
                            <li className="flex items-center gap-3">
                                <FaEnvelope className="w-4 h-4 text-cyan-400 shrink-0" />
                                <a href="mailto:zahidqureshi1003@gmail.com" className="text-gray-400 text-sm hover:text-cyan-400 transition-colors">
                                    zahidqureshi1003@gmail.com
                                </a>
                            </li>
                            <li className="flex items-center gap-3">
                                <FaPhone className="w-4 h-4 text-cyan-400 shrink-0" />
                                <a href="tel:+916006642157" className="text-gray-400 text-sm hover:text-cyan-400 transition-colors">
                                    +91 6006 642157
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-gray-500 text-sm">
                        © {new Date().getFullYear()} AppNest Technologies Pvt. Ltd. All Rights Reserved.
                    </p>
                    <div className="flex gap-6 text-sm">
                        <a href="#" className="text-gray-500 hover:text-gray-300 transition-colors">Privacy Policy</a>
                        <a href="#" className="text-gray-500 hover:text-gray-300 transition-colors">Terms & Conditions</a>
                    </div>
                </div>
            </div>
        </footer>
    )
}
