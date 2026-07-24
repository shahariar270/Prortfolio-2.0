import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import { fetchProjects, saveProject as saveProjectThunk, deleteProject as deleteProjectThunk } from '../../../store/slices/projectsSlice'
import { ProjectEditor } from './ProjectEditor'

const CATEGORY_LABELS = {
    design: 'Web Design',
    development: 'Web Development',
}

// Reads from the Redux cache when available — fetchProjects is
// condition-gated and skips the network call entirely if already loaded.
// The create/edit form lives at this same route as ?action=new or
// ?action=edit&id=<projectId> instead of a modal, so it's a real,
// shareable, back-button-friendly URL.
export const Projects = ({ onError, onNotify }) => {
    const dispatch = useDispatch()
    const projects = useSelector((state) => state.projects.items)
    const projectsLoaded = useSelector((state) => state.projects.loaded)
    const [searchParams, setSearchParams] = useSearchParams()

    useEffect(() => {
        dispatch(fetchProjects()).then((action) => {
            if (fetchProjects.rejected.match(action) && !action.meta.condition) onError(action.payload)
        })
        // onError intentionally omitted — it's a fresh function every render
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch])

    const action = searchParams.get('action')
    const editId = searchParams.get('id')

    const openNewProjectEditor = () => setSearchParams({ action: 'new' })
    const openEditProjectEditor = (id) => setSearchParams({ action: 'edit', id })
    const closeEditor = () => setSearchParams({})

    const splitTechnologies = (text) =>
        (text || '')
            .split(',')
            .map((tech) => tech.trim())
            .filter(Boolean)

    const saveProject = async (draft, id) => {
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

            await dispatch(saveProjectThunk({ id, body })).unwrap()
            onNotify(id ? 'Project saved' : 'Project created')
            closeEditor()
        } catch (err) {
            onError(err)
        }
    }

    const removeProject = async (id) => {
        try {
            await dispatch(deleteProjectThunk(id)).unwrap()
            onNotify('Project deleted')
        } catch (err) {
            onError(err)
        }
    }

    if (action === 'new') {
        return (
            <ProjectEditor
                key="new"
                mode="new"
                onSave={saveProject}
                onCancel={closeEditor}
            />
        )
    }

    if (action === 'edit') {
        if (!projectsLoaded) {
            return (
                <main className="st-admin__view">
                    <p className="st-admin__empty">Loading…</p>
                </main>
            )
        }

        const editingProject = projects.find((project) => project._id === editId)
        if (!editingProject) {
            return (
                <main className="st-admin__view">
                    <p className="st-admin__empty">Project not found.</p>
                    <button type="button" className="st-admin__editor-back" onClick={closeEditor}>
                        ← Back to projects
                    </button>
                </main>
            )
        }

        return (
            <ProjectEditor
                key={editingProject._id}
                mode="edit"
                project={editingProject}
                onSave={saveProject}
                onCancel={closeEditor}
            />
        )
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
                {projects.map((project) => (
                    <div className="st-admin__card st-admin__post" key={project._id}>
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
                                onClick={() => removeProject(project._id)}
                            >
                                Delete
                            </button>
                            <button
                                type="button"
                                className="st-admin__btn-primary"
                                onClick={() => openEditProjectEditor(project._id)}
                            >
                                Edit
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    )
}
