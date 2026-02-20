import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { HiOutlineDownload, HiOutlineDocument } from 'react-icons/hi'
import api from '../lib/api'

export default function Deliverables() {
    const [deliverables, setDeliverables] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchDeliverables = async () => {
            try {
                const { data } = await api.get('/deliverables/mine')
                setDeliverables(data)
            } catch { console.error('Failed to fetch deliverables') }
            finally { setLoading(false) }
        }
        fetchDeliverables()
    }, [])

    if (loading) return <div className="text-center p-8">Loading...</div>
    if (deliverables.length === 0) return <div className="text-center p-8 text-gray-500">No deliverables found.</div>

    return (
        <div className="space-y-3">
            {deliverables.map((d, i) => (
                <motion.div key={d.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center justify-between hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                            <HiOutlineDocument className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="font-medium text-gray-900 text-sm">{d.title}</h3>
                            <p className="text-xs text-gray-500">{d.project_name} • {new Date(d.created_at).toLocaleDateString()}</p>
                        </div>
                    </div>
                    <a href={d.file_url} target="_blank" rel="noreferrer" className="p-2 rounded-lg hover:bg-blue-50 text-blue-600">
                        <HiOutlineDownload className="w-5 h-5" />
                    </a>
                </motion.div>
            ))}
        </div>
    )
}
