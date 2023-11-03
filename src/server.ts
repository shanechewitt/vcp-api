import express, { Express, Request, Response } from "express";
import WikipediaSearchService from "./services/wikipedia.service";
import MarylandTaxCreditService from "./services/tax-credit.service";
import CountyEmploymentService from "./services/county-employment.service";
import * as dotenv from "dotenv";

dotenv.config();

const app: Express = express();
const port: number | string = process.env.PORT || 3000;

const wikipediaSearchService = new WikipediaSearchService();
const taxCreditService = new MarylandTaxCreditService();
const countyEmploymentService = new CountyEmploymentService();

app.use(express.json());

app.get("/check", (req: Request, res: Response) => {
  res.json({ creator: "Shane Hewitt" });
});

app.get("/wikipedia/:searchTerm", async (req: Request, res: Response) => {
  res.send(await wikipediaSearchService.searchArticles(req.params.searchTerm));
});

app.get("/taxcredits/maryland", async (req: Request, res: Response) => {
  res.set(await taxCreditService.getMarylandTaxCredits(res));
});

app.get("/employment/maryland", async (req: Request, res: Response) => {
  res.set(await countyEmploymentService.marylandCountyEmploymentGrowth(res));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
