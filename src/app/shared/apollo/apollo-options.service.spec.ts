import { TestBed } from '@angular/core/testing';

import { ApolloOptionsService } from './apollo-options.service';

describe('ApolloOptionsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ApolloOptionsService = TestBed.inject(ApolloOptionsService);
    expect(service).toBeTruthy();
  });
});
