import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router, CanActivate } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router) {
  }

  async canActivate(): Promise<boolean> {
    try {
      await this.auth.validateToken().toPromise();
      return true;
    }
    catch (e) {
      this.router.navigate(['/login']);
      return false;
    }
  }
  
}
