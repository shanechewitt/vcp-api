import puppeteer from "puppeteer";
import { TaxCreditSummary } from "../models/tax-credits";
import ExcelJS from "exceljs";
import { Response } from "express";

class MarylandTaxCreditService {
  private baseUrl: string =
    "https://commerce.knack.com/maryland-funding-incentives";

  public async getMarylandTaxCredits(res: Response): Promise<void> {
    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"],
    });
    const page = await browser.newPage();
    await page.goto(this.baseUrl, { waitUntil: "networkidle0" });

    await page.waitForSelector("table");

    const data = await page.evaluate(() => {
      const taxCredits: TaxCreditSummary[] = [];
      const rows = Array.from(document.querySelectorAll("table tbody tr"));
      rows.map((row) => {
        const type = row
          .querySelector('td[data-field-key="field_22"]')
          ?.innerHTML.replace(/(<([^>]+)>)/gi, "")
          .trim();
        console.log(type);
        if (type === "Tax Credit") {
          taxCredits.push(<TaxCreditSummary>{
            name: row
              .querySelector('td[data-field-key="field_21"]')
              ?.innerHTML.replace(/(<([^>]+)>)/gi, "")
              .trim(),
            details: row
              .querySelector('td[data-field-key="field_23"]')
              ?.innerHTML.replace(/(<([^>]+)>)/gi, "")
              .replace("View Program", "")
              .replace(";amp", "")
              .trim(),
            programlink: (
              row
                .querySelector('td[data-field-key="field_23"]')
                ?.querySelector("a") as HTMLAnchorElement
            ).href,
          });
        }
      });
      return taxCredits;
    });

    await browser.close();
    this.createExcelFile(data, res);
  }

  public async createExcelFile(
    marylandTaxSummaries: TaxCreditSummary[],
    res: Response,
  ): Promise<void> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Maryland Tax Credits");
    worksheet.columns = [
      {
        header: "Name",
        key: "name",
        width: 30,
        style: {
          alignment: {
            wrapText: true,
          },
        },
      },
      {
        header: "Details",
        key: "details",
        width: 100,
        style: {
          alignment: {
            wrapText: true,
          },
        },
      },
      {
        header: "Program link",
        key: "programlink",
        width: 100,
        style: {
          alignment: {
            wrapText: true,
          },
        },
      },
    ];
    marylandTaxSummaries.forEach((credit: TaxCreditSummary) => {
      worksheet.addRow(credit);
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=Maryland_Tax_Credits.xlsx",
    );
    await workbook.xlsx.write(res);

    res.status(200).end();
  }
}

export default MarylandTaxCreditService;
