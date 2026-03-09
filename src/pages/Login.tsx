import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useLoginMutation } from '../services/api';
import { setToken } from '../store/slices/authSlice';

const Login: React.FC = () => {
  const [email, setEmail] = useState(() => localStorage.getItem('rememberMe') === 'true' ? localStorage.getItem('email') || '' : '');
  const [password, setPassword] = useState('');
  const [rememberEmail, setRememberEmail] = useState(() => localStorage.getItem('rememberMe') === 'true');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => { localStorage.removeItem('password'); }, []);
  async function submit(event: React.FormEvent) {
    event.preventDefault(); setError('');
    try {
      const result = await login({ email, password }).unwrap();
      dispatch(setToken(result.access));
      if (rememberEmail) { localStorage.setItem('rememberMe', 'true'); localStorage.setItem('email', email); }
      else { localStorage.removeItem('rememberMe'); localStorage.removeItem('email'); }
      setPassword(''); navigate('/dashboard');
    } catch { setError('Could not log in. Check your details and whether the API is available.'); }
  }
  return <main className="min-h-screen bg-stone-50 text-slate-900 flex flex-col lg:flex-row">
    <section className="bg-emerald-950 text-white px-8 py-12 lg:px-16 lg:py-24 lg:w-1/2 flex flex-col justify-center">
      <p className="text-xs tracking-[.2em] uppercase text-emerald-200">Property research workspace</p>
      <h1 className="text-4xl lg:text-5xl font-semibold leading-tight mt-6 max-w-lg">Keep the records.<br />Review the evidence.</h1>
      <p className="text-emerald-100 mt-7 max-w-md leading-relaxed">Organize lease revisions, rental batches and model-generated research notes in one working space.</p>
      <p className="text-emerald-200 text-sm mt-12 max-w-md">Prototype · Generated notes need independent verification. Use synthetic data until private document storage is configured.</p>
    </section>
    <section className="flex-1 flex items-center justify-center px-8 py-14"><div className="w-full max-w-sm">
      <h2 className="text-3xl font-semibold">Log in</h2><p className="text-slate-600 mt-3">Use an account created in your local backend.</p>
      <form onSubmit={submit} className="space-y-5 mt-9">
        <div><label htmlFor="email-address" className="block text-sm font-medium mb-2">Email</label><input id="email-address" type="email" autoComplete="email" required value={email} onChange={event=>setEmail(event.target.value)} className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3" /></div>
        <div><label htmlFor="password" className="block text-sm font-medium mb-2">Password</label><div className="flex"><input id="password" type={showPassword?'text':'password'} autoComplete="current-password" required value={password} onChange={event=>setPassword(event.target.value)} className="w-full min-w-0 rounded-l-lg border border-slate-300 bg-white px-4 py-3" /><button type="button" aria-label={showPassword?'Hide password':'Show password'} onClick={()=>setShowPassword(!showPassword)} className="rounded-r-lg border border-l-0 border-slate-300 px-3 text-sm">{showPassword?'Hide':'Show'}</button></div></div>
        <label className="flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" checked={rememberEmail} onChange={event=>setRememberEmail(event.target.checked)} />Remember email only</label>
        {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
        <button disabled={isLoading} className="w-full rounded-lg bg-emerald-800 text-white py-3 font-medium disabled:opacity-60">{isLoading?'Logging in…':'Log in'}</button>
      </form><p className="text-xs text-slate-500 mt-6">Passwords are never saved by this app. Password reset is unavailable in the companion prototype API.</p>
    </div></section>
  </main>;
};
export default Login;
