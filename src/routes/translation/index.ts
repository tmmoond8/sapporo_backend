import express from 'express';
import TranslationController from './translation.controller';

const translation = express.Router();

translation.get('/:text', TranslationController.translateText);
translation.post('/', TranslationController.translateChunks);

export default translation;