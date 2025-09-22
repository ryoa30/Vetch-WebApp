export interface IResponse {
    ok: boolean;
    message: string;
    data?: any;
    addresses?: any;
    error?: string;
    accessToken?: string;
}