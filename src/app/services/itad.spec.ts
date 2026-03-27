import { TestBed } from '@angular/core/testing';

import { Itad } from './itad';

describe('Itad', () => {
  let service: Itad;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Itad);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
