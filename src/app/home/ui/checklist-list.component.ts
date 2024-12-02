import { Component, input, output } from "@angular/core";
import { Checklist, EditChecklist, RemoveChecklist } from "../../shared/interfaces/checklist";
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
                        </a>
                        <button (click)="edit.emit(list)">Edit</button>
                        <button (click)="delete.emit(list.id)">Delete</button>
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
    delete = output<RemoveChecklist>();
    edit = output<Checklist>();
}