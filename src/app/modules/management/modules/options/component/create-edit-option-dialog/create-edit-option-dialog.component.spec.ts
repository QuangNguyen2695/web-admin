import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEditOptionDialogComponent } from './create-edit-option-dialog.component';

describe('CreateEditOptionDialogComponent', () => {
  let component: CreateEditOptionDialogComponent;
  let fixture: ComponentFixture<CreateEditOptionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateEditOptionDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateEditOptionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
