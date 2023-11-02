export interface WikipediaApiResponse {
    query: {
        searchinfo: {
            totalhits: number,
        }
      search: [{
        title: string;
        snippet: string;
      }];
    };
}

export interface WikipediaSummary {
    totalHits: number;
    firstHit: string;
}