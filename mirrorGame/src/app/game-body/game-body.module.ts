import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GameBodyRoutingModule } from './game-body-routing.module';
import { LayoutComponent } from './layout/layout.component';
import { RouterModule } from '@angular/router';
import { RoomsComponent } from './rooms/rooms.component';

@NgModule({
  declarations: [LayoutComponent, RoomsComponent],
  imports: [CommonModule, GameBodyRoutingModule, RouterModule],
})
export class GameBodyModule {}
