// This token is the official token containing the final configuration; ie. the merge between default and user provided configurations
import { InjectionToken } from '@angular/core';
import { IAPOptions } from '../interfaces';

export const IAPOptionsToken = new InjectionToken<IAPOptions[]>('IAPOptionsToken');
