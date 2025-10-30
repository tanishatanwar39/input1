import { useState, useEffect } from 'react'
import './Form.css'

function Form() {
    const [form, setForm] = useState({
        name: '',
        class: '',
        section: '',
        email: '',
        subject: '',
        q1: '',
        q2: ''
    })
    const [status, setStatus] = useState(null)
    const [list, setList] = useState([])

    function onChange(e) {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value }))
    }

    async function onSubmit(e) {
        e.preventDefault()
        setStatus('sending')
        try {
            const res = await fetch('http://localhost:4000/api/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            })
            if (!res.ok) throw new Error('Network error')
            setStatus('saved')
            setForm({ name: '', class: '', section: '', email: '', subject: '', q1: '', q2: '' })
            // refresh list after successful submit
            await loadList()
        } catch (err) {
            setStatus('error')
            console.error(err)
        }
    }

    async function loadList() {
        try {
            const res = await fetch('http://localhost:4000/api/feedback')
            if (!res.ok) throw new Error('Network error')
            const data = await res.json()
            setList(Array.isArray(data) ? data.reverse() : [])
        } catch (err) {
            console.error('Failed to load feedback list', err)
            setList([])
        }
    }

    useEffect(() => {
        loadList()
    }, [])

    return (
        <div className="feedback-page">
        <form className="feedback-form" onSubmit={onSubmit}>
            <h2>Feedback form</h2>

            <div className="field">
                <label>Name</label>
                <input name="name" value={form.name} onChange={onChange} placeholder="Name" />
            </div>

            <div className="field">
                <label>Class</label>
                <input name="class" value={form.class} onChange={onChange} placeholder="Class" />
            </div>

            <div className="field">
                <label>Section</label>
                <input name="section" value={form.section} onChange={onChange} placeholder="Section" />
            </div>

            <div className="field">
                <label>Email</label>
                <input name="email" type="email" value={form.email} onChange={onChange} placeholder="Email" />
            </div>

            <div className="field">
                <label>Subject</label>
                <input name="subject" value={form.subject} onChange={onChange} placeholder="Subject" />
            </div>

            <div className="field">
                <label>Q1 - How would you rate the teaching quality?</label>
                <input name="q1" value={form.q1} onChange={onChange} placeholder="feedback" />
            </div>

            <div className="field">
                <label>Q2 - Did the teacher explain concepts clearly?</label>
                <input name="q2" value={form.q2} onChange={onChange} placeholder="feedback" />
            </div>

            <div className="actions">
                <button className="btn" type="submit">Send feedback</button>
                <div className="status">
                    {status === 'sending' && <span className="muted">Sending...</span>}
                    {status === 'saved' && <span className="success">Saved ✓</span>}
                    {status === 'error' && <span className="error">Error</span>}
                </div>
            </div>
    </form>

        <section className="feedback-list">
            <h3>Submitted feedback</h3>
            {list.length === 0 && <div className="empty">No feedback yet.</div>}
            {list.map(item => (
                <article key={item._id || item.id || item.createdAt} className="feedback-item">
                    <div className="row">
                        <div className="who">
                            <strong>{item.name || 'Anonymous'}</strong>
                            <div className="meta">{item.class ? `Class ${item.class}` : ''} {item.section ? `· Section ${item.section}` : ''}</div>
                        </div>
                        <div className="when">{item.createdAt ? new Date(item.createdAt).toLocaleString() : ''}</div>
                    </div>
                    {item.subject && <div className="subject">Subject: {item.subject}</div>}
                    <div className="answers">
                        {item.q1 && <div><strong>Q1:</strong> {item.q1}</div>}
                        {item.q2 && <div><strong>Q2:</strong> {item.q2}</div>}
                    </div>
                    {item.email && <div className="meta small">Email: {item.email}</div>}
                </article>
            ))}
        </section>
        </div>
    )
}

export default Form