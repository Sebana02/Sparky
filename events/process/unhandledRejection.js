// Event when an unhandled rejection occurs
module.exports = {
    event: "unhandledRejection",
    callback: async (client, promiseRejectionEvent) => {
        console.error("Unhandled rejection: ", promiseRejectionEvent);
    }
};
