import { Directive, Input, TemplateRef, ViewContainerRef, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { AccountService } from '../services/account.service';
import { LoginUser } from '../../interfaces/user.interface';

@Directive({
  selector: '[appHasRole]'
})
export class HasRoleDirective implements OnInit {
  @Input() appHasRole: string = "";

  constructor(
    private viewContainerRef: ViewContainerRef,
    private templateRef: TemplateRef<any>,
    private accountService: AccountService
  ) { }

  ngOnInit(): void {
    this.accountService.currentUser$.pipe(take(1)).subscribe((user: LoginUser | null) => {
      if (user && this.checkRole(user)) {
        this.viewContainerRef.createEmbeddedView(this.templateRef);
      } else {
        this.viewContainerRef.clear();
      }
    });
  }

  private checkRole(user: LoginUser | null): boolean {
    return user !== null && user.role === this.appHasRole;
  }
}
