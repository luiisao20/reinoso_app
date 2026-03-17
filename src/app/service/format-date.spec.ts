import { TestBed } from '@angular/core/testing';

import { FormatDate } from './format-date';

describe('FormatDate', () => {
  let service: FormatDate;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormatDate);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
