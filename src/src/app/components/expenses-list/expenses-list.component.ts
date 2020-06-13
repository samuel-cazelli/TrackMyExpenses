import { Component, OnInit } from '@angular/core';
import { ExpenseService } from 'src/app/services/expenses.service';
import { CategoryService } from 'src/app/services/category.service';
import { Category } from 'src/app/models/category';
import { Expense } from 'src/app/models/expense';
import { take } from 'rxjs/operators';
import { Subject, Observable, Subscription } from 'rxjs';
import { calcPossibleSecurityContexts } from '@angular/compiler/src/template_parser/binding_parser';
import { KeyValue } from '@angular/common';
import { trigger, state, transition, animate, style } from '@angular/animations';
import { Router } from '@angular/router';

@Component({
  selector: 'app-expenses-list',
  templateUrl: './expenses-list.component.html',
  styleUrls: ['./expenses-list.component.css'],
  animations: [
    trigger('showHide', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.2s', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate('0.2s', style({ opacity: 0, height: 0 }))
      ]),
    ]),
    trigger('visibleExpenses',
      [
        state('hidden', style({ transform: 'none' })),
        state('visible', style({ transform: 'rotate(90deg)' })),
        transition('hidden => visible', [
          animate('0.2s')
        ]),
        transition('visible => hidden', [
          animate('0.2s')
        ])
      ])
  ],
})
export class ExpensesListComponent implements OnInit {

  loadinData = true;

  currentDate: Date;

  allCategories: Array<KeyValue<string, Category>>;

  groupedCategories: Array<KeyValue<string, { name: string; amount: number; expenses: {}; visible: boolean }>>;

  expenses: Array<KeyValue<string, Expense>>;

  getExpensesSubscription: Subscription;

  constructor(
    private expenseService: ExpenseService,
    private categoryService: CategoryService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.setNextCurrentDate(0, new Date());
    this.categoryService.getAll().pipe(take(1)).subscribe(c => {
      this.allCategories = c;
      this.getExpensesList();
    });
  }

  getExpensesList() {

    if (this.getExpensesSubscription) {
      this.getExpensesSubscription.unsubscribe();
    }

    this.getExpensesSubscription = this.expenseService
      .getByStartEndDate(
        this.calculatePeriodOffset(this.currentDate, 0),
        this.calculatePeriodOffset(this.currentDate, 1)
      ).subscribe(e => {
        this.expenses = e;
        this.groupCategories();
      });
  }

  groupCategories() {

    if (!this.allCategories) {
      return;
    }

    this.allCategories.forEach((c) => {

      const expensesByAmount = new Array<KeyValue<string, Expense>>();

      this.expenses
        .filter(k => {
          return k.value.categoryKey === c.key;
        })
        .forEach(k => {
          expensesByAmount.push(k);
        });

      if (expensesByAmount.length > 0) {
        this.groupedCategories.push({
          key: c.key,
          value: {
            name: c.value.name,
            amount: expensesByAmount.reduce((sum, currentExpense) => {
              return (sum + currentExpense.value.amount);
            }, 0),
            expenses: expensesByAmount,
            visible: false
          }
        });
      }

    });

    this.loadinData = false;

  }

  setNextCurrentDate(offset: number, date?: Date) {
    this.loadinData = true;
    if (!date) {
      date = this.currentDate;
    }
    this.groupedCategories = new Array<KeyValue<string, { name: string; amount: number; expenses: {}, visible: boolean }>>();
    this.currentDate = this.calculatePeriodOffset(date, offset);
    if (this.allCategories) {
      this.getExpensesList();
    }

  }

  calculatePeriodOffset(date: Date, offset: number) {
    return new Date(date.getFullYear(), date.getMonth() + offset, 1);
  }

  clickEditExpense(key: string){
    this.router.navigate(['edit', key]);
  }

}
