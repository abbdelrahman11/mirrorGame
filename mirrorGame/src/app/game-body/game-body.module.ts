import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameBodyRoutingModule } from './game-body-routing.module';
import { LayoutComponent } from './layout/layout.component';
import { RouterModule } from '@angular/router';
import { RoomsComponent } from './pages/rooms/rooms.component';
import { RoomBodyComponent } from './pages/room-body/room-body.component';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { CardComponent } from './components/card/card.component';
import { PlayerComponent } from './components/player/player.component';
import { MainPlayerComponent } from './components/main-player/main-player.component';
import { PullCardsComponent } from './components/pull-cards/pull-cards.component';
import { TableCardsComponent } from './components/table-cards/table-cards.component';
import { ResultsComponent } from './components/results/results.component';
import { WaitThePlayerComponent } from './components/wait-the-player/wait-the-player.component';
import { SayMirrorComponent } from './components/say-mirror/say-mirror.component';
import { GameFinishedComponent } from './components/game-finished/game-finished.component';
import { PlayerstatusComponent } from './components/playerstatus/playerstatus.component';

@NgModule({
  declarations: [
    LayoutComponent,
    RoomsComponent,
    RoomBodyComponent,
    CardComponent,
    PlayerComponent,
    MainPlayerComponent,
    PullCardsComponent,
    TableCardsComponent,
    ResultsComponent,
    WaitThePlayerComponent,
    SayMirrorComponent,
    GameFinishedComponent,
    PlayerstatusComponent,
  ],
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
