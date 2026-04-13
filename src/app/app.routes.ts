import { Routes } from '@angular/router';
import { UsersComponent } from './users/users';
import { ChatComponent } from './chat/chat';

export const routes: Routes = [
  { path: '', redirectTo: '', pathMatch: 'full' },

  { path: 'users', component: UsersComponent },
  { path: 'chat', component: ChatComponent }
];