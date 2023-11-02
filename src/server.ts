import express, { Express, Request, Response } from 'express';
import WikipediaSearchService from './services/wikipedia.service';

const app: Express = express();
const port: number | string = process.env.PORT || 3000;

const wikipediaSearchService = new WikipediaSearchService();

app.use(express.json());

app.get('/check', (req: Request, res: Response) => {
  res.json({ creator: 'Shane Hewitt' });
});

app.get('/wikipedia/:searchTerm',  async (req: Request, res: Response) => {
  res.send(await wikipediaSearchService.searchArticles(req.params.searchTerm));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});