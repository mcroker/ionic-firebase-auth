import { AngularFirestore } from '@angular/fire/firestore';

export class FakeAngularFirestore {

    constructor() {
    }

    static create(): AngularFirestore & FakeAngularFirestore {
        return new FakeAngularFirestore() as any as FakeAngularFirestore & AngularFirestore;
    }

}
