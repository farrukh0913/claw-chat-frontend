import { Component, computed, effect, Signal, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { interval, map } from 'rxjs';
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
  usersSig: Signal<any> | undefined;
  description: string = '';

  constructor(private userService: UserService) {
    this.userSig = toSignal(this.userService.user$, { initialValue: null as any });
    this.usersSig = toSignal(this.userService.users$, { initialValue: [] as any[] });
  }

  ngOnInit() {
    this.userService.test$.subscribe((value) => {
      console.log('test value:', value);
      this.description = value;
    });

    this.userService.user$.subscribe((user) => {
      if(!user){
        this.userService.getUsers();
      }
    });

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
    return {  totalUsers: users?.count || 0 };
  });

  effect = effect(() => {
    console.log('effect Total Users:' + this.dashboardSignal()?.totalUsers); // need to read the value of the signal to trigger the dashboardSignal
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

  // add a new user
  addUser() {
    const current = this.userService.usersListSubject.value;

    this.userService.usersListSubject.next([
      ...current,
      { id: current.length + 1, name: 'New User' },
    ]);
  }

  // switch user to a random user
  switchUser() {
    const users = this.usersSig?.();
    if (users?.length) {
      const randomIndex = Math.floor(Math.random() * users.length);
      this.userService.userSubject.next(users[randomIndex]);
    }
  }
}