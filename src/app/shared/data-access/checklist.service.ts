import { Injectable, computed, effect, inject, signal } from "@angular/core";
import { AddChecklist, Checklist, EditChecklist } from "../interfaces/checklist";
import { Subject } from "rxjs";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { StorageService } from "./storage.service";
import { ChecklistItemService } from "../../checklist/data-access/checklist-item.service";

export interface ChecklistsState {
    checklists: Checklist[];
    loaded: boolean;
    error: string | null;
}

@Injectable({
    providedIn: 'root',
})
export class ChecklistService {
    storageService = inject(StorageService);
    checklistItemService = inject(ChecklistItemService);

    private state = signal<ChecklistsState>({
        checklists: [],
        loaded: false,
        error: null,
    });

    checklists = computed(() => this.state().checklists);
    loaded = computed(() => this.state().loaded);

    add$ = new Subject<AddChecklist>();
    remove$ = this.checklistItemService.checklistRemoved$;
    edit$ = new Subject<EditChecklist>();
    private checklistsLoaded$ = this.storageService.loadChecklists();

    constructor() {
        effect(() => {
            if (this.loaded()) {
                this.storageService.saveChecklists(this.checklists());
            }
        });

        this.add$.pipe(takeUntilDestroyed()).subscribe((checklist) =>
            this.state.update((state) => ({
                ...state,
                checklists: [...state.checklists, this.addIdToChecklist(checklist)],
            }))
        );

        this.checklistsLoaded$.pipe(takeUntilDestroyed()).subscribe({
            next: (checklists) =>
                this.state.update((state) => ({
                    ...state,
                    checklists,
                    loaded: true,
                })),
            error: (err) => this.state.update((state) => ({ ...state, error: err })),
        });

        this.remove$.pipe(takeUntilDestroyed()).subscribe((checklistId) =>
            this.state.update((state) => ({
                ...state,
                checklists: this.state().checklists.filter((checklist) => checklist.id !== checklistId)
            }))
        );

        this.edit$.pipe(takeUntilDestroyed()).subscribe((update) =>
            this.state.update((state) => ({
                ...state,
                checklist: this.state().checklists.map((checklist) =>
                    checklist.id === update.id ? { ...checklist, title: update.data.title } : checklist)
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