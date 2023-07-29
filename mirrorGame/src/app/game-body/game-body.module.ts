import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GameBodyRoutingModule } from './game-body-routing.module';
import { LayoutComponent } from './layout/layout.component';
import { TestComponent } from './test/test.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [LayoutComponent, TestComponent],
  imports: [CommonModule, GameBodyRoutingModule, RouterModule],
})
export class GameBodyModule {}
