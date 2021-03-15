import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { UserInfo } from '@firebase/auth-types';
import { IUserDatabaseProvider } from '../interfaces';
import { FirebaseService } from './firebase.service';

const USER_COLLECTION = 'users';

@Injectable({
  providedIn: 'root'
})
export class FirestoreSyncService implements IUserDatabaseProvider {

  constructor(
    public afs: AngularFirestore,
    public fire: FirebaseService
  ) {
  }

  public async getUserData(uid: string): Promise<UserInfo | null> {
    try {
      const doc = await this.getUserDocRefByUID(uid).get().toPromise();
      return doc.data() || null;
    } catch (error) {
      this.fire.recordException(error);
      return null;
    }
  }

  private getUserDocRefByUID(uid: string): AngularFirestoreDocument<UserInfo> {
    return this.afs.doc(`${USER_COLLECTION}/${uid}`);
  }

  public async updateUserData(uid: string, user: Partial<UserInfo>): Promise<void> {
    try {
      return this.getUserDocRefByUID(uid).update({ ...user, uid });
    } catch (error) {
      this.fire.recordException(error);
    }
  }

  /**
   * All processing happens server-side using firestore trigger
   */
  public async deleteUserData(uid: string): Promise<void> { }
  public async createUserData(user: UserInfo): Promise<void> { }

}
