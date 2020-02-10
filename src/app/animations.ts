import { trigger, transition, style, query, animateChild, group, animate } from '@angular/animations';

export const routeAnimation =
  trigger('routeAnimations', [
    transition('CharsPage <=> CharPage', [
      style({ position: 'relative' }),
      query(':enter, :leave', [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%'
        })
      ]),
      query(':enter', [
        style({
          // left: '-100%',
          opacity: 0,
          zIndex: 1
        })
      ]),
      query(':leave', animateChild()),
      query(':enter', [
        animate('300ms ease-out',
          style({
            // left: '0',
            opacity: 1,
          }))
      ]),
      query(':enter', animateChild()),
    ]),
  ]);
