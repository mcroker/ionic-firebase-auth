import { UserInfo } from '@firebase/auth-types';
import { FirestoreSyncService } from '../../shared/services';

export class MalInternalFakeFirestoreSyncService {

    updateUserData: jasmine.Spy<(uid: string, user: Partial<UserInfo>) => Promise<void>> = jasmine.createSpy('updateUserData');
    createUserData: jasmine.Spy<(user: Partial<UserInfo>) => Promise<void>> = jasmine.createSpy('createUserData');
    deleteUserData: jasmine.Spy<(uid: string) => Promise<void>> = jasmine.createSpy('deleteUserData');

    static create(): MalInternalFakeFirestoreSyncService & FirestoreSyncService {
        return new MalInternalFakeFirestoreSyncService() as any as MalInternalFakeFirestoreSyncService & FirestoreSyncService;
    }

}
