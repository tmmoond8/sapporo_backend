import express from 'express';
import translation from './translation';

const routes = express.Router();

routes.use('/translation', translation);

export default routes;