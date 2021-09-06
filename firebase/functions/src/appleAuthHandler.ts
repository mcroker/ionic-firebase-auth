import * as functions from 'firebase-functions';

/**
 * Apple auth_response handler - takes response from apple oAuth and turns it into a deeplink which opens
 * in the app for further processing. This is pretty-much pass-through, the id_token is used by the client
 * to authenticate to firebase.
 * 
 * Required firebase functions config:
 * {
 *   "apple_auth": {
 *     "deep_link_url": "https://MYDOMAIN/apple_response_url",
 *     "dynamic_link_url": "https:/MYDYNAMICLINK.page.link",
 *     "bundle_ud": "MYDOMAIN.ngxFirebase"
 *   }
 * }
 * @param req 
 * @param res 
 * @returns 
 */
export function httpsAppleAuthHandler(req: functions.https.Request, res: functions.Response) {

    const DYNAMIC_LINK_URL = functions.config().apple_auth?.dynamic_link_url;
    const DEEP_LINK_URL = functions.config().apple_auth?.deep_link_url;
    const BUNDLE_ID = functions.config().apple_auth?.bundle_id;
    const CUSTOM_SCHEME = functions.config().apple_auth?.custom_scheme;

    if (!DYNAMIC_LINK_URL || !DEEP_LINK_URL || !BUNDLE_ID) {
        functions.logger.error('Required configuration not found in functions:config');
        res.status(500).send({ "error": "server config missing" }).end();
        return;
    }

    if ('POST' === req.method) {

        const stateParam = req.body.state ? `state=${req.body.state}` : undefined;
        const errorParam = req.body.error ? `error=${req.body.error}` : undefined;
        const codeParam = !req.body.error && req.body.code ? `code=${req.body.code}` : undefined;
        const tokenParam = !req.body.error && req.body.id_token ? `id_token=${req.body.id_token}` : undefined;
        const schemeString = CUSTOM_SCHEME ? `&ius=${CUSTOM_SCHEME}` : '';
        const efiParam = 'efi=1';
        const params = [stateParam, errorParam, codeParam, tokenParam, efiParam].filter(item => !!item).join('&');
        const redirectUrl = params
            ? `${DYNAMIC_LINK_URL}/?link=${encodeURIComponent(`${DEEP_LINK_URL}/?${params}`)}&ibi=${BUNDLE_ID}${schemeString}`
            : `${DYNAMIC_LINK_URL}/?link=${encodeURIComponent(`${DEEP_LINK_URL}`)}&ibi=${BUNDLE_ID}${schemeString}`;

        res.redirect(redirectUrl);

    } else {
        res.status(400).send({ "error": "unknown method, expecting POST" }).end();
    }

}
