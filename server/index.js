import express from 'express';
import * as Loadable from 'react-loadable';

import indexController from '../dist/src/controllers';

const PORT = 80;

// initialize the application and create the routes
const app = express();

app.use(indexController);

// start the app
Loadable.preloadAll().then(() => {
    app.listen(PORT, (error) => {
        if (error) {
            return console.log('something bad happened', error);
        }
        
        console.log("listening on " + PORT + "...");
    });
});