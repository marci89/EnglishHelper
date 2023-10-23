import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { UserListComponent } from './components/users/user-list/user-list.component';
import { authGuard } from './common/guards/auth.guard';
import { UserRegisterComponent } from './components/users/user-register/user-register.component';
import { adminGuard } from './common/guards/admin.guard';
import { UserEditComponent } from './components/users/user-edit/user-edit.component';
import { UserLoginComponent } from './components/users/user-login/user-login.component';
import { WordComponent } from './components/words/word/word.component';
import { ForgotPasswordComponent } from './components/users/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/users/reset-password/reset-password.component';
import { LearnSettingsComponent } from './components/learn/learn-settings/learn-settings.component';
import { LearnFlashcardModeComponent } from './components/learn/learn-flashcard-mode/learn-flashcard-mode.component';
import { LearnTypingModeComponent } from './components/learn/learn-typing-mode/learn-typing-mode.component';
import { LearnSelectionModeComponent } from './components/learn/learn-selection-mode/learn-selection-mode.component';
import { LearnListeningModeComponent } from './components/learn/learn-listening-mode/learn-listening-mode.component';
import { StatisticsTabMenuComponent } from './components/statistics/statistics-tab-menu/statistics-tab-menu.component';
import { TermsOfServiceComponent } from './components/shared/terms-of-service/terms-of-service.component';
import { PrivacyPolicyComponent } from './components/shared/privacy-policy/privacy-policy.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'register', component: UserRegisterComponent },
  { path: 'login', component: UserLoginComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'terms-of-service', component: TermsOfServiceComponent },
  { path: 'privacy-policy', component: PrivacyPolicyComponent },

  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [authGuard],
    children: [
      { path: 'users', component: UserListComponent, canActivate: [adminGuard] },
      { path: 'user/edit', component: UserEditComponent},
      { path: 'words', component: WordComponent },
      { path: 'learn-settings', component: LearnSettingsComponent },
      { path: 'learn-flashcard', component: LearnFlashcardModeComponent },
      { path: 'learn-typing', component: LearnTypingModeComponent },
      { path: 'learn-selection', component: LearnSelectionModeComponent },
      { path: 'learn-listening', component: LearnListeningModeComponent },
      { path: 'statistics', component: StatisticsTabMenuComponent },
    ]
  },
  { path: '**', component: HomeComponent, pathMatch: 'full' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
