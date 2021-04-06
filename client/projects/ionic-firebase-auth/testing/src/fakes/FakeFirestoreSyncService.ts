import { UserInfo } from '@firebase/auth-types';
import { AuthFirestoreSyncService } from 'ionic-firebase-auth';

export class FakeFirestoreSyncService {

    updateUserData: jasmine.Spy<(uid: string, user: Partial<UserInfo>) => Promise<void>> = jasmine.createSpy('updateUserData');
    createUserData: jasmine.Spy<(user: Partial<UserInfo>) => Promise<void>> = jasmine.createSpy('createUserData');
    deleteUserData: jasmine.Spy<(uid: string) => Promise<void>> = jasmine.createSpy('deleteUserData');

    static create(): FakeFirestoreSyncService & AuthFirestoreSyncService {
        return new FakeFirestoreSyncService() as any as FakeFirestoreSyncService & AuthFirestoreSyncService;
    }

}
