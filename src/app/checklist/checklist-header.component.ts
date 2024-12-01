import { Component, input } from "@angular/core";
import { RouterLink } from "@angular/router";
import { Checklist } from "../shared/interfaces/checklist";

@Component({
    selector: 'app-checklist-header',
    template: `
      <header>
        <a routerLink="/home">Back</a>
        <h1>
          {{ checklist().title }}
        </h1>
      </header>
    `,
    imports: [RouterLink],
  })
  export class ChecklistHeaderComponent {
    checklist = input.required<Checklist>();
  }