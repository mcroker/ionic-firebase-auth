import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { UserInfo } from '@firebase/auth-types';
import { SetOptions } from '@firebase/firestore-types'
import { FirebaseService } from './firebase.service';

const USER_COLLECTION = '/users';

export interface UserProfile extends UserInfo {
  acceptedTos: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class FirestoreSyncService {

  constructor(
    public afs: AngularFirestore,
    public fire: FirebaseService
  ) {
  }

  public async getUserData(uid: string): Promise<UserProfile | null> {
    try {
      const doc = await this.getUserDocRefByUID(uid).get().toPromise();
      return doc.data() || null;
    } catch (error) {
      this.fire.recordException(error);
      return null;
    }
  }

  private getUserDocRefByUID(uid: string): AngularFirestoreDocument<UserProfile> {
    return this.afs.doc(`${USER_COLLECTION}/${uid}`);
  }

  public async setUserData(uid: string, user: Partial<UserProfile>, options?: SetOptions): Promise<void> {
    try {
      return this.afs.doc(`${USER_COLLECTION}/${uid}`).set(user, options);
    } catch (error) {
      this.fire.recordException(error);
    }
  }

  public async updateUserData(uid: string, user: Partial<UserProfile>): Promise<void> {
    try {
      return this.getUserDocRefByUID(uid).update({ ...user, uid });
    } catch (error) {
      this.fire.recordException(error);
    }
  }

}
