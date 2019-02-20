import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { AppComponent } from "./app.component";
import { HeroesComponent } from "./heroes/heroes.component";

//every component needs to be declared in ngModule and the CLI does that for you

@NgModule({
  declarations: [AppComponent, HeroesComponent],
  imports: [BrowserModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
