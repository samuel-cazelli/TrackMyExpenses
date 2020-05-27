import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { Expense } from '../models/expense';
import { map } from 'rxjs/operators';
import { firestore } from 'firebase';
import { KeyValue } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {

  constructor(
    private db: AngularFirestore,
  ) { }

  add(expense: Expense) {
    return from(this.db.collection<Expense>('expenses').add(expense));
  }

  update(key: string, expense: Expense) {
    return from(this.db.collection<Expense>('expenses').doc(key).update(expense));
  }

  /*getByKey(key: string) {
    return this.db.collection<Expense>('expenses').doc<Expense>(key).get();
  }*/

  /*getAll(): Observable<Expense[]> {
    return this.db.collection('categories')
      .get()
      .pipe(
        map(c => this.mapExpenseArray(c))
      );
  }*/

  getByStartEndDate(start: Date, end: Date): Observable<Array<KeyValue<string, Expense>>> {
    return this.db.collection('expenses',
      ref => ref.where('date', '>=', start).where('date', '<', end)
    ).get()
      .pipe(
        map(c => this.mapExpenseArray(c))
      );
  }

  private mapExpenseArray(c: firestore.QuerySnapshot<firestore.DocumentData>) {
    const response = Array<KeyValue<string, Expense>>();
    c.docs.forEach((data) => {
      response.push({
        key: data.id,
        value: {
          amount: data.data().amount,
          categoryKey: data.data().categoryKey,
          date: data.data().date.toDate(),
          description: data.data().description
        }
      });
    });
    return response;
  }

}
