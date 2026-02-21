import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import Loader from './components/Loader'
import ScrollToTop from './components/ScrollToTop'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import WhatsAppButton from './components/WhatsAppButton'
import Home from './pages/Home'
import Login from './pages/Login'
import BlogDetail from './pages/BlogDetail'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsAndConditions from './pages/TermsAndConditions'
import Careers from './pages/Careers'

/* Admin Pages */
import AdminLayout from './admin/AdminLayout'
import AdminDashboard from './admin/Dashboard'
import AdminInquiries from './admin/Inquiries'
import AdminProjects from './admin/Projects'
import AdminPortfolio from './admin/Portfolio'
import AdminBlog from './admin/Blog'
import AdminTestimonials from './admin/Testimonials'
import AdminPricing from './admin/Pricing'
import AdminInvoices from './admin/Invoices'
import AdminClients from './admin/Clients'
import AdminLeads from './admin/ProposalDownloads'
import AdminDeliverables from './admin/Deliverables'
import AdminSettings from './admin/Settings'
import AdminMessages from './admin/Messages'
import AdminTickets from './admin/Tickets'
import AdminAdmins from './admin/Admins'
import AdminJobs from './admin/Jobs'
import AdminApplications from './admin/Applications'

/* Client Portal Pages */
import PortalLayout from './portal/PortalLayout'
import PortalDashboard from './portal/PortalDashboard'
import MyProjects from './portal/MyProjects'
import MyInvoices from './portal/MyInvoices'
import Deliverables from './portal/Deliverables'
import SupportTickets from './portal/SupportTickets'
import Messages from './portal/Messages'

/* Route Guards */
function AdminGuard() {
    const { user, loading } = useAuth()
    if (loading) return null
    if (!user || user.role !== 'admin') return <Navigate to="/login" replace />
    return <Outlet />
}

function ClientGuard() {
    const { user, loading } = useAuth()
    if (loading) return null
    if (!user) return <Navigate to="/login" replace />
    return <Outlet />
}

/* Public Layout */
function PublicLayout() {
    return (
        <>
            <Navbar />
            <Outlet />
            <Footer />
            <WhatsAppButton />
        </>
    )
}

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <ScrollToTop />
                <Loader />
                <Toaster position="top-right" toastOptions={{ duration: 4000, style: { borderRadius: '12px', padding: '14px 20px' } }} />
                <Routes>
                    {/* Public Routes */}
                    <Route element={<PublicLayout />}>
                        <Route index element={<Home />} />
                        <Route path="blog/:slug" element={<BlogDetail />} />
                        <Route path="privacy" element={<PrivacyPolicy />} />
                        <Route path="terms" element={<TermsAndConditions />} />
                        <Route path="careers" element={<Careers />} />
                    </Route>
                    <Route path="/login" element={<Login />} />

                    {/* Admin Routes */}
                    <Route element={<AdminGuard />}>
                        <Route path="/admin" element={<AdminLayout />}>
                            <Route index element={<AdminDashboard />} />
                            <Route path="inquiries" element={<AdminInquiries />} />
                            <Route path="projects" element={<AdminProjects />} />
                            <Route path="portfolio" element={<AdminPortfolio />} />
                            <Route path="blog" element={<AdminBlog />} />
                            <Route path="testimonials" element={<AdminTestimonials />} />
                            <Route path="pricing" element={<AdminPricing />} />
                            <Route path="invoices" element={<AdminInvoices />} />
                            <Route path="clients" element={<AdminClients />} />
                            <Route path="admins" element={<AdminAdmins />} />
                            <Route path="leads" element={<AdminLeads />} />
                            <Route path="deliverables" element={<AdminDeliverables />} />
                            <Route path="tickets" element={<AdminTickets />} />
                            <Route path="messages" element={<AdminMessages />} />
                            <Route path="settings" element={<AdminSettings />} />
                            <Route path="jobs" element={<AdminJobs />} />
                            <Route path="applications" element={<AdminApplications />} />
                        </Route>
                    </Route>

                    {/* Client Portal Routes */}
                    <Route element={<ClientGuard />}>
                        <Route path="/portal" element={<PortalLayout />}>
                            <Route index element={<PortalDashboard />} />
                            <Route path="projects" element={<MyProjects />} />
                            <Route path="invoices" element={<MyInvoices />} />
                            <Route path="deliverables" element={<Deliverables />} />
                            <Route path="tickets" element={<SupportTickets />} />
                            <Route path="messages" element={<Messages />} />
                        </Route>
                    </Route>

                    {/* Catch-all */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    )
}
