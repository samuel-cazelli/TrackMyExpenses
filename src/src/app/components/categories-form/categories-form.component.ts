import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ExpensesFormComponent } from '../expenses-form/expenses-form.component';
import { Category } from 'src/app/models/category';
import { KeyValue } from '@angular/common';
import { CategoryService } from 'src/app/services/category.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-categories-form',
  templateUrl: './categories-form.component.html',
  styleUrls: ['./categories-form.component.css']
})
export class CategoriesFormComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ExpensesFormComponent>,
    @Inject(MAT_DIALOG_DATA) public category: KeyValue<string, Category>,
    private categoryService: CategoryService,
  ) { }

  ngOnInit() {

  }

  onSaveClick() {
    if (this.category.value.name === '') {
      return;
    }
    if (!this.category.key || this.category.key.length === 0) {
      this.categoryService.add(this.category.value).pipe(take(1)).subscribe(c => {
        this.dialogRef.close(c.id);
      });
    } else {
      this.categoryService.update(this.category.key, this.category.value).subscribe(c =>
        this.dialogRef.close(c)
      );
    }
  }

  onCancelClick() {
    this.dialogRef.close();
  }


}
