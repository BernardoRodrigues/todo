import { UserModel } from './../../models/user.model';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'

@Injectable()
export class UserService {

  constructor(
    private httpClient: HttpClient,
    @Inject('BASE_API_URL') private apiUrl: string
    ) { }

  public login(email: string, password: string): Observable<{user: UserModel, token: string}> {
    return this.httpClient.post<{email: string, firstName: string, lastName: string, token: string, id: string}>(`${this.apiUrl}/user/login`, {
      email: email,
      password: password
    })
    .pipe(map((value) => {
        return {
          user: {
            id: value.id,
            email: value.email,
            firstName: value.firstName,
            lastName: value.lastName,
          },
          token: value.token
        }
      })
    )
  }

  public signup(email: string, password: string, firstName: string, lastName: string): Observable<{id: string, token: string}> {
    return this.httpClient.post<{id: string, token: string}>(`${this.apiUrl}/user/signup`, {email: email, password: password, firstName: firstName, lastName: lastName})
  }

  public logout(): Observable<void>{
    return this.httpClient.get<void>(`${this.apiUrl}/user/logout`)
  }

}
