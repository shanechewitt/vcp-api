import express, { Express, Request, Response } from 'express';

const app: Express = express();
const port: number | string = process.env.PORT || 3000;

app.use(express.json());

app.get('/check', (req: Request, res: Response) => {
  res.json({ creator: 'Shane Hewitt' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});