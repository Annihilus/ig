import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'skills-list',
  templateUrl: './skills-list.component.html',
})
export class SkillsListComponent implements OnInit {

  @Input() public data;

  public skills: FormGroup[] = [];

  public form: FormArray;

  public deps = [];

  constructor(
    private readonly _builder: FormBuilder,
  ) {}

  ngOnInit() {
    console.log(this.data);

    // this.data.forEach(item => {
    //   this.skills.push(this.addItem(item));
    // });

    this.form = this._builder.array([]);
  }
}
