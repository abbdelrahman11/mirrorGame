import { Component, Input, OnInit } from '@angular/core';
import { Result } from 'src/app/core/interfaces/result';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css'],
})
export class ResultsComponent implements OnInit {
  @Input() Results!: Result[];
  showTheResults!: boolean;
  sumOfPoints: any = {};
  constructor(private toastr: ToastrService) {}
  ngOnChanges(): void {
    if (this.Results) {
      this.getsumsOfThePlayersPoints(this.Results);
    }
  }
  getsumsOfThePlayersPoints(Result: Result[]) {
    this.sumOfPoints = {};
    Result.forEach((element: Result) => {
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
    this.checkIfTheGamEnded(this.sumOfPoints);
  }
  ngOnInit(): void {}
  getResult() {
    if (!this.Results?.length) {
      this.toastr.info('Result Empty');
    } else {
      this.showTheResults = !this.showTheResults;
    }
  }
  checkIfTheGamEnded(points: any) {
    console.log(points);
  }
}
