import axios from "axios";
import { WikipediaApiResponse, WikipediaSummary } from "../models/wikipedia";

class WikipediaSearchService {
  private baseUrl: string = "https://en.wikipedia.org/w/api.php";

  public async searchArticles(searchTerm: string): Promise<WikipediaSummary> {
    try {
      const response = await axios.get(this.baseUrl, {
        params: {
          action: "query",
          list: "search",
          srsearch: searchTerm,
          format: "json",
        },
      });
      const data = <WikipediaApiResponse>response?.data;
      if (data.query.search.length > 0) {
        return <WikipediaSummary>{
          totalHits: data.query.searchinfo.totalhits,
          firstHit: data.query.search[0].snippet.replace(/(<([^>]+)>)/gi, ""),
        };
      } else {
        return <WikipediaSummary>{
          totalHits: 0,
          firstHit: `There was no hit for the query ${searchTerm} on the wikipedia api`
        }
      }
      
    } catch (error) {
      console.error("Error fetching data from Wikipedia:", error);
      throw error;
    }
  }
}

export default WikipediaSearchService;
