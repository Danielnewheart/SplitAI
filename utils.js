function isValid(name) {
    let isValid = true;
    isValid = !!name && name.trim();
    isValid = isValid && name.match(/^[\w]+$/);
    return isValid;
}

function isValidfloat(amount) {
    let isValid = true;
    isValid = !!amount && amount.trim();
    isValid = isValid && amount.match(/^\d+(\.\d{1,2})?$/);
    return isValid;
}

function isValidDescription(description) {
    let isValid = true;
    isValid = !!description && description.trim();
    isValid =
        isValid && description.match(/^[a-zA-Z0-9\s,.!?;:'"(){}[\]-]{1,1000}$/);
    return isValid;
}

module.exports = {
    isValid,
    isValidfloat,
    isValidDescription,
};
