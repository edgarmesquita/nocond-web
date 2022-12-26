import { UserManager } from 'oidc-client';

let userManager: UserManager | null = null;
export function getUserManager(): UserManager {

    if (userManager)
        return userManager;

    const config = {
        authority: process.env.REACT_APP_AUTHORITY,
        client_id: process.env.REACT_APP_CLIENT_ID,
        redirect_uri: process.env.REACT_APP_REDIRECT_URI,
        response_type: process.env.REACT_APP_RESPONSE_TYPE,
        scope: process.env.REACT_APP_SCOPE,
        post_logout_redirect_uri: process.env.REACT_APP_POST_LOGOUT_REDIRECT_URI,
    };
    userManager = new UserManager(config);

    return userManager;
}


export function signinRedirect() {
    return getUserManager().signinRedirect()
}

export function signinRedirectCallback() {
    return getUserManager().signinRedirectCallback()
}

export function signoutRedirect() {
    getUserManager().clearStaleState()
    getUserManager().removeUser()
    return getUserManager().signoutRedirect()
}

export function signoutRedirectCallback() {
    getUserManager().clearStaleState()
    getUserManager().removeUser()
    return getUserManager().signoutRedirectCallback()
}