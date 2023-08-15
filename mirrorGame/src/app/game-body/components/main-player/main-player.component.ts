import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-player',
  templateUrl: './main-player.component.html',
  styleUrls: ['./main-player.component.css'],
})
export class MainPlayerComponent implements OnInit {
  @Input() Cards!: any;

  constructor() {}

  ngOnInit(): void {}
  ngOnChanges(): void {
    console.log(this.Cards);
  }
}
