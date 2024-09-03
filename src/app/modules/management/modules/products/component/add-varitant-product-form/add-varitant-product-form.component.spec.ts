import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVaritantProductFormComponent } from './add-varitant-product-form.component';

describe('AddVaritantProductFormComponent', () => {
  let component: AddVaritantProductFormComponent;
  let fixture: ComponentFixture<AddVaritantProductFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddVaritantProductFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddVaritantProductFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
