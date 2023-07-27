import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GameBodyRoutingModule } from './game-body-routing.module';
import { LayoutComponent } from './layout/layout.component';

@NgModule({
  declarations: [LayoutComponent],
  imports: [CommonModule, GameBodyRoutingModule],
})
export class GameBodyModule {}
