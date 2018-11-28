import {Injectable} from '@angular/core'
import {HttpClient} from '@angular/common/http'
import {Observable} from 'rxjs'
import {User} from '../interfaces'
import {tap} from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private token = null
  private username = '';

  constructor(private http: HttpClient) {
  }

  register(user: User): Observable<User> {
    return this.http.post<User>('/api/auth/register', user)
  }

  login(user: User): Observable<{token: string, name: string}> {
    return this.http.post<{token: string, name: string}>('/api/auth/login', user)
      .pipe(
        tap(
          ({token,name}) => {
            localStorage.setItem('auth-token', token)
            this.setToken(token)
            localStorage.setItem('username', name)
            this.setUsername(name)
          }
        )
      )
  }

  setToken(token: string) {
    this.token = token
  }

  getToken(): string {
    return this.token
  }

  getUsername(): string {
    return this.username
  }

  setUsername(name: string) {
    this.username = name
  }

  isAuthenticated(): boolean {
    return !!this.token
  }

  logout() {
    this.setToken(null)
    localStorage.clear()
  }
}
