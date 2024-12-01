import { Component, effect, inject, signal } from '@angular/core';
import { ModalComponent } from '../shared/ui/modal.component';
import { Checklist } from '../shared/interfaces/checklist';
import { FormBuilder } from '@angular/forms';
import { FormModalComponent } from "../shared/ui/form-modal.component";
import { ChecklistService } from '../shared/data-access/checklist.service';

@Component({
  selector: 'app-home',
  imports: [ModalComponent, FormModalComponent],
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
          (save)="checklistService.add$.next(checklistForm.getRawValue())"
        ></app-form-modal>
      </ng-template>
    </app-modal>
  `,
  styles: ``
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
      }
    });
  }
}
