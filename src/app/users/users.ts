import { Component, computed, effect, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, interval, map } from 'rxjs';

@Component({
  selector: 'app-users',
  templateUrl: './users.html',
  styleUrls: ['./users.css'],
  standalone: true,
  imports: [FormsModule, HttpClientModule, CommonModule],
})
export class UsersComponent {
  testVariable = signal(0);

  // -----------------------------
  // MOCK OBSERVABLES (replace with API later)
  // -----------------------------
  private userSubject = new BehaviorSubject<any>({
    name: 'Farrukh',
    role: 'Admin',
  });

  private usersListSubject = new BehaviorSubject<any[]>([
    { id: 1, name: 'Ali' },
    { id: 2, name: 'Ahmed' },
  ]);

  private activitySubject = interval(2000).pipe(
    map(() => new Date().toLocaleTimeString())
  );

  // -----------------------------
  // CONVERT OBSERVABLES → SIGNALS
  // -----------------------------
  userSig = toSignal(this.userSubject.asObservable(), {
    initialValue: null,
  });

  usersSig = toSignal(this.usersListSubject.asObservable(), {
    initialValue: [],
  });

  timeSig = toSignal(this.activitySubject, {
    initialValue: '',
  });

  dashboardSignal = computed(() => {
    console.log('dashboardSignal computed');
    const users = this.usersSig();
    return { 
      // testVariable: 2 + users.length,
      value: users?.length
    };
  });

  effect1 = effect(() => {
    console.log('effect1 value:' + this.dashboardSignal()?.value); // need to read the value of the signal to trigger the dashboardSignal
  });

  // -----------------------------
  // COMPUTED DERIVED STATE
  // -----------------------------
  dashboard = computed(() => {
    console.log('Computed state:');
    const user = this.userSig();
    const users = this.usersSig();
    const time = this.timeSig();

    return {
      currentUser: user?.name,
      role: user?.role,
      totalUsers: users.length,
      lastUpdate: time,
      isAdmin: user?.role === 'Admin',
    };
  });

  // -----------------------------
  // ACTIONS
  // -----------------------------
  addUser() {
    const current = this.usersListSubject.value;

    this.usersListSubject.next([
      ...current,
      { id: current.length + 1, name: 'New User' },
    ]);
  }

  changeUser() {
    this.userSubject.next({
      name: 'Updated User',
      role: 'Editor',
    });
  }
}