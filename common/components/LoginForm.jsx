"use client"

import { useRouter } from "next/navigation";
import '../../styles/Login.module.css'
import { useState } from "react";


const LoginForm = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleEmailChange = (e) => setEmail(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);

    const handleSubmit = (e) => {
        e.prevent
    }
    return (
        <div>
            <h2>Login</h2>
            <form>
                <div className="formControl">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" value={email}       />
                </div>
            </form>
        </div>
    );
};

export default LoginForm;
