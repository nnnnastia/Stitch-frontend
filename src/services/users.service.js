import { http } from "../api/http.js";

export const usersService = {
    async getMe() {
        const response = await http("/api/users/me");
        return mapUserFromApi(response.user);
    },

    async updateMe(payload) {
        const response = await http("/api/users/me", {
            method: "PATCH",
            body: JSON.stringify({
                userName: payload.firstName,
                userSurname: payload.lastName,
                phoneNumber: payload.phoneNumber,
            }),
        });

        return mapUserFromApi(response.user);
    },

    async changePassword(payload) {
        return await http("/api/users/me/password", {
            method: "PATCH",
            body: JSON.stringify({
                oldPassword: payload.oldPassword,
                newPassword: payload.newPassword,
                repeatPassword: payload.repeatPassword,
            }),
        });
    },

    async uploadAvatar(file) {
        const formData = new FormData();
        formData.append("avatar", file);

        const response = await http("/api/users/me/avatar", {
            method: "PATCH",
            body: formData,
        });

        return mapUserFromApi(response.user);
    },
};

function mapUserFromApi(user) {
    return {
        id: user._id,
        firstName: user.userName ?? "",
        lastName: user.userSurname ?? "",
        email: user.email ?? "",
        phoneNumber: user.phoneNumber ?? "",
        avatarUrl: user.avatarUrl ?? "",
        role: user.role ?? "user",
        isActive: Boolean(user.isActive),
        emailVerified: Boolean(user.emailVerified),
    };
}