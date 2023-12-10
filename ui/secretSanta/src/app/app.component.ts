import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'secretSanta';
  constructor(public auth: AuthService) { }

  login(){
    this.auth.loginWithRedirect().subscribe({
      next: (result) => {
        console.log(result)
        let x = this.auth.user$;
      },
      error: (err) => console.log(err),
      complete: () => console.log('complete')
    })
  }
}
