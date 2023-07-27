import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [

  {
    path: '',
    loadChildren: () => import(`./game-body/game-body.module`).then((m) => m.GameBodyModule),
  },
  {
    path: 'login',
    loadChildren: () => import(`./auth/auth.module`).then((m) => m.AuthModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}