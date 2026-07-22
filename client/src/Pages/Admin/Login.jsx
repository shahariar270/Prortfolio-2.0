import React, { useState } from 'react'
import { api, setToken } from './api'
import { adminProfile } from './helper'

export const Login = ({ onLogin }) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [busy, setBusy] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setBusy(true)
        setError('')
        try {
            const data = await api.login(email.trim(), password)
            setToken(data.token)
            onLogin()
        } catch (err) {
            setError(err.message)
        } finally {
            setBusy(false)
        }
    }

    return (
        <div className="st-admin__login">
            <form className="st-admin__login-card" onSubmit={handleSubmit}>
                <img src={adminProfile.avatar} alt="" />
                <h1>Admin panel</h1>
                <p>Sign in to manage your portfolio</p>
                <label>
                    <span>Email</span>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        autoComplete="username"
                        required
                    />
                </label>
                <label>
                    <span>Password</span>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        autoComplete="current-password"
                        required
                    />
                </label>
                {error && <p className="st-admin__login-error">{error}</p>}
                <button type="submit" disabled={busy}>
                    {busy ? 'Signing in…' : 'Sign in'}
                </button>
            </form>
        </div>
    )
}
