// This token is the official token containing the final configuration; ie. the merge between default and user provided configurations
import { InjectionToken } from '@angular/core';
import { MalIAPOptions } from '../interfaces';

export const MalIAPOptionsToken = new InjectionToken<MalIAPOptions[]>('IAPOptionsToken');
