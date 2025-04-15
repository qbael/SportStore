import { useState, useEffect } from 'react'

import '../../css/admin/Admin.css'

import { useAdminLogin } from '../../hook/useAdminLogin.tsx'
import { useNotification } from '../../hook/useNotification2.tsx'

export default function AdminLogin() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const {showNotification} = useNotification()

    const { login, error, setError } = useAdminLogin()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email || !password) {
            showNotification('Vui lòng nhập đầy đủ thông tin', 'info')
            return
        }

        await login(email, password)
    }

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                setError('')
                setEmail('')
                setPassword('')
            }, 3000)
            return () => clearTimeout(timer)
        }
    }, [error])

    return (
        <div className='admin-login-container'>
            <form id='admin-login'
                  onSubmit={handleSubmit}
            >
                <h1>Admin</h1>

                <div className='admin-login-input'>
                    <input type='email' placeholder='Email' value={email}
                           onChange={(e) => setEmail(e.target.value)}></input>
                </div>

                <div className='admin-login-input'>
                    <input type='password' placeholder='Password' value={password}
                           onChange={(e) => setPassword(e.target.value)}></input>
                </div>
                <div className={'mt-1'}
                     style={{ height: '1.5rem' }}>
                    {error && <p className="text-danger fs-6 m-0">{error}</p>}
                </div>
                <div className={"w-100 text-center mt-2"}>
                    <button type="button" className="btn btn-primary w-100"
                            onClick={handleSubmit}
                    >Đăng nhập</button>
                </div>
            </form>
        </div>
    )
}
