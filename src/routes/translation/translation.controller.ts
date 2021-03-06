import express from 'express';
import APIS from '../../apis';
import LruCache from 'lru-cache';

const dictionary = new LruCache<string, string>({
  max: 1000,
  maxAge: 1000 * 60 * 60 * 24 * 365,
});

class TranslationController {
  public translateText = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const { params: { text } } = req;
    if (dictionary.has(text)) {
      res.json({ ok: true, originText: text, translatedText: dictionary.get(text) });
    } else {
      try {
        const { data: { data }, status } = await APIS.googleTranslation(encodeURIComponent(text));
        let translatedText;
        if (status === 200 && data.translations.length > 0) {
          translatedText = data.translations[0].translatedText;
          dictionary.set(text, translatedText);
          res.json({ ok: true, data: translatedText });
        } 
      } catch (error) {
        console.error(error);
      }
      res.json({ ok: false, data: '' });
    }
  }

  public translateChunks = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const { body} = req;
    if (!Array.isArray(body)) {
      res.json({ ok: false });
    } else {
      const translationQueue: Record<string, Promise<{ data: { data: any }}>> = {};
      const response: string[] = [];
      
      body.forEach((text: string, index: number) => {
        if (dictionary.has(text)) {
          response[index] = dictionary.get(text) || '';
        } else {
          translationQueue[index.toString()] = APIS.googleTranslation(encodeURIComponent(text))
        }
      })

      const entries = Object.entries(translationQueue);
      try {
        const results = await Promise.all(entries.map(([_, value]) => value));
        const dataSet = results.map(result => result.data.data);
        entries.forEach(([key, _], index) => {
          const translatedText = dataSet[index].translations[0].translatedText;
          response[parseInt(key)] = translatedText;
          dictionary.set(body[key as any], translatedText)
        });
        res.json({ ok: true, data: response });
      } catch(error) {
        console.error(error);
      }
      res.json({ ok: false, data: [] });
    }
  }
};

export default new TranslationController();