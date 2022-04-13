import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AddslotsService {

  constructor(private htppclient: HttpClient) { }

 /* saveUser(user:any): Observable<any>{
    return this.htppclient.post("http://localhost:3000/users",user);
  }*/

  saveUser(user:any): Observable<any>{
    return this.htppclient.post("http://localhost:3000/users",user);
  }

  addUser(user:any){
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


