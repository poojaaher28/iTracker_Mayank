import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class AddslotsService {

 // url = 'http://localhost:3000/users';

  constructor(private httpclient: HttpClient) { }

  saveUser(user: any): Observable<any>{
    return this.httpclient.post("http://localhost:3000/users",user);
  }
  
  addUser(user: any) {
    let users = [];
    
    if(localStorage.getItem('Users')){
      users = JSON.parse(localStorage.getItem('Users'));
      users = [user, ...users];
    } else {
      users = [user];
    }
    localStorage.setItem('Users',JSON.stringify(users));

  }
}
