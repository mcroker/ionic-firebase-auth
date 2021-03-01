
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

export async function onAuthUserCreate(user: admin.auth.UserRecord) {
    await admin.firestore().doc(`/users/${user.uid}`).set({
        uid: user.uid,
        photoURL: user.photoURL,
        phoneNumber: user.phoneNumber,
        displayName: user.displayName,
        email: user.email,
        emailVerified: user.emailVerified
    });
    functions.logger.info(`User firestore record created: uid=${user.uid}, displayName=${user.displayName}`);
}