import { Component, OnInit } from '@angular/core';
import { CategoryService } from 'src/app/services/category.service';
import { Category } from 'src/app/models/category';
import { MatDialog } from '@angular/material/dialog';
import { CategoriesFormComponent } from '../categories-form/categories-form.component';
import { Expense } from 'src/app/models/expense';
import { KeyValue } from '@angular/common';
import { take, map, mergeMap } from 'rxjs/operators';
import { ExpenseService } from 'src/app/services/expenses.service';
import { Router, ActivatedRoute } from '@angular/router';
import { of, zip } from 'rxjs';


@Component({
  selector: 'app-expenses-form',
  templateUrl: './expenses-form.component.html',
  styleUrls: ['./expenses-form.component.css']
})
export class ExpensesFormComponent implements OnInit {

  loadingData: boolean;

  categories: Array<KeyValue<string, Category>>;

  expense: KeyValue<string, Expense>;

  constructor(
    private categoryService: CategoryService,
    private expenseService: ExpenseService,
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.loadingData = true;

    const loadCategories$ = this.categoryService.getAll();

    const loadExpense$ = this.route.paramMap
      .pipe(
        map(p => p.get('key')),
        mergeMap(key => {
          if (key && key !== '') {
            return this.expenseService.getByKey(key);
          } else {
            return of({ key: '', value: { date: null, description: '', categoryKey: '', amount: null } });
          }
        })
      );


    zip(loadCategories$, loadExpense$).subscribe(() => this.loadingData = false);

    loadCategories$.subscribe(c => this.categories = c);
    loadExpense$.subscribe(e => this.expense = e);
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
    return this.categoryService.getAll().subscribe(c => this.categories = c);
  }

  onCancelClick() {
    this.router.navigate(['/']);
  }

}
