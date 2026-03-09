import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import Login from '../../pages/Login'
const { submit } = vi.hoisted(()=>({submit:vi.fn()}))
vi.mock('../../services/api',()=>({useLoginMutation:()=>[()=>({unwrap:submit}),{isLoading:false}]}))
vi.mock('react-redux',()=>({useDispatch:()=>vi.fn()}))
beforeEach(()=>{localStorage.clear();submit.mockReset()})
it('removes a legacy saved password and remembers only an email after login',async()=>{
 localStorage.setItem('password','synthetic-old-password');submit.mockResolvedValue({access:'synthetic-token'})
 render(<MemoryRouter><Login/></MemoryRouter>);expect(localStorage.getItem('password')).toBeNull()
 fireEvent.change(screen.getByLabelText('Email'),{target:{value:'demo@example.test'}})
 fireEvent.change(screen.getByLabelText('Password'),{target:{value:'synthetic-new-password'}})
 fireEvent.click(screen.getByLabelText('Remember email only'));fireEvent.click(screen.getByRole('button',{name:'Log in'}))
 await waitFor(()=>expect(localStorage.getItem('email')).toBe('demo@example.test'))
 expect(localStorage.getItem('password')).toBeNull()
})
it('shows an actionable error when login fails',async()=>{
 submit.mockRejectedValue(new Error('offline'));render(<MemoryRouter><Login/></MemoryRouter>)
 fireEvent.change(screen.getByLabelText('Email'),{target:{value:'demo@example.test'}})
 fireEvent.change(screen.getByLabelText('Password'),{target:{value:'synthetic-password'}})
 fireEvent.click(screen.getByRole('button',{name:'Log in'}));expect(await screen.findByRole('alert')).toHaveTextContent('Could not log in')
})
