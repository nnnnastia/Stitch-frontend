import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';

import { AccountDetailsForm } from '../../components/AccountDetailsForm/AccountDetailsForm.jsx';
import { AccountSidebar } from '../../components/AccountSidebar/AccountSidebar.jsx';
import { PasswordForm } from '../../components/PasswordForm/PasswordForm.jsx';
import { ROUTES } from '../../constants/index.js';
import { profileSchema } from '../../schemas/profile.schema.js';
import { usersService } from '../../services/users.service.js';
import { clearAuthStorage } from '../../utils/auth-storage.js';

export function Profile() {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [pageError, setPageError] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [isAvatarUploading, setIsAvatarUploading] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            oldPassword: '',
            newPassword: '',
            repeatPassword: '',
        },
    });

    const handleUnauthorized = useCallback(() => {
        clearAuthStorage();
        setUser(null);
        setPageError('');
        setSubmitError('');
        setSuccessMessage('');

        reset({
            firstName: '',
            lastName: '',
            oldPassword: '',
            newPassword: '',
            repeatPassword: '',
        });

        navigate(ROUTES.LOGIN, { replace: true });
    }, [navigate, reset]);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const currentUser = await usersService.getMe();
                setUser(currentUser);

                reset({
                    firstName: currentUser.firstName ?? '',
                    lastName: currentUser.lastName ?? '',
                    oldPassword: '',
                    newPassword: '',
                    repeatPassword: '',
                });
            } catch (err) {
                if (err instanceof Error && err.message.includes('401')) {
                    handleUnauthorized();
                    return;
                }

                setPageError(
                    err instanceof Error ? err.message : 'Failed to load profile',
                );
            } finally {
                setIsLoading(false);
            }
        };

        loadUser();
    }, [reset, handleUnauthorized]);

    useEffect(() => {
        if (!successMessage) return;

        const timer = setTimeout(() => {
            setSuccessMessage('');
        }, 5000);

        return () => clearTimeout(timer);
    }, [successMessage]);

    useEffect(() => {
        if (!submitError) return;

        const timer = setTimeout(() => {
            setSubmitError('');
        }, 5000);

        return () => clearTimeout(timer);
    }, [submitError]);

    const handleAvatarUpload = async (file) => {
        if (!user) return;

        try {
            setIsAvatarUploading(true);
            setSubmitError('');
            setSuccessMessage('');

            const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
            const maxSize = 5 * 1024 * 1024;

            if (!allowedTypes.includes(file.type)) {
                throw new Error('Only JPEG, PNG, and WEBP files are allowed');
            }

            if (file.size > maxSize) {
                throw new Error('Maximum file size is 5 MB');
            }

            const updatedUser = await usersService.uploadAvatar(file);
            setUser(updatedUser);
            setSuccessMessage('Avatar updated successfully');
        } catch (err) {
            if (err instanceof Error && err.message.includes('401')) {
                handleUnauthorized();
                return;
            }

            setSubmitError(
                err instanceof Error ? err.message : 'Failed to upload avatar',
            );
        } finally {
            setIsAvatarUploading(false);
        }
    };

    const onSubmit = async (values) => {
        if (!user) return;

        try {
            setIsSaving(true);
            setSubmitError('');
            setSuccessMessage('');

            const normalizedFirstName = values.firstName.trim();
            const normalizedLastName = values.lastName.trim();

            const profileChanged =
                normalizedFirstName !== (user.firstName ?? '') ||
                normalizedLastName !== (user.lastName ?? '');

            const hasAnyPasswordValue =
                values.oldPassword.trim() !== '' ||
                values.newPassword.trim() !== '' ||
                values.repeatPassword.trim() !== '';

            if (!profileChanged && !hasAnyPasswordValue) {
                return;
            }

            let updatedUser = user;

            if (profileChanged) {
                await usersService.updateMe({
                    firstName: normalizedFirstName,
                    lastName: normalizedLastName,
                });

                updatedUser = await usersService.getMe();
                setUser(updatedUser);
            }

            if (hasAnyPasswordValue) {
                await usersService.changePassword({
                    oldPassword: values.oldPassword.trim(),
                    newPassword: values.newPassword.trim(),
                });
            }

            reset({
                firstName: updatedUser.firstName ?? normalizedFirstName,
                lastName: updatedUser.lastName ?? normalizedLastName,
                oldPassword: '',
                newPassword: '',
                repeatPassword: '',
            });

            if (profileChanged && hasAnyPasswordValue) {
                setSuccessMessage('Profile and password updated successfully');
            } else if (profileChanged) {
                setSuccessMessage('Profile updated successfully');
            } else {
                setSuccessMessage('Password updated successfully');
            }
        } catch (err) {
            if (err instanceof Error && err.message.includes('401')) {
                handleUnauthorized();
                return;
            }

            setSubmitError(
                err instanceof Error ? err.message : 'Failed to update profile',
            );
        } finally {
            setIsSaving(false);
        }
    };

    const handleLogout = () => {
        clearAuthStorage(); // очищає localStorage
        navigate(ROUTES.LOGIN, { replace: true });
    };

    if (isLoading) {
        return <div className="profile__state">Loading...</div>;
    }

    if (pageError) {
        return <div className="profile__state profile__state--error">{pageError}</div>;
    }

    if (!user) {
        return <div className="profile__state">User not found</div>;
    }

    return (
        <section className="profile">
            <div className="container">
                <h1 className="profile__title">
                    My Account
                </h1>

                <div className="profile__layout">
                    <AccountSidebar
                        user={user}
                        onAvatarClick={handleAvatarUpload}
                        onLogout={handleLogout}
                        isAvatarUploading={isAvatarUploading}
                    />

                    <div className="profile__content">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <AccountDetailsForm
                                user={user}
                                control={control}
                                errors={errors}
                            />

                            <PasswordForm control={control} errors={errors} />

                            <button
                                type="submit"
                                disabled={isSaving}
                                className="profile__submit"
                            >
                                {isSaving ? 'Saving...' : 'Save changes'}
                            </button>

                            {submitError && (
                                <p className="profile__error">{submitError}</p>
                            )}

                            {successMessage && (
                                <p className="profile__success">{successMessage}</p>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}