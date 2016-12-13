export const ROLE_ADMIN = 'Admin';
export const ROLE_OWNER = 'Owner';
export const ROLE_COUNSELOR = 'Counselor';

export const getRole = (checkRole) => {
    let role;
    switch (checkRole) {
        case ROLE_ADMIN:
            role = 3;
            break;
        case ROLE_OWNER:
            role = 2;
            break;
        case ROLE_COUNSELOR:
            role = 1;
            break;
        default:
            role = 1;
    }
    return role;
};