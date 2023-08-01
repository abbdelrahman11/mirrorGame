import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { RoomsComponent } from './rooms/rooms.component';
import { RoomBodyComponent } from './room-body/room-body.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'rooms',
        component: RoomsComponent,
      },
      {
        path: 'roombody',
        component: RoomBodyComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GameBodyRoutingModule {}
