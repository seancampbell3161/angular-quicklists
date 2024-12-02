import { Injectable, computed, effect, inject, signal } from "@angular/core";
import { AddChecklistItem, ChecklistItem, EditChecklistItem } from "../../shared/interfaces/checklist-item";
import { Subject } from "rxjs";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { RemoveChecklistItem } from "../../shared/interfaces/checklist-item";
import { RemoveChecklist } from "../../shared/interfaces/checklist";
import { StorageService } from "../../shared/data-access/storage.service";

export interface ChecklistItemsState {
    checklistItems: ChecklistItem[];
    loaded: boolean;
  }
  
  @Injectable({
    providedIn: 'root',
  })
  export class ChecklistItemService {
    storageService = inject(StorageService);

    private state = signal<ChecklistItemsState>({
        checklistItems: [],
        loaded: false,
    });

    checklistItems = computed(() => this.state().checklistItems);
    loaded = computed(() => this.state().loaded);

    add$ = new Subject<AddChecklistItem>();
    toggle$ = new Subject<RemoveChecklistItem>();
    reset$ = new Subject<RemoveChecklist>();
    checklistItemsLoaded$ = this.storageService.loadChecklistItems();

    constructor() {
        effect(() => {
            if (this.loaded()) {
                this.storageService.saveChecklistItems(this.checklistItems());
            }
        });

        this.add$.pipe(takeUntilDestroyed()).subscribe((checklistItem) => 
            this.state.update((state) => ({
                ...state,
                checklistItems: [
                    ...state.checklistItems,
                    {
                        ...checklistItem.item,
                        id: Date.now().toString(),
                        checklistId: checklistItem.checklistId,
                        checked: false
                    },
                ],
            }))
        );

        this.toggle$.pipe(takeUntilDestroyed()).subscribe((itemId) => 
            this.state.update((state) => ({
                ...state,
                checklistItems: state.checklistItems
                    .map(item => item.id === itemId ? { ...item, checked: !item.checked } : item)
            }))
        );

        this.reset$.pipe(takeUntilDestroyed()).subscribe((listId) =>
            this.state.update((state) => ({
                ...state,
                checklistItems: state.checklistItems
                    .map(item => item.checklistId === listId ? { ...item, checked: false } : item)
            }))
        );

        this.checklistItemsLoaded$.pipe(takeUntilDestroyed()).subscribe({
            next: (checklistItems) => {
                this.state.update((state) => ({
                    ...state,
                    checklistItems,
                    loaded: true,
                }));
                console.log(this.state());
            }
            
        });
    }
  }