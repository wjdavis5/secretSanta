import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './components/main/main.component';
import { ParticipantComponent } from './components/participant/participant.component';
import { AuthCallbackComponent } from './components/auth-callback/auth-callback.component';

const routes: Routes = [
  { path: 'callback', component: AuthCallbackComponent },
  {
    path: 'main',
    children: [
      { path: ':eventId', component: MainComponent },
      { path: '', redirectTo: '/main/new', pathMatch: 'full' }
    ]
  },
  { path: 'participant/:eventId/:participantId', component: ParticipantComponent },
  { path: '**', redirectTo: '/main' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
