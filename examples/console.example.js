const { load } = require('infinitymint/dist/core');
load().catch((error) => {
    console.log(error.stack);
    process.exit(1);
});
