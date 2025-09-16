export interface IResponse {
    ok: boolean;
    message: string;
    data?: any;
    error?: string;
    accessToken?: string;
}