import React from 'react'
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'

const modules = {
    toolbar: [
        [{ header: [2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link', 'blockquote'],
        ['clean'],
    ],
}

const formats = ['header', 'bold', 'italic', 'underline', 'strike', 'list', 'link', 'blockquote']

// Controlled rich-text field — value/onChange carry HTML, same contract as
// a plain <textarea>. Used anywhere admin content needs formatting instead
// of plain text (post content, project descriptions, …).
const RichTextEditor = ({ value, onChange, placeholder }) => (
    <ReactQuill
        className="st-rich-editor"
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
    />
)

export default RichTextEditor
