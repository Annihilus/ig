import { Component, OnInit } from '@angular/core';
import { trigger, transition, query, style, animate } from '@angular/animations';

@Component({
  selector: 'app-chars',
  templateUrl: './chars.component.html',
  styleUrls: ['./chars.component.scss'],
  animations: [
    trigger('showAnimationTrigger', [
      transition('* => *', [
        query(':enter', style({
          backgroundColor: 'red',
        }), { optional: true }),
        animate(1500, style({
          backgroundColor: 'blue'
        })),
      ])
    ])
  ]
})
export class CharsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
