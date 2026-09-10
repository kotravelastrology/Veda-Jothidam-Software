'use server';

import { calculateVarshaphala } from '../../src/report/varshaphala';
import type { BirthFormInput } from '../report/actions';

export async function computeVarshaphala(input: BirthFormInput, age: number) {
  const result = calculateVarshaphala(input, age);
  return JSON.parse(JSON.stringify(result));
}
