import { TestBed } from '@angular/core/testing';

import { Igdb } from './igdb';

describe('Igdb', () => {
  let service: Igdb;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Igdb);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
