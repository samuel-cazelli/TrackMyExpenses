import { Component, OnInit } from '@angular/core';
import { CategoryService } from 'src/app/services/category.service';
import { Observable } from 'rxjs';
import { Category } from 'src/app/models/category';
import { MatDialog } from '@angular/material/dialog';
import { CategoriesFormComponent } from '../categories-form/categories-form.component';
import { Expense } from 'src/app/models/expense';
import { KeyValue } from '@angular/common';
import { take } from 'rxjs/operators';
import { ExpenseService } from 'src/app/services/expenses.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-expenses-form',
  templateUrl: './expenses-form.component.html',
  styleUrls: ['./expenses-form.component.css']
})
export class ExpensesFormComponent implements OnInit {

  categories: Array<KeyValue<string, Category>>;

  expense: KeyValue<string, Expense>;

  constructor(
    private categoryService: CategoryService,
    private expenseService: ExpenseService,
    public dialog: MatDialog,
    private router: Router,
  ) { }

  ngOnInit() {
    this.fillCategoryArray();
    this.expense = {
      key: '',
      value: {
        date: new Date(),
        description: '',
        categoryKey: '',
        amount: 0
      }
    };
  }


  onAddCategoryClick() {
    const dialogRef = this.dialog.open(CategoriesFormComponent, {
      width: '250px',
      data: { key: '', value: { name: '' } },
    });
    dialogRef.afterClosed().subscribe((savedCategory) => {
      if (savedCategory && savedCategory.length !== 0) {
        this.expense.value.categoryKey = savedCategory;
        this.fillCategoryArray();
      }
    });
  }

  onSubmit(expensesForm) {
    if (expensesForm.valid) {
      if (!this.expense.key || this.expense.key.length === 0) {
        this.expenseService.add(this.expense.value).pipe(take(1)).subscribe(c => {
          this.router.navigate(['/']);
        });
      } else {
        this.expenseService.update(this.expense.key, this.expense.value).pipe(take(1)).subscribe(c => {
          this.router.navigate(['/']);
        });
      }
    }
  }



  fillCategoryArray() {
    this.categoryService.getAll().subscribe(c => this.categories = c);
  }

  onCancelClick() {
    this.router.navigate(['/']);
  }

}
