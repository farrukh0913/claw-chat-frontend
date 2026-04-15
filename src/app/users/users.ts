import { Component, computed, effect, Signal, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, interval, map } from 'rxjs';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.html',
  styleUrls: ['./users.css'],
  standalone: true,
  imports: [FormsModule, HttpClientModule, CommonModule],
})
export class UsersComponent {
  testVariable = signal(0);
  userSig: Signal<any> | undefined;
  usersSig: Signal<any[]> | undefined;

  constructor(private userService: UserService) {
    this.userSig = toSignal(this.userService.user$, { initialValue: null as any });
    this.usersSig = toSignal(this.userService.users$, { initialValue: [] as any[] });
  }

  ngOnInit() {
    this.userService.getUsers();
  }

  // -----------------------------
  // MOCK OBSERVABLES (replace with API later)
  // -----------------------------

  private activitySubject = interval(2000).pipe(
    map(() => new Date().toLocaleTimeString())
  );

  // -----------------------------
  // CONVERT OBSERVABLES → SIGNALS
  // -----------------------------


  timeSig = toSignal(this.activitySubject, {
    initialValue: '',
  });

  dashboardSignal = computed(() => {
    const users = this.usersSig?.();
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
    const user = this.userSig?.();
    const users = this.usersSig?.();
    const time = this.timeSig();

    return {
      currentUser: user?.name,
      role: user?.role,
      totalUsers: users?.length || 0,
      lastUpdate: time,
      isAdmin: user?.role === 'Admin',
    };
  });

  // -----------------------------
  // ACTIONS
  // -----------------------------
  addUser() {
    const current = this.userService.usersListSubject.value;

    this.userService.usersListSubject.next([
      ...current,
      { id: current.length + 1, name: 'New User' },
    ]);
  }

  changeUser() {
    this.userService.userSubject.next({
      name: 'Updated User',
      role: 'Editor',
    });
  }
}