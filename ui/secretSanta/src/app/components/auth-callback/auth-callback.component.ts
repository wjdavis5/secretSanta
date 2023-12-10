import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-auth-callback',
  template: `<p>Loading...</p>` // Simple template for loading state
})
export class AuthCallbackComponent implements OnInit {

  constructor(public auth: AuthService,private router: Router) {}

  ngOnInit() {
    this.auth.handleRedirectCallback().subscribe({
      next: (result) => {
        console.log(result);
        this.auth.handleRedirectCallback();
        this.router.navigateByUrl('/main');
      },
      error: (err) => console.log(err)
    });
  }
}
