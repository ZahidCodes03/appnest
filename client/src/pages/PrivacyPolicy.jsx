import { motion } from 'framer-motion'
import { FaShieldAlt, FaLock, FaUserSecret, FaHistory } from 'react-icons/fa'

export default function PrivacyPolicy() {
    return (
        <main className="pt-24 pb-20 bg-gray-50 min-h-screen">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100"
                >
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
                            <FaShieldAlt className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
                            <p className="text-gray-500 text-sm">Last updated: {new Date().toLocaleDateString()}</p>
                        </div>
                    </div>

                    <div className="prose prose-blue max-w-none text-gray-600 space-y-6">
                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <FaUserSecret className="text-blue-500" /> Information We Collect
                            </h2>
                            <p>
                                At AppNest Technologies, we collect information to provide better services to our users. We collect information in the following ways:
                            </p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Information you give us (e.g., name, email, phone number when contacting us).</li>
                                <li>Information we get from your use of our services (e.g., device information, log data).</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <FaLock className="text-blue-500" /> How We Use Information
                            </h2>
                            <p>
                                We use the information we collect from all of our services to provide, maintain, protect and improve them, to develop new ones, and to protect AppNest Technologies and our users.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <FaHistory className="text-blue-500" /> Data Security
                            </h2>
                            <p>
                                We work hard to protect AppNest Technologies and our users from unauthorized access to or unauthorized alteration, disclosure or destruction of information we hold. We restrict access to personal information to our employees, contractors and agents who need to know that information in order to process it for us.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-3">Cookies</h2>
                            <p>
                                We use cookies and similar technologies to provide and support our services and each of the uses outlined and described in this policy.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-3">Changes to This Policy</h2>
                            <p>
                                Our Privacy Policy may change from time to time. We will post any privacy policy changes on this page and, if the changes are significant, we will provide a more prominent notice.
                            </p>
                        </section>
                    </div>
                </motion.div>
            </div>
        </main>
    )
}
