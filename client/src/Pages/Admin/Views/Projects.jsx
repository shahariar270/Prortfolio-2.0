import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProjects, saveProject as saveProjectThunk, deleteProject as deleteProjectThunk } from '../../../store/slices/projectsSlice'
import { ProjectEditorModal } from '../ProjectEditorModal'

const CATEGORY_LABELS = {
    design: 'Web Design',
    development: 'Web Development',
}

// Reads from the Redux cache when available — fetchProjects is
// condition-gated and skips the network call entirely if already loaded.
export const Projects = ({ onError, onNotify }) => {
    const dispatch = useDispatch()
    const projects = useSelector((state) => state.projects.items)
    const [editor, setEditor] = useState(null)

    useEffect(() => {
        dispatch(fetchProjects()).then((action) => {
            if (fetchProjects.rejected.match(action) && !action.meta.condition) onError(action.payload)
        })
        // onError intentionally omitted — it's a fresh function every render
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch])

    const openNewProjectEditor = () => {
        setEditor({
            index: null,
            category: 'development',
            label: '',
            type: '',
            description: '',
            technologies: '',
            liveDemo: '',
            image: '',
        })
    }

    const openEditProjectEditor = (index) => {
        const project = projects[index]
        setEditor({
            index,
            category: project.category,
            label: project.label,
            type: project.type || '',
            description: project.description || '',
            // stored as an array — comma-joined for editing
            technologies: (project.technologies || []).join(', '),
            liveDemo: project.liveDemo || '',
            image: project.image || '',
        })
    }

    const splitTechnologies = (text) =>
        (text || '')
            .split(',')
            .map((tech) => tech.trim())
            .filter(Boolean)

    const saveProject = async (draft) => {
        const label = (draft.label || '').trim() || 'Untitled project'
        const technologies = splitTechnologies(draft.technologies)
        try {
            let body
            if (draft.imageFile) {
                body = new FormData()
                body.append('label', label)
                body.append('category', draft.category)
                body.append('type', draft.type)
                body.append('description', draft.description)
                technologies.forEach((tech) => body.append('technologies', tech))
                body.append('liveDemo', draft.liveDemo)
                body.append('image', draft.imageFile)
            } else {
                body = {
                    label,
                    category: draft.category,
                    type: draft.type,
                    description: draft.description,
                    technologies,
                    liveDemo: draft.liveDemo,
                }
                // send the image only when it's a real URL or an explicit
                // clear — never a stale FileReader data: preview
                if (!draft.image || !draft.image.startsWith('data:')) {
                    body.image = draft.image
                }
            }

            const id = draft.index === null ? undefined : projects[draft.index]._id
            await dispatch(saveProjectThunk({ id, body })).unwrap()
            onNotify(draft.index === null ? 'Project created' : 'Project saved')
            setEditor(null)
        } catch (err) {
            onError(err)
        }
    }

    const removeProject = async (index) => {
        try {
            await dispatch(deleteProjectThunk(projects[index]._id)).unwrap()
            onNotify('Project deleted')
        } catch (err) {
            onError(err)
        }
    }

    return (
        <main className="st-admin__view">
            <div className="st-admin__view-bar">
                <span>{projects.length} projects</span>
                <button type="button" className="st-admin__btn-primary" onClick={openNewProjectEditor}>
                    ＋ New project
                </button>
            </div>
            <div className="st-admin__post-list">
                {projects.length === 0 && (
                    <p className="st-admin__empty">No projects yet — add your first one.</p>
                )}
                {projects.map((project, index) => (
                    <div className="st-admin__card st-admin__post" key={project._id ?? `${project.label}-${index}`}>
                        <img src={project.image} alt={project.label} />
                        <div className="st-admin__post-body">
                            <div className="st-admin__post-tags">
                                <span className="st-admin__chip">{CATEGORY_LABELS[project.category] ?? project.category}</span>
                            </div>
                            <strong>{project.label}</strong>
                            <span className="st-admin__post-meta">{project.type}</span>
                        </div>
                        <div className="st-admin__post-actions">
                            <button
                                type="button"
                                className="st-admin__btn-ghost"
                                onClick={() => removeProject(index)}
                            >
                                Delete
                            </button>
                            <button
                                type="button"
                                className="st-admin__btn-primary"
                                onClick={() => openEditProjectEditor(index)}
                            >
                                Edit
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {editor && (
                <ProjectEditorModal
                    editor={editor}
                    onSave={saveProject}
                    onClose={() => setEditor(null)}
                />
            )}
        </main>
    )
}
