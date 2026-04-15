import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Environment } from '../environment';

@Injectable({
  providedIn: 'root',
})

export class UserService {
  // -------------------------
  // STATE (RxJS store)
  // -------------------------
  userSubject = new BehaviorSubject<any>({ name: 'Farrukh', role: 'Admin' });
  public user$ = this.userSubject.asObservable();

  usersListSubject = new BehaviorSubject<any[]>([]);
  public users$ = this.usersListSubject.asObservable();

  testSubject = new BehaviorSubject<string>('Users Status');
  public test$ = this.testSubject.asObservable();

  constructor(private http: HttpClient) {}

  // -------------------------
  // API CALL
  // -------------------------
  getUsers() {
    this.http.get<{ records: any[], count: number, success: boolean }>(Environment.API_URL + 'users').subscribe((users: { records: any[], count: number, success: boolean }) => {
      console.log('users:', users);
      this.usersListSubject.next(users.records);
      this.userSubject.next(users.records[0]);
    });
  }
}