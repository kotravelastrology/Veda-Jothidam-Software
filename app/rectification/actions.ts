'use server';

import { calculateRectification } from '../../src/report/rectification';
import type { BirthFormInput } from '../report/actions';

export async function computeRectification(input: BirthFormInput) {
  return JSON.parse(JSON.stringify(calculateRectification(input)));
}
