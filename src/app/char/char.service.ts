import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { Char, defaultChar, ISkill, PrimaryStats, statsParams } from './char.model';

@Injectable()
export class CharService {

  private _total: BehaviorSubject<number> = new BehaviorSubject<number>(null);

  public total$: Observable<number> = this._total.asObservable()
    .pipe(
      distinctUntilChanged(),
    );

  public statsNames = Object.keys(statsParams);

  public calcTotal(char: Char): void {
    this.calcPrimaryStats(char.primaryStats);
  }

  public calcPrimaryStats(stats: PrimaryStats, total: number = 0): void {
    let result = total;

    this.statsNames.forEach(name => {
      const dep = statsParams[name].dep;
      let value = dep ? stats[name] - stats[dep] : stats[name] - defaultChar.primaryStats[name];

      if (statsParams[name].type === 'movement') {
        const basicSpeed = (Number(stats.hlt) + Number(stats.dex)) / 4;

        if (stats[name] !== basicSpeed) {
          value = (stats[name] - basicSpeed) / statsParams[name].step;
        } else {
          value = 0;
        }
      }

      result += value * statsParams[name].price;
    });

    this._total.next(result);
  }

  public calcSkillPrice(skill: ISkill, attrVal: number) {
    const complexities = ['E', 'M', 'H', 'VH'];
    const costStartsAt = [0, -1, -2, -3];
    const complexityModifier = costStartsAt[complexities.indexOf(skill.complexity)];

    const diff = skill.value - attrVal;

    let price = 0;

    if (diff < complexityModifier) {
      // If less then default value
      price = 0;
    }

    if (diff === complexityModifier) {
      price = 1;
    }

    if (diff < 2 && diff > -2) {
      let exponent = Math.abs(Math.abs(diff) - complexityModifier);
      exponent = exponent ? exponent : 1;
      price = Math.pow(2, exponent);
    }

    if (!price) {
      const stepsFromDefault = diff + Math.abs(complexityModifier);
      price = 4 * (stepsFromDefault - 1);
    }

    console.log(price);

    return price;
  }

  public validate(stats: PrimaryStats) {
    const errors = [];

    this.statsNames.forEach(name => {
      const dep = statsParams[name].dep;

      if (!dep) {
        return;
      }

      const diff = stats[name] - stats[dep];
      const maxDiff = stats[dep] / 100 * 30;

      if (diff > maxDiff) {
        errors.push({
          fieldName: name,
          amound: maxDiff - diff,
        });
      }
    });

    return errors;
  }
}
