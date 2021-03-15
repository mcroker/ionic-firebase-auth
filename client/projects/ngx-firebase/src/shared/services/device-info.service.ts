import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class MalDeviceInfoService {

    get dateFormat(): string {
        return 'dd/MM/yyyy';
    }

}
