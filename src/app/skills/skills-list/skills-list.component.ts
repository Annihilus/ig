import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

import { ISkill } from '../../char/char.model';
import { CharService } from '../../char/char.service';

@Component({
  selector: 'skills-list',
  templateUrl: './skills-list.component.html',
})
export class SkillsListComponent implements OnInit {

  @Input() public data: ISkill[];

  public skills: FormGroup[] = [];

  public form: FormArray;

  public deps = [];

  constructor(
    private readonly _builder: FormBuilder,
    // private readonly _service: CharService,
  ) {}

  ngOnInit() {
    console.log(this.data);

    this.form = this._builder.array([]);
  }
}
