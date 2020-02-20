import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
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

  public skillsForm: FormGroup;

  public skillsArray: FormArray;

  public basicSpeed: number;

  public movement: any;

  public items;

  public skills: ISkill[] = [
    {
      displayName: 'Нож',
      name: 'knife',
      attr: 'dex',
      complexity: 'M',
      value: 10,
    },
  ];

  public loading$: BehaviorSubject<boolean> = new BehaviorSubject(true);

  constructor(
    private db: AngularFirestore,
    private builder: FormBuilder,
    private service: CharService,
    private cdr: ChangeDetectorRef,
  ) {
    db.collection('chars')
      .doc('Inquisitor')
      .valueChanges()
      .subscribe((char: Char) => {
        this.char = char;
        console.log(this.char);
        this.initForm();

        this.loading$.next(false);
      });
  }

  ngOnInit() {
    this.service.available$.subscribe(value => {
      this.total = value;
      this.availablePoints = value;

      if (this.statsForm) {
        this.statsForm.get('available')
          .setValue(value);
      }

      this.cdr.markForCheck();
    });

    this.initForm();
    this.initSkillsForm();

    // this.service.calcSkillPrice(this.skills[0], this.char.primaryStats[this.skills[0].attr]);
  }

  public initSkillsForm() {
    this.skillsForm = this.builder.group({
      skills: this.builder.array([]),
    });

    this.addSkill(this.skills[0]);
  }

  public addSkill(skill) {
    this.skillsArray = this.skillsForm.get('skills') as FormArray;
    // this.skillsArray.push(this.builder.group({
    //   name: ,
    // });
  }

  public initForm() {
    console.log(this.total);

    const stats = this.char.primaryStats;
    this.calcBasicMovement();

    this.statsForm = this.builder.group({
      total: this.total,
      available: this.availablePoints,
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
      })
    });

    this.service.calcTotal(this.char);

    this.cdr.markForCheck();

    this.statsForm.valueChanges
      .pipe(
        debounceTime(500),
      )
      .subscribe(() => {
        const value = this.statsForm.getRawValue().stats;
        this.char.primaryStats = value;

        console.log(value);

        this.checkValidMovementParams(value);
        this.checkDependentStats(value);

        this.calcBasicMovement();

        this.service.calcPrimaryStats(this.char.primaryStats);

        // this.service.calcAvailablePoints(1);

        this.cdr.markForCheck();
      });
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
