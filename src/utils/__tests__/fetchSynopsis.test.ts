import fetchMock from "jest-fetch-mock";
import fetchSynopsis from "../fetchSynopsis";

fetchMock.enableMocks();

describe("fetchSynopsis", () => {
  beforeEach(() => {
    global.fetch.mockClear();
  });

  it("makes a authorised request to /synopsis", async () => {
    global.fetch.mockResponse(() =>
      Promise.resolve(JSON.stringify({ data: {} }))
    );

    const token = "ABC123";

    await fetchSynopsis(token);

    expect(global.fetch.mock.calls[0][0]).toContain("/synopsis");
    // @ts-ignore: Property Authorisation does not exist on type Headers
    expect(global.fetch.mock.calls[0][1]?.headers?.Authorization).toContain(
      token
    );
  });

  it("makes a single request, given a successful reponse", async () => {
    global.fetch.mockResponse(() =>
      Promise.resolve(JSON.stringify({ data: {} }))
    );

    const token = "ABC123";

    await fetchSynopsis(token);

    expect(global.fetch).toBeCalledTimes(1);
  });

  it("makes three failing requests before giving up", async () => {
    const failureBody = JSON.stringify({ code: "", description: "" });

    global.fetch.mockResponse(() => Promise.reject(failureBody));

    const token = "ABC123";

    expect.assertions(2);

    try {
      await fetchSynopsis(token);
    } catch (e) {
      expect(global.fetch).toBeCalledTimes(3);
      expect(e).toBe(failureBody);
    }
  });
});
