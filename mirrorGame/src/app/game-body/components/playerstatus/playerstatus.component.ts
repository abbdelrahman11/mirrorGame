import { Component, Input, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';

@Component({
  selector: 'app-playerstatus',
  templateUrl: './playerstatus.component.html',
  styleUrls: ['./playerstatus.component.css'],
})
export class PlayerstatusComponent implements OnInit {
  @Input() finishTheRound!: number;
  @Input() playersIndex!: number;
  @Input() showOneCardFromAllThePlayers!: boolean;
  @Input() cardIsBasra!: boolean;
  @Input() TakeOneCardAndGiveOne!: boolean;
  @Input() showOneCardOfOtherPlayerCards!: boolean;
  @Input() showOneOfYourCard!: boolean;
  @Input() playerNumber!: number;
  @Input() makeCanPullFromPullCardActive!: boolean;
  @Input() canPullFromPullCard!: boolean;
  @Input() playerName!: string | undefined;
  constructor(private store: Store<any>) {
    // this.store
    //   .pipe(select('tasks'))
    //   .subscribe((tasks: ) => ());
  }

  ngOnInit(): void {}
}
