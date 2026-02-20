import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import api from '../lib/api'

export default function Settings() {
    const [settings, setSettings] = useState({
        companyName: '', email: '', phone: '', address: '', whatsapp: '',
        facebook: '', twitter: '', linkedin: '', instagram: '', upi_id: ''
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const { data } = await api.get('/settings')
                if (data && Object.keys(data).length > 0) setSettings(prev => ({ ...prev, ...data }))
            } catch (error) {
                console.error('Failed to fetch settings')
            } finally {
                setLoading(false)
            }
        }
        fetchSettings()
    }, [])

    const handleSave = async (e) => {
        e.preventDefault()
        try {
            await api.post('/settings', settings)
            toast.success('Settings saved successfully')
        } catch (error) {
            toast.error('Failed to save settings')
        }
    }

    if (loading) return <div className="p-8 text-center">Loading settings...</div>

    return (
        <div className="max-w-2xl">
            <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSave} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
                <h2 className="text-lg font-bold text-gray-900">Company Settings</h2>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                    <input value={settings.companyName} onChange={(e) => setSettings({ ...settings, companyName: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm" />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input value={settings.email} onChange={(e) => setSettings({ ...settings, email: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <input value={settings.phone} onChange={(e) => setSettings({ ...settings, phone: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm" />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <input value={settings.address} onChange={(e) => setSettings({ ...settings, address: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number</label>
                    <input value={settings.whatsapp} onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">UPI ID (for payments)</label>
                    <input placeholder="e.g. valid-upi-id@okaxis" value={settings.upi_id || ''} onChange={(e) => setSettings({ ...settings, upi_id: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm" />
                </div>

                <h3 className="text-base font-bold text-gray-900 pt-4">Social Media Links</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                    {['facebook', 'twitter', 'linkedin', 'instagram'].map((key) => (
                        <div key={key}>
                            <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{key}</label>
                            <input value={settings[key]} onChange={(e) => setSettings({ ...settings, [key]: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm" />
                        </div>
                    ))}
                </div>

                <button type="submit" className="btn-primary">Save Settings</button>
            </motion.form>
        </div>
    )
}
