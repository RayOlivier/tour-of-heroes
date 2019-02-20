import { MessageService } from "./message.service";
import { HEROES } from "./mock-heroes";
import { Hero } from "./hero";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";

// The @Injectable() decorator accepts a metadata object for the service, the same way the @Component() decorator did for your component classes.

@Injectable({
  providedIn: "root"
  // When you provide the service at the root level, Angular creates a single, shared instance of HeroService and injects into any class that asks for it. Registering the provider in the @Injectable metadata also allows Angular to optimize an app by removing the service if it turns out not to be used after all.
})
export class HeroService {
  constructor(private messageService: MessageService) {}
  // This is a typical "service-in-service" scenario: you inject the MessageService into the HeroService which is injected into the HeroesComponent.

  getHeroes(): Observable<Hero[]> {
    // TODO: send the message _after_ fetching the heroes
    this.messageService.add("HeroService: fetched heroes");
    return of(HEROES);
  }
}
