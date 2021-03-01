import { User } from '@firebase/auth-types';
import { v4 as uuid } from 'uuid';

export class FakeUserCredential {
    credential = null;
    user: jasmine.SpyObj<User> = {
        uid: uuid(),
        displayName: uuid(),
        isAnonymous: false,
        sendEmailVerification: jasmine.createSpy<() => Promise<void>>('sendEmailVerification'),
        updateProfile: jasmine.createSpy<(profile: { displayName?: string | null; photoURL?: string | null; }) => Promise<void>>('updateProfile'),
        delete: jasmine.createSpy<() => Promise<void>>('delete')
    } as any;

    constructor(data?: {
        user?: Partial<User>
    }) {
        if (data && data?.user) {
            Object.assign(this.user, data.user);
        }
    }

}