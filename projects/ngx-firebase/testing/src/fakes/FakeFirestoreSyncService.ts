import { UserInfo } from '@firebase/auth-types';
import { FirestoreSyncService } from 'ngx-firebase';

export class FakeFirestoreSyncService {

    updateUserData: jasmine.Spy<(uid: string, user: Partial<UserInfo>) => Promise<void>> = jasmine.createSpy('updateUserData');
    createUserData: jasmine.Spy<(user: Partial<UserInfo>) => Promise<void>> = jasmine.createSpy('createUserData');
    deleteUserData: jasmine.Spy<(uid: string) => Promise<void>> = jasmine.createSpy('deleteUserData');

    static create(): FakeFirestoreSyncService & FirestoreSyncService {
        return new FakeFirestoreSyncService() as any as FakeFirestoreSyncService & FirestoreSyncService;
    }

}
