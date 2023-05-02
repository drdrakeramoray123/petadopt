function isEmpty(value) {
    return !value || !value.trim() === "";
}

function userCredentialsAreValid(email, password, phone) {
    return (
        email &&
        email.includes("@") &&
        password &&
        password.trim().length >= 6 &&
        phone &&
        phone.trim().length === 10
    );
}

function userDetailsAreValid(
    firstName,
    lastName,
    email,
    phoneNumber,
    password
) {
    return (
        userCredentialsAreValid(email, password, phoneNumber) &&
        !isEmpty(firstName) &&
        !isEmpty(lastName)
    );
}

function passwordIsConfirmed(password, confirmPassword) {
    return password === confirmPassword;
}

module.exports = { isEmpty, userDetailsAreValid, passwordIsConfirmed };
