import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { RoomsComponent } from './pages/rooms/rooms.component';
import { RoomBodyComponent } from './pages/room-body/room-body.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'rooms/:id',
        component: RoomsComponent,
      },
      {
        path: 'roombody/:roomName/:gameId/:id',
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
