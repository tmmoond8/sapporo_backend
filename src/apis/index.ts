import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const googleTranslationKey = process.env.GOOGLE_TRANSLATION_KEY || ''

const googleTranslation = (text: string) => 
  axios.get(`https://translation.googleapis.com/language/translate/v2?q=${text}&target=ja&source=ko&key=${googleTranslationKey}`)
  
export default {
  googleTranslation,
}