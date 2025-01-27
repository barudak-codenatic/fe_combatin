export interface RefreshToken {
    refreshToken : string;
}

export interface SignInRes extends RefreshToken {
    accessToken : string;
}

