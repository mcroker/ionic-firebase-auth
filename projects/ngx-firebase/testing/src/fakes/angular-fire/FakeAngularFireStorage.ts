import { AngularFireStorage } from '@angular/fire/storage';

export class FakeAngularFireStorage {

    constructor() {
    }

    static create(): FakeAngularFireStorage & AngularFireStorage {
        return new FakeAngularFireStorage() as any as FakeAngularFireStorage & AngularFireStorage;
    }

}
