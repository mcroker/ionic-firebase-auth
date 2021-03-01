
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

export async function onAuthUserDelete(user: admin.auth.UserRecord) {
    await admin.firestore().doc(`/users/${user.uid}`).delete();
    functions.logger.info(`User firestore record deleted: uid=${user.uid}, displayName=${user.displayName}`);
}