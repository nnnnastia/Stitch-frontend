import { Controller } from 'react-hook-form';
import { AccountInput } from '../AccountInput/AccountInput';

export function AccountDetailsForm({ user, control, errors }) {
    return (
        <section className="account-details-form">
            <h2 className="account-details-form__title">Account Details</h2>

            <div className="account-details-form__fields">
                <div className="account-details-form__group">
                    <Controller
                        name="firstName"
                        control={control}
                        render={({ field }) => (
                            <AccountInput
                                label="First name"
                                placeholder="First name"
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
                                label="Last name"
                                placeholder="Last name"
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
                                label="Phone number"
                                placeholder="Phone number"
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
                        label="Email"
                        type="email"
                        value={user?.email ?? ''}
                        disabled={true}
                    />
                </div>
            </div>
        </section>
    );
}