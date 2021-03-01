import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

import { onAuthUserCreate } from './onAuthUserCreate';
import { onAuthUserDelete } from './onAuthUserDelete';

admin.initializeApp();

// Auth Triggers ==========================================================================================

/**
 * Creates an entry in /users collection when a user is created in auth()
 */
exports.onAuthUserCreate = functions.auth.user().onCreate(onAuthUserCreate);

/**
 * Deletes the doc from /users when the correspnding user is deleted.
 * TODO - This is where proper user cleanup functionality should happen.
 */
exports.onAuthUserDelete = functions.auth.user().onDelete(onAuthUserDelete);
