import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { UserListComponent } from './components/users/user-list/user-list.component';
import { GroupEditComponent } from './components/groups/group-edit/group-edit.component';
import { WordEditComponent } from './components/words/word-edit/word-edit.component';
import { authGuard } from './guards/auth.guard';
import { UserRegisterComponent } from './components/users/user-register/user-register.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'register', component: UserRegisterComponent },

  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [authGuard],
    children: [
      { path: 'users', component: UserListComponent },
      { path: 'groups', component: GroupEditComponent },
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
