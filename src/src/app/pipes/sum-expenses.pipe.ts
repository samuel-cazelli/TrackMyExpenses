import { Pipe, PipeTransform } from '@angular/core';
import { Expense } from '../models/expense';
import { ExpenseService } from '../services/expenses.service';
import { KeyValue } from '@angular/common';

@Pipe({
  name: 'sumexpenses'
})
export class SumExpensesPipe implements PipeTransform {

  transform(value: Array<KeyValue<string, Expense>>, args?: any): number {
    return value.map(e => e.value.amount).reduce((a, b) => a += b, 0);
  }

}
