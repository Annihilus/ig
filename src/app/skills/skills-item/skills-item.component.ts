import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

import { debounceTime } from 'rxjs/operators';

import { CharService } from '../../char/char.service';

@Component({
  selector: 'skills-item',
  templateUrl: './skills-item.component.html',
  styleUrls: ['./skills-item.component.scss'],
})
export class SkillsItemComponent implements OnInit {

  @Input() public form: FormArray;

  @Input() public data: any;

  @Input() public index: number;

  public formGroup: FormGroup;

  constructor(
    private readonly _builder: FormBuilder,
    private readonly _service: CharService,
  ) {}

  ngOnInit() {
    console.log(this.data);

    this.formGroup = this._builder.group({
      name: this.data.name,
      value: this.data.value,
      price: this.data.price,
      dependency: this.data.deps[0],
      description: this.data.desc,
      difficulty: this.data.difficulty,
    });

    console.log(this.formGroup);

    this.formGroup.valueChanges
      .pipe(
        debounceTime(777),
      )
      .subscribe(skill => {
        console.log(skill);

        const price = this._service.calcSkillPrice(skill);
        const control = this.formGroup.controls.price;

        console.log(price, parseInt(control.value, 0));

        if (price !== parseInt(control.value, 0)) {
          control.setValue(price);
        }

      });

    this.form.push(this.formGroup);
  }
}
