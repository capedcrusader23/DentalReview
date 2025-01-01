exports.structureResponse = (body, success, message) => ({
    headers: { success, message },
    body,
});

exports.structureResponseStatus = (body, success, message, status) => ({
    headers: { success, message },
    body,
    status,
});