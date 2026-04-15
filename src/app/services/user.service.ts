import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'https://jsonplaceholder.typicode.com/users';

  // -------------------------
  // STATE (RxJS store)
  // -------------------------
//   usersListSubject = new BehaviorSubject<any[]>([]);
//   users$ = this.usersListSubject.asObservable();

//   userSubject = new BehaviorSubject<any>(null);
//   user$ = this.userSubject.asObservable();


  userSubject = new BehaviorSubject<any>({ name: 'Farrukh', role: 'Admin' });
  public user$ = this.userSubject.asObservable();

  usersListSubject = new BehaviorSubject<any[]>([{ id: 1, name: 'Ali' }, { id: 2, name: 'Ahmed' }]);
  public users$ = this.usersListSubject.asObservable();


  constructor(private http: HttpClient) {}

  // -------------------------
  // API CALL
  // -------------------------
  getUsers() {
    this.http.get<any[]>(this.apiUrl).subscribe((users) => {
      this.usersListSubject.next(users);
    });
  }
}