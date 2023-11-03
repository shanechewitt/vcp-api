export class CountyMonthEmploymentSummary {
  year!: number;
  month!: string;
  employment!: number;
  deltaEmployment!: number;
  netDeltaEmployment!: number;
}

export class CountyEmploymentSummary {
  countyCode!: string;
  countyName!: string;
  monthSummaries: Array<CountyMonthEmploymentSummary> = [];
}

export class CountyEmploymentApiResponse {
  year!: number;
  periodName!: string;
  value!: number;
}
