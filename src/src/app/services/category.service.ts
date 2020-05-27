import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Category } from '../models/category';
import { Observable, of, from } from 'rxjs';
import { KeyValue } from '@angular/common';


@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(
    private db: AngularFirestore,
  ) { }

  add(category: Category) {
    return from(this.db.collection<Category>('categories').add(category));
  }

  update(key: string, category: Category) {
    return from(this.db.collection<Category>('categories').doc(key).update(category));
  }

  getAll(): Observable<Array<KeyValue<string, Category>>> {
    return this.db.collection('categories')
      .get()
      .pipe(
        map(c => {
          const response = Array<KeyValue<string, Category>>();
          c.docs.forEach((data) => {
            response.push({ key: data.id, value: { name: data.data().name } });
          });
          return response;
        })
      );
  }

}
