import { load } from './core';
load().catch((error) => {
    console.log(error.stack);
    process.exit(1);
});
