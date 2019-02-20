import { MessageService } from "./message.service";
import { HEROES } from "./mock-heroes";
import { Hero } from "./hero";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError, map, tap } from "rxjs/operators";

// The @Injectable() decorator accepts a metadata object for the service, the same way the @Component() decorator did for your component classes.

const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" })
};

@Injectable({
  providedIn: "root"
  // When you provide the service at the root level, Angular creates a single, shared instance of HeroService and injects into any class that asks for it. Registering the provider in the @Injectable metadata also allows Angular to optimize an app by removing the service if it turns out not to be used after all.
})
export class HeroService {
  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) {}

  private heroesUrl = "api/heroes"; // URL to web api

  // This is a typical "service-in-service" scenario: you inject the MessageService into the HeroService which is injected into the HeroesComponent.

  getHeroes(): Observable<Hero[]> {
    // TODO: send the message _after_ fetching the heroes
    return this.http.get<Hero[]>(this.heroesUrl).pipe(
      tap((_) => this.log("fetched heroes")),
      catchError(this.handleError("get Heroes", []))
    );
  }

  /** GET hero by id. Will 404 if id not found */
  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url).pipe(
      tap((_) => this.log(`fetched hero id=${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    );
  }

  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, httpOptions).pipe(
      tap((_) => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>("updateHero"))
    );
  }

  addHero(hero: Hero): Observable<Hero> {
    return this.http
      .post<Hero>(this.heroesUrl, hero, httpOptions)
      .pipe(
        tap(
          (newHero: Hero) => this.log(`added hero with id=${newHero.id}`),
          catchError(this.handleError<Hero>("addHero"))
        )
      );
  }

  deleteHero(hero: Hero | number): Observable<Hero> {
    const id = typeof hero === "number" ? hero : hero.id;
    const url = `${this.heroesUrl}/${id}`;

    return this.http.delete<Hero>(url, httpOptions).pipe(
      tap((_) => this.log(`deleted hero id=${id}`)),
      catchError(this.handleError<Hero>("deleteHero"))
    );
  }

  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      return of([]);
    }
    //return empty array if no search term

    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
      tap((_) => this.log(`found heroes matching ${term}`)),
      catchError(this.handleError<Hero[]>("searchHeroes", []))
    );
  }

  private handleError<T>(operation = "operation", result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }
}
