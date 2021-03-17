import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

import { onAuthUserCreate } from './onAuthUserCreate';
import { onAuthUserDelete } from './onAuthUserDelete';
import { httpsAppleAuthHandler } from './appleAuthHandler';

admin.initializeApp();
const funcBase = functions.region('europe-west2');

exports.appleAuthHandler = funcBase.https.onRequest(httpsAppleAuthHandler);

// Auth Triggers ==========================================================================================

/**
 * Creates an entry in /users collection when a user is created in auth()
 */
exports.onAuthUserCreate = funcBase.auth.user().onCreate(onAuthUserCreate);

/**
 * Deletes the doc from /users when the correspnding user is deleted.
 * TODO - This is where proper user cleanup functionality should happen.
 */
exports.onAuthUserDelete = funcBase.auth.user().onDelete(onAuthUserDelete);
