import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useLoginMutation } from '../services/api';
import { setToken } from '../store/slices/authSlice';
import Wordmark from '../components/Wordmark';

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
  return (
    <main className="flex min-h-screen flex-col bg-stone-50 text-stone-900 lg:flex-row">
      <section className="flex flex-col justify-between gap-12 bg-pine-950 px-8 py-10 text-white lg:w-1/2 lg:px-16 lg:py-14">
        <Wordmark />
        <div>
          <h1 className="max-w-lg text-4xl font-semibold leading-tight lg:text-5xl">
            Keep the records.
            <br />
            <span className="text-brass-300">Review the evidence.</span>
          </h1>
          <p className="mt-7 max-w-md leading-relaxed text-pine-100">
            Organize lease revisions, rental batches and model-generated research notes in one working space.
          </p>
        </div>
        <p className="max-w-md border-l-2 border-brass-500 pl-4 text-sm text-pine-200">
          Prototype. Generated notes need independent verification. Use synthetic data until private document storage is configured.
        </p>
      </section>
      <section className="flex flex-1 items-center justify-center px-6 py-14 sm:px-8">
        <div className="w-full max-w-sm">
          <h2 className="text-3xl font-semibold">Log in</h2>
          <p className="mt-3 text-stone-600">Use an account created in your local backend.</p>
          <form onSubmit={submit} className="mt-9 space-y-5">
            <div>
              <label htmlFor="email-address" className="mb-2 block text-sm font-medium">Email</label>
              <input id="email-address" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-lg border border-stone-300 bg-white px-4 py-3" />
            </div>
            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium">Password</label>
              <div className="flex">
                <input id="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} className="w-full min-w-0 rounded-l-lg border border-stone-300 bg-white px-4 py-3" />
                <button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword(!showPassword)} className="rounded-r-lg border border-l-0 border-stone-300 bg-white px-3 text-sm hover:bg-stone-100">
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm text-stone-700">
              <input type="checkbox" checked={rememberEmail} onChange={(event) => setRememberEmail(event.target.checked)} className="accent-pine-700" />
              Remember email only
            </label>
            {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
            <button disabled={isLoading} className="w-full rounded-lg bg-pine-700 py-3 font-medium text-white hover:bg-pine-800 disabled:opacity-60">
              {isLoading ? 'Logging in…' : 'Log in'}
            </button>
          </form>
          <p className="mt-6 text-xs text-stone-600">Passwords are never saved by this app. Password reset is unavailable in the companion prototype API.</p>
        </div>
      </section>
    </main>
  );
};
export default Login;
