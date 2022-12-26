import express from "express";
import path from "path";
import serverRenderer from '../middleware/renderer';
import { store } from '../store/configureStore';

const router = express.Router();

const actionIndex = (req: any, res: any, next: any) => {
    serverRenderer(store)(req, res, next);
};

// root (/) should always serve our server rendered page
router.use('^/$', actionIndex);

// other static resources should just be served as they are
router.use(express.static(
    path.resolve(__dirname, '..', '..', 'build'),
    { maxAge: '30d' },
));

// any other route should be handled by react-router, so serve the index page
router.use('*', actionIndex);


export default router;