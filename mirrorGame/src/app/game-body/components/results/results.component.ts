import { Component, Input, OnInit } from '@angular/core';
import { Result } from 'src/app/core/interfaces/result';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css'],
})
export class ResultsComponent implements OnInit {
  @Input() showTheResult!: any;
  sumOfPoints: any = {};

  constructor() {}
  ngOnChanges(): void {
    if (this.showTheResult) {
      this.getsumsOfThePlayersPoints(this.showTheResult);
    }
  }
  getsumsOfThePlayersPoints(obj: Result[]) {
    this.sumOfPoints = {};
    obj.forEach((element) => {
      if (element.round.length) {
        let playersPoints: any = element.round[0];
        for (let index = 1; index < 5; index++) {
          if (!this.sumOfPoints['player' + index]) {
            this.sumOfPoints['player' + index] = 0;
          }
          this.sumOfPoints['player' + index] += playersPoints['player' + index];
        }
      }
    });
  }
  ngOnInit(): void {}
}
