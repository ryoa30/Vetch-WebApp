const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const API_URL = {
    USER: `${API_BASE_URL}/api/users`,
    LOCATION: `${API_BASE_URL}/api/locations`,
    ADMIN: `${API_BASE_URL}/api/admin`,
    BLOG: `${API_BASE_URL}/api/blogs`,
    VET: `${API_BASE_URL}/api/vet`,
    BOOKING: `${API_BASE_URL}/api/booking`,
    PET: `${API_BASE_URL}/api/pet`,
    PAYMENT: `${API_BASE_URL}/api/payment`,
    CHAT: `${API_BASE_URL}/api/chat`,
}
