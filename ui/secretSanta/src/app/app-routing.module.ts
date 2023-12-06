import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './components/main/main.component';
import { ParticipantComponent } from './components/participant/participant.component';

const routes: Routes = [
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
