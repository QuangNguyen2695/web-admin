import { TestBed } from '@angular/core/testing';

import { ApiGateawayService } from './api-gateaway.service';

describe('ApiGateawayService', () => {
  let service: ApiGateawayService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiGateawayService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
