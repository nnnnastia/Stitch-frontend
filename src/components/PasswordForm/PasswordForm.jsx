import { Controller } from 'react-hook-form';
import { AccountInput } from '../AccountInput/AccountInput';

export function PasswordForm({ control, errors }) {
    return (
        <section className="password-form">
            <h2 className="password-form__title">Password</h2>

            <div className="password-form__fields">
                <div className="password-form__group">
                    <Controller
                        name="oldPassword"
                        control={control}
                        render={({ field }) => (
                            <AccountInput
                                label="Old password"
                                type="password"
                                placeholder="Old password"
                                value={field.value ?? ''}
                                onChange={field.onChange}
                                showToggle={true}
                            />
                        )}
                    />
                    {errors?.oldPassword?.message ? (
                        <p className="password-form__error">
                            {String(errors.oldPassword.message)}
                        </p>
                    ) : null}
                </div>

                <div className="password-form__group">
                    <Controller
                        name="newPassword"
                        control={control}
                        render={({ field }) => (
                            <AccountInput
                                label="New password"
                                type="password"
                                placeholder="New password"
                                value={field.value ?? ''}
                                onChange={field.onChange}
                                showToggle={true}
                            />
                        )}
                    />
                    {errors?.newPassword?.message ? (
                        <p className="password-form__error">
                            {String(errors.newPassword.message)}
                        </p>
                    ) : null}
                </div>

                <div className="password-form__group">
                    <Controller
                        name="repeatPassword"
                        control={control}
                        render={({ field }) => (
                            <AccountInput
                                label="Repeat new password"
                                type="password"
                                placeholder="Repeat new password"
                                value={field.value ?? ''}
                                onChange={field.onChange}
                                showToggle={true}
                            />
                        )}
                    />
                    {errors?.repeatPassword?.message ? (
                        <p className="password-form__error">
                            {String(errors.repeatPassword.message)}
                        </p>
                    ) : null}
                </div>
            </div>
        </section>
    );
}