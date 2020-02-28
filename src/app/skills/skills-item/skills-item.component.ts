import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

import { debounceTime } from 'rxjs/operators';

import { CharService } from '../../char/char.service';
import { ISkill } from 'src/app/char/char.model';

@Component({
  selector: 'skills-item',
  templateUrl: './skills-item.component.html',
  styleUrls: ['./skills-item.component.scss'],
})
export class SkillsItemComponent implements OnInit {

  @Input() public form: FormArray;

  @Input() public skill: any;

  @Input() public index: number;

  public formGroup: FormGroup;

  constructor(
    private readonly _builder: FormBuilder,
    private readonly _service: CharService,
  ) {}

  ngOnInit() {
    this.skill.price = this._service.calcSkillPrice(this.skill);

    this.formGroup = this._builder.group({
      name: this.skill.name,
      value: this.skill.value,
      price: this.skill.price,
      dependency: this.skill.deps[0],
      description: this.skill.desc,
      difficulty: this.skill.difficulty,
    });

    this.formGroup.valueChanges
      .pipe(
        debounceTime(777),
      )
      .subscribe(skill => {
        const updatedSkill = this._service.updateSkill(skill);
        const control = this.formGroup.controls.price;

        if (updatedSkill.price !== parseInt(control.value, 0)) {
          control.setValue(updatedSkill.price);
        }
      });

    this.form.push(this.formGroup);
  }
}
