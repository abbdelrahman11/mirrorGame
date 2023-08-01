import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GameBodyRoutingModule } from './game-body-routing.module';
import { LayoutComponent } from './layout/layout.component';
import { RouterModule } from '@angular/router';
import { RoomsComponent } from './rooms/rooms.component';
import { RoomBodyComponent } from './room-body/room-body.component';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [LayoutComponent, RoomsComponent, RoomBodyComponent],
  imports: [
    CommonModule,
    FormsModule,
    GameBodyRoutingModule,
    RouterModule,
    DialogModule,
    DropdownModule,
  ],
})
export class GameBodyModule {}
