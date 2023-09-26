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

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css'],
})
export class ResultsComponent implements OnInit {
  @Input() Results!: Result[];
  showTheResults!: boolean;
  sumOfPoints: any = {};
  @Output() theWinner = new EventEmitter<string>();
  @Output() startTheGame = new EventEmitter<boolean>(false);
  endTheGame: boolean = false;

  // @HostListener('document:click', ['$event'])
  // onDocumentClick(event: MouseEvent) {
  //   const clickedElement = event.target as HTMLElement;
  //   const result = document.getElementById('result');
  //   console.log(clickedElement);
  //   if (result && !result.contains(clickedElement)) {
  //     this.showTheResults = false;
  //   }
  // }

  constructor(private toastr: ToastrService) {}
  ngOnChanges(): void {
    if (this.Results) {
      this.getsumsOfThePlayersPoints(this.Results);
    }
  }
  getsumsOfThePlayersPoints(Results: Result[]) {
    this.sumOfPoints = {};
    Results.forEach((element: Result) => {
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
  checkIfTheGamEnded(points: Points) {
    for (const [key, value] of Object.entries(points)) {
      if (value > 40) {
        this.theWinner.emit(key);
        this.endTheGame = true;
      }
    }
    if (this.endTheGame) {
      this.startTheGame.emit(false);
    } else {
      this.startTheGame.emit(true);
    }
  }
}
