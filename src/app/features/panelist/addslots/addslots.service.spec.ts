import { TestBed } from '@angular/core/testing';

import { AddslotsService } from './addslots.service';

describe('AddslotsService', () => {
  let service: AddslotsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddslotsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
