import ExcelJS from "exceljs";
import { Response } from "express";
import { MarylandCountyCodes } from "../assets/maryland-county-codes";
import axios from "axios";
import {
  CountyEmploymentApiResponse,
  CountyEmploymentSummary,
  CountyMonthEmploymentSummary,
} from "../models/county-employment-summary";

class CountyEmploymentService {
  private baseUrl: string = "https://api.bls.gov/publicAPI/v2/timeseries/data/";

  public async marylandCountyEmploymentGrowth(res: Response): Promise<void> {
    const workbook = new ExcelJS.Workbook();
    for (const countyCode of MarylandCountyCodes) {
      console.log("starting county code: ", countyCode);
      const summary = new CountyEmploymentSummary();
      summary.countyCode = countyCode.code;
      summary.countyName = countyCode.name;
      try {
        const result = await axios.post(this.baseUrl, {
          seriesid: [`LAUCN${countyCode.code}0000000005`],
          startyear: "2020",
          endyear: "2023",
          registrationkey: process.env.BLS_API_KEY,
        });

        const resultData = result.data.Results.series[0].data.reverse();

        if (resultData.length > 0) {
          resultData.map((value: CountyEmploymentApiResponse) => {
            const lastIndex = summary.monthSummaries.length - 1;
            summary.monthSummaries.push(<CountyMonthEmploymentSummary>{
              month: value.periodName,
              year: +value.year,
              employment: +value.value,
              deltaEmployment:
                summary.monthSummaries.length > 0
                  ? value.value - summary.monthSummaries[lastIndex].employment
                  : 0,
              netDeltaEmployment:
                summary.monthSummaries.length > 0
                  ? value.value - summary.monthSummaries[0].employment
                  : 0,
            });
          });

          const worksheet = workbook.addWorksheet(countyCode.name);
          worksheet.columns = [
            {
              header: "Month",
              key: "month",
              width: 20,
            },
            {
              header: "Year",
              key: "year",
              width: 20,
            },
            {
              header: "Employment",
              key: "employment",
              width: 20,
            },
            {
              header: "Employment Delta",
              key: "deltaEmployment",
              width: 20,
            },
            {
              header: "Net Employment Delta",
              key: "netDeltaEmployment",
              width: 30,
            },
          ];

          summary.monthSummaries.map((monthSummary) => {
            worksheet.addRow(monthSummary);
          });

          res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          );
          res.setHeader(
            "Content-Disposition",
            "attachment; filename=Maryland_County_Employment_Reports.xlsx",
          );
        }
      } catch (error) {
        console.error("Error fetching county code: ", countyCode, error);
      }
    }

    await workbook.xlsx.write(res);

    res.status(200).end();
  }
}

export default CountyEmploymentService;
