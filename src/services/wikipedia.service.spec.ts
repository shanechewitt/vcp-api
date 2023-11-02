import { expect } from 'chai';
import sinon from 'sinon';
import axios from 'axios';
import WikipediaSearchService from './wikipedia.service';
import { WikipediaApiResponse, WikipediaSummary } from '../models/wikipedia';

describe('WikipediaSearchService', () => {
  let sandbox: sinon.SinonSandbox;
  let service: WikipediaSearchService;
  let consoleErrorStub: sinon.SinonStub;

  const mockData = <WikipediaApiResponse>{
    query: {
      searchinfo: {
        totalhits: 7,
      },
    search: [
        { title: 'Test title', snippet: '<div>Test snippet for first hit</div>' },
      ],
    },
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    service = new WikipediaSearchService();
    consoleErrorStub = sinon.stub(console, 'error');
  });

  afterEach(() => {
    sandbox.restore();
    consoleErrorStub.restore();
  });

  it('searchArticles returns data on valid search term', async () => {
    // Arrange
    const axiosStub = sandbox.stub(axios, 'get').resolves({ data: mockData });

    // Act
    const result = await service.searchArticles('Test title');

    // Assert
    expect(axiosStub.calledOnce).to.be.true;
    expect(result).to.deep.equal(<WikipediaSummary>{
        totalHits: 7,
        firstHit: 'Test snippet for first hit'
    });
  });

  it('searchArticles throws an error on invalid search term', async () => {
    // Arrange
    const errorMessage = 'Error fetching data from Wikipedia';
    sandbox.stub(axios, 'get').rejects(new Error(errorMessage));

    try {
      // Act
      await service.searchArticles('???');
      expect.fail('Error fetching data from Wikipedia');
    } catch (error) {
      // Assert
      expect((error as Error).message).to.equal(errorMessage);
    }
  });
});
