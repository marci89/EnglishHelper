import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { UserListComponent } from './components/users/user-list/user-list.component';
import { WordEditComponent } from './components/words/word-edit/word-edit.component';
import { authGuard } from './common/guards/auth.guard';
import { UserRegisterComponent } from './components/users/user-register/user-register.component';
import { adminGuard } from './common/guards/admin.guard';
import { UserEditComponent } from './components/users/user-edit/user-edit.component';
import { UserLoginComponent } from './components/users/user-login/user-login.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'register', component: UserRegisterComponent },
  { path: 'login', component: UserLoginComponent },

  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [authGuard],
    children: [
      { path: 'users', component: UserListComponent, canActivate: [adminGuard] },
      { path: 'user/edit', component: UserEditComponent},
      { path: 'words', component: WordEditComponent }
    ]
  },
  { path: '**', component: HomeComponent, pathMatch: 'full' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
