export type IUserProfile = {
    sub?: string;
    name?: string;
    preferred_username?: string;
}
export type IUser = {
    access_token?: string;
    expires_at?: number;
    id_token?: string;
    profile?: IUserProfile;

}
export type IUserState = {
    user: IUser | null,
    isLoadingUser: boolean
}