import { motion } from 'framer-motion'
import { FaFileContract, FaGavel, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa'

export default function TermsAndConditions() {
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
                            <FaFileContract className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Terms & Conditions</h1>
                            <p className="text-gray-500 text-sm">Effective Date: {new Date().toLocaleDateString()}</p>
                        </div>
                    </div>

                    <div className="prose prose-blue max-w-none text-gray-600 space-y-6">
                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <FaGavel className="text-blue-500" /> Acceptance of Terms
                            </h2>
                            <p>
                                By accessing and using the services provided by AppNest Technologies Pvt. Ltd., you agree to be bound by these Terms and Conditions. If you do not agree to all of these terms, do not use our services.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <FaCheckCircle className="text-blue-500" /> Services Provided
                            </h2>
                            <p>
                                AppNest Technologies provides software development, website design, mobile application development, and related technology services. The specific scope of services for any project will be outlined in a separate agreement or proposal.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <FaExclamationTriangle className="text-blue-500" /> Intellectual Property
                            </h2>
                            <p>
                                Unless otherwise agreed in writing, all intellectual property rights in the materials and software developed by AppNest Technologies remain the property of AppNest Technologies until full payment is received.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-3">Payment Terms</h2>
                            <p>
                                Payment terms are as specified in the project proposal or invoice. Late payments may result in suspension of services or additional fees.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-3">Limitation of Liability</h2>
                            <p>
                                AppNest Technologies shall not be liable for any indirect, incidental, special, or consequential damages resulting from the use or inability to use our services.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-3">Governing Law</h2>
                            <p>
                                These terms shall be governed by and construed in accordance with the laws of India. Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the courts in Jammu & Kashmir.
                            </p>
                        </section>
                    </div>
                </motion.div>
            </div>
        </main>
    )
}
