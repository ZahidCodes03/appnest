import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import api from '../lib/api'

export default function MyProjects() {
    const [projects, setProjects] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const { data } = await api.get('/projects/mine')
                setProjects(data)
            } catch (error) { console.error('Failed to fetch projects') }
            finally { setLoading(false) }
        }
        fetchProjects()
    }, [])

    if (loading) return <div className="text-center p-8">Loading projects...</div>
    if (projects.length === 0) return <div className="text-center p-8 text-gray-500">No projects found.</div>

    return (
        <div className="space-y-6">
            {projects.map((project, i) => (
                <motion.div key={project.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-white rounded-2xl border border-gray-100 p-6">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">{project.name}</h3>
                            <p className="text-sm text-gray-500">Deadline: {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'N/A'}</p>
                        </div>
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                            {project.status.replace('_', ' ')}
                        </span>
                    </div>

                    <div className="flex items-center gap-3 mb-6">
                        <div className="flex-1 bg-gray-100 rounded-full h-3">
                            <div className="bg-gradient-to-r from-blue-500 to-cyan-400 h-3 rounded-full transition-all" style={{ width: `${project.progress || 0}%` }} />
                        </div>
                        <span className="text-sm font-bold text-gray-700">{project.progress || 0}%</span>
                    </div>

                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Description</h4>
                    <p className="text-sm text-gray-600">{project.description || 'No description provided.'}</p>
                </motion.div>
            ))}
        </div>
    )
}
