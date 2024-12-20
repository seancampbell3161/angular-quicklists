import { Component, effect, inject, signal } from '@angular/core';
import { ModalComponent } from '../shared/ui/modal.component';
import { Checklist } from '../shared/interfaces/checklist';
import { FormBuilder } from '@angular/forms';
import { FormModalComponent } from "../shared/ui/form-modal.component";
import { ChecklistService } from '../shared/data-access/checklist.service';
import { ChecklistList } from "./ui/checklist-list.component";

@Component({
  selector: 'app-home',
  imports: [ModalComponent, FormModalComponent, ChecklistList],
  template: `
   <header>
    <h1>Quicklists</h1>
    <button (click)="checklistBeingEdited.set({})">Add Checklist</button>
   </header>

   <app-modal [isOpen]="!!checklistBeingEdited()">
      <ng-template> 
        <app-form-modal
          [title]="checklistBeingEdited()?.title ? checklistBeingEdited()!.title! : 'Add Checklist'"
          [formGroup]="checklistForm"
          (close)="checklistBeingEdited.set(null)"
          (save)="checklistBeingEdited()?.id 
            ? checklistService.edit$.next({ id: checklistBeingEdited()!.id!, data: checklistForm.getRawValue() }) 
            : checklistService.add$.next(checklistForm.getRawValue())"
        ></app-form-modal>
      </ng-template>
    </app-modal>

    <section>
      <h2>Your Checklists</h2>
      <app-checklist-list 
      [checklists]="checklistService.checklists()"
      (edit)="checklistBeingEdited.set($event)"
      (delete)="checklistService.remove$.next($event)"
    >
    </app-checklist-list>
    </section>
    
  `,
  styles: [
    `
      ul {
        padding: 0;
        margin: 0;
      }
      li {
        font-size: 1.5em;
        display: flex;
        justify-content: space-between;
        background: var(--color-light);
        list-style-type: none;
        margin-bottom: 1rem;
        padding: 1rem;

        button {
          margin-left: 1rem;
        }
      }
    `,
  ],
})
export default class HomeComponent {
  formBuilder = inject(FormBuilder);
  checklistService = inject(ChecklistService);

  checklistBeingEdited = signal<Partial<Checklist> | null>(null);

  checklistForm = this.formBuilder.nonNullable.group({
    title: [''],
  });

  constructor() {
    effect(() => {
      const checklist = this.checklistBeingEdited();

      if (!checklist) {
        this.checklistForm.reset();
      } else {
        this.checklistForm.patchValue({
          title: checklist.title
        });
      }
    });
  }
}
