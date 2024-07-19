import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BASE_URL,
  expeditionsPoint,
  newsPoint,
} from '../components/variables/endpoints';
import { catchError, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  getNews() {
    return this.http
      .get(BASE_URL + '/' + newsPoint, { responseType: 'text' })
      .pipe(
        map(d =>({data: d, error: false})),
        catchError((err) => {
         // console.log(err);
          return of({data: err.message ,error: true});
        })
      );
  }

  getExpeditions() {
    return this.http.get(BASE_URL + '/' + expeditionsPoint).pipe();
  }
}
