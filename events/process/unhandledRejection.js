// Event when an unhandled rejection occurs
module.exports = {
    event: "unhandledRejection",
    callback: async (client, promiseRejectionEvent) => {
        console.error("Error: unhandled promise rejection: ", promiseRejectionEvent);
    }
};
