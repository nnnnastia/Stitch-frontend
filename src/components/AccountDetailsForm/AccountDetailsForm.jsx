import { Controller } from 'react-hook-form';
import { AccountInput } from '../AccountInput/AccountInput';

export function AccountDetailsForm({ user, control, errors }) {
    return (
        <section className="account-details-form">
            <h2 className="account-details-form__title">Деталі акаунту</h2>

            <div className="account-details-form__fields">
                <div className="account-details-form__group">
                    <Controller
                        name="firstName"
                        control={control}
                        render={({ field }) => (
                            <AccountInput
                                label="Ім'я"
                                placeholder="Ім'я"
                                value={field.value ?? ''}
                                onChange={field.onChange}
                            />
                        )}
                    />
                    {errors?.firstName?.message ? (
                        <p className="account-details-form__error">
                            {String(errors.firstName.message)}
                        </p>
                    ) : null}
                </div>

                <div className="account-details-form__group">
                    <Controller
                        name="lastName"
                        control={control}
                        render={({ field }) => (
                            <AccountInput
                                label="Прізвище"
                                placeholder="Прізвище"
                                value={field.value ?? ''}
                                onChange={field.onChange}
                            />
                        )}
                    />
                    {errors?.lastName?.message ? (
                        <p className="account-details-form__error">
                            {String(errors.lastName.message)}
                        </p>
                    ) : null}
                </div>

                <div className="account-details-form__group">
                    <Controller
                        name="phoneNumber"
                        control={control}
                        render={({ field }) => (
                            <AccountInput
                                label="Номер телефону"
                                placeholder="Номер телефону"
                                value={field.value ?? ''}
                                onChange={field.onChange}
                            />
                        )}
                    />
                    {errors?.phoneNumber?.message ? (
                        <p className="account-details-form__error">
                            {String(errors.phoneNumber.message)}
                        </p>
                    ) : null}
                </div>

                <div className="account-details-form__group">
                    <AccountInput
                        label="Електронна пошта"
                        type="email"
                        value={user?.email ?? ''}
                        disabled={true}
                    />
                </div>
            </div>
        </section>
    );
}