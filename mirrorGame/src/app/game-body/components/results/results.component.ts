import { Component, Input, OnInit } from '@angular/core';
import { Result } from 'src/app/core/interfaces/result';
import { ActivatedRoute, Router } from '@angular/router';
import { SocketService } from 'src/app/core/services/socket-service.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css'],
})
export class ResultsComponent implements OnInit {
  @Input() showTheResult!: Result[];
  sumOfPoints: any = {};
  userId: string | undefined;
  @Input() gameId!: string | undefined;
  @Input() roomName!: string | undefined;
  constructor(
    private router: Router,
    private ActivatedRoute: ActivatedRoute,
    private socket: SocketService
  ) {}
  ngOnChanges(): void {
    if (this.showTheResult) {
      this.getsumsOfThePlayersPoints(this.showTheResult);
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
  }
  ngOnInit(): void {
    const userIdParam = this.ActivatedRoute.snapshot.paramMap.get('id');
    this.userId = userIdParam !== null ? userIdParam : undefined;
    this.socket.listen('newGame').subscribe({
      next: (res) => {
        this.gameId = res;
        console.log(this.gameId);
      },
    });
  }
  joinNextRound() {
    this.router.navigate(['roombody', this.roomName, this.gameId, this.userId]);
    // location.reload();
  }
}
