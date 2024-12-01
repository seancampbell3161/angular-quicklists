import { Injectable, computed, signal } from "@angular/core";
import { AddChecklist, Checklist } from "../interfaces/checklist";
import { Subject } from "rxjs";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

export interface ChecklistsState {
    checklists: Checklist[];
}

@Injectable({
    providedIn: 'root',
})
export class ChecklistService {
    private state = signal<ChecklistsState>({
        checklists: []
    });

    checklists = computed(() => this.state().checklists);

    add$ = new Subject<AddChecklist>();

    constructor() {
        this.add$.pipe(takeUntilDestroyed()).subscribe((checklist) =>
            this.state.update((state) => ({
                ...state, 
                checklists: [...state.checklists, this.addIdToChecklist(checklist)],
            }))
        );
    }

    private addIdToChecklist(checklist: AddChecklist): Checklist {
        return {
            ...checklist,
            id: this.generateSlug(checklist.title)
        }
    }

    private generateSlug(title: string): string {
        let slug = title.toLowerCase().replace(/\s+/g, '-');

        const matchingSlugs = this.checklists().find(
            (checklist) => checklist.id === slug
        );

        return matchingSlugs ? slug + Date.now().toString() : slug;
    }
}