import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class AuthDeviceInfoService {

    get dateFormat(): string {
        return 'dd/MM/yyyy';
    }

}
