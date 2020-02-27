import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { Char, defaultChar, ISkill, PrimaryStats, statsParams } from './char.model';
import { CharService } from './char.service';

@Component({
  selector: 'app-char',
  templateUrl: './char.component.html',
  styleUrls: ['./char.component.scss'],
})
export class CharComponent implements OnInit {

  public char: Char = new Char(defaultChar);

  public total: number | string;

  public availablePoints: number;

  public statsForm: FormGroup;

  public basicSpeed: number;

  public movement: any;

  public skills = [
    {
      name: 'main-gauche',
      displayName: 'Main-Gauche',
      value: '15',
      price: '0',
      difficulty: 'M',
      deps: ['dex'],
      desc: 'test description',
    },
    {
      name: 'sword',
      displayName: 'Sword',
      value: '12',
      price: '0',
      difficulty: 'M',
      deps: ['dex', 'main-gauche'],
      desc: 'sword description',
    },
  ];

  public items;

  public loading$: BehaviorSubject<boolean> = new BehaviorSubject(true);

  constructor(
    private readonly db: AngularFirestore,
    private readonly builder: FormBuilder,
    private readonly service: CharService,
    private readonly cdr: ChangeDetectorRef,
  ) {
    db.collection('chars')
      .doc('Inquisitor')
      .valueChanges()
      .subscribe((char: Char) => {
        char.skills = this.skills as any;
        this.char = char;
        this.service.char = char;
        this.initForm();

        this.loading$.next(false);
      });
  }

  ngOnInit() {
    this.service.availablePoints$.subscribe(value => {
      if (this.statsForm) {
        this.statsForm.get('available')
          .setValue(value);
      }

      this.cdr.markForCheck();
    });

    this.initForm();
  }

  public initForm() {
    const stats = this.char.primaryStats;
    this.calcBasicMovement();

    this.statsForm = this.builder.group({
      total: this.char.points.total,
      available: this.service.calcAvailablePoints(this.char.points.total),
      stats: this.builder.group({
        str: stats.str,
        dex: stats.dex,
        int: stats.int,
        hlt: stats.hlt,
        will: stats.will,
        per: stats.per,
        fp: stats.fp,
        hp: stats.hp,
        bs: this.movement.bs,
        bm: this.movement.bm,
      }),
    });

    this.cdr.markForCheck();

    this.statsForm.valueChanges
      .pipe(
        debounceTime(500),
      )
      .subscribe(() => {
        const value = this.statsForm.getRawValue();
        this.char.primaryStats = value.stats;

        this.update(value);
      });
  }

  public update(value) {
    const stats = value.stats;

    this.checkValidMovementParams(stats);
    this.checkDependentStats(stats);
    this.calcBasicMovement();
    this.service.calcPrimaryStats(stats);

    this.statsForm.get('available')
      .setValue(
        this.service.calcAvailablePoints(value.total),
        { emitEvent: false },
      );

    this.cdr.markForCheck();
  }

  public checkDependentStats(stats: PrimaryStats) {
    const params = ['will', 'fp', 'hp', 'per'];

    params.forEach(param => {
      const dep = statsParams[param].dep;

      if (!dep) {
        return;
      }

      const diff = stats[param] - stats[dep];
      const maxDiff = stats[dep] / 100 * 30;

      if (diff > maxDiff) {
        const validValue = stats[dep] + maxDiff;

        this.char.primaryStats[param] = Math.floor(validValue);
        this.statsForm.get(param)
          .setValue(validValue);
      }
    });
  }

  public checkValidMovementParams(stats: PrimaryStats) {
    const params = ['bs', 'bm'];

    params.forEach(param => {
      const step = statsParams[param].step;
      let val = stats[param];

      if (param === 'bm') {
        val = Math.floor(val);
      }

      if (!!(val % step)) {
        val = Math.floor(val / step) * step;
        this.statsForm.get(param)
          .setValue(val);
      }

      const diff = val - this.basicSpeed;
      const maxDiff = this.basicSpeed / 100 * 30;

      if (diff > maxDiff) {
        val = this.basicSpeed + maxDiff;
        val = Math.floor(val / step) * step;
        this.char.primaryStats[param] = val;
        this.statsForm
          .get('stats')
          .get(param)
          .setValue(val);
      }
    });
  }

  public calcBasicMovement() {
    // Basic Speed: normally (HT+DX)/4 (±5 points per ±0.25 Speed)
    // Basic Move: normally Basic Speed less all fractions (±5 points per ±1 yard/second)
    const stats = this.char.primaryStats;

    this.basicSpeed = (Number(stats.hlt) + Number(stats.dex)) / 4;

    this.movement = {
      bs: stats.bs === null ? this.basicSpeed : stats.bs,
      bm: stats.bm === null ? Math.floor(this.basicSpeed) : Math.floor(stats.bm),
    };

    // TODO: remove movement variable
    this.char.primaryStats.bs = this.movement.bs;
    this.char.primaryStats.bm = this.movement.bm;
  }
}
