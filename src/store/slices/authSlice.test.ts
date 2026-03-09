import { readPersistedUser } from './authSlice'
it('ignores malformed persisted user JSON without crashing startup',()=>{
 localStorage.setItem('user','broken-json');expect(readPersistedUser()).toBeNull();expect(localStorage.getItem('user')).toBeNull()
})
