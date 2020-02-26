import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'skills-item',
  templateUrl: './skills-item.component.html',
})
export class SkillsItemComponent implements OnInit {

  @Input() public form: FormArray;

  @Input() public data: any;

  public formGroup: FormGroup;

  constructor(
    private readonly _builder: FormBuilder,
  ) {}

  ngOnInit() {
    this.formGroup = this._builder.group({
      name: this.data.name,
      value: this.data.value,
      price: this.data.price,
      dependency: this.data.deps[0],
      description: this.data.desc,
    });

    this.form.push(this.formGroup);
  }
}
