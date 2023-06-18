import * as fc from 'fast-check';

import { Point, Shape } from '../types';

export const pointArbitrary = (): fc.Arbitrary<Point> =>
    fc.tuple(fc.integer(), fc.integer())

export const shapeArbitrary = (): fc.Arbitrary<Shape> =>
    fc.array(pointArbitrary(), { minLength: 3 })