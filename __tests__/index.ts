import { describe, expect, test } from '@jest/globals';
import * as G from './generator';
import * as fc from 'fast-check';

describe('Template test suite', () => {
  test('INVARIANT : a shape must have at least 3 Points', () => {
    fc.assert(
      fc.property(G.shapeArbitrary(), (s) => {
        expect(s.length).toBeGreaterThanOrEqual(3);
      })
    );
  });
});
