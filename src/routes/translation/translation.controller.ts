import express from 'express';
import APIS from '../../apis';

class TranslationController {
  public translateText = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const { params: { text } } = req;
    const { data: { data }, status } = await APIS.googleTranslation(encodeURIComponent(text));
    let translatedText;
    if (status === 200 && data.translations.length > 0) {
      console.log(data.translations);
      translatedText = data.translations[0].translatedText;
      res.json({ ok: true, originText: text, translatedText });
    } else {
      res.json({ ok: true, originText: text });
    }
  }

  public translateChunks = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const { body } = req;
    console.log(body)
    res.json({ ok: true, message: 'postTest' });
  }
};

export default new TranslationController();