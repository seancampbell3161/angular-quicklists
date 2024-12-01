import { Component, input } from "@angular/core";
import { Checklist } from "../../shared/interfaces/checklist";
import { RouterLink } from "@angular/router";

@Component({
    selector: 'app-checklist-list',
    imports: [RouterLink],
    template: `
        <section>
            <ul>
                @for (list of checklists(); track list.id) {
                    <li>
                        <a routerLink="/checklist/{{ list.id }}">
                            {{ list.title }}
                        </a>xw
                    </li>
                } @empty {
                    <p>Click the add button to create your first checklist!</p>
                }
            </ul>
        </section>
    `
})
export class ChecklistList {
    checklists = input.required<Checklist[]>();
}