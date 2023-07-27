import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { AuthGuard } from '../core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    // canActivateChild: [AuthGuard],
    children: [
      // {
      //   path: 'test',
      //   loadChildren: () =>
      //     import(`./test/test.component`).then((m) => m.TestComponent),
      // },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GameBodyRoutingModule {}
