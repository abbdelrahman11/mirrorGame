import {
  Component,
  Input,
  OnInit,
  HostListener,
  Output,
  EventEmitter,
} from '@angular/core';
import { Result } from 'src/app/core/interfaces/result';
import { ToastrService } from 'ngx-toastr';
import { Points } from 'src/app/core/interfaces/point';
import { Router } from '@angular/router';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css'],
})
export class ResultsComponent implements OnInit {
  @Input() Results!: Result[];
  @Input() userId!: string | undefined;
  @Input() showGameFinished!: boolean;
  @Input() playersInfo: any;
  showTheResults!: boolean;
  sumOfPoints: any = {};
  theWinner!: number;

  // @HostListener('document:click', ['$event'])
  // onDocumentClick(event: MouseEvent) {
  //   const clickedElement = event.target as HTMLElement;
  //   const result = document.getElementById('result');
  //   if (result && !result.contains(clickedElement)) {
  //     this.showTheResults = false;
  //   }
  // }

  constructor(private toastr: ToastrService, private router: Router) {}
  ngOnChanges(): void {
    if (this.Results) {
      this.getsumsOfThePlayersPoints(this.Results);
    }
  }

  ngOnInit(): void {}
  getResult() {
    if (!this.Results?.length) {
      this.toastr.info('Result Empty');
    } else {
      this.showTheResults = !this.showTheResults;
    }
  }
  getsumsOfThePlayersPoints(Results: Result[]) {
    this.sumOfPoints = {};
    Results.forEach((element: Result) => {
      if (element.round) {
        let playersPoints: any = element.round;
        for (let index = 1; index < 5; index++) {
          if (!this.sumOfPoints['player' + index]) {
            this.sumOfPoints['player' + index] = 0;
          }
          this.sumOfPoints['player' + index] += playersPoints['player' + index];
        }
      }
    });
    if (Object.keys(this.sumOfPoints).length) {
      const smallestKey = Object.keys(this.sumOfPoints).reduce((a, b) =>
        this.sumOfPoints[a] < this.sumOfPoints[b] ? a : b
      );
      this.theWinner = Object.keys(this.sumOfPoints).indexOf(smallestKey);
    }
  }
  goHome() {
    // this.router.navigate(['']);
    this.router.navigate(['rooms', this.userId]);
  }
}
