import { RequestParams } from "../types";
import { retreiveToken } from "./token";
import config from "../config";
const { SSO_INTEGRATION_ID, SSO_ENVIRONMENT, CSS_API_URL, DEBUG } = config;

export const request = async (params: RequestParams) => {
  try {
    const {
      integrationEndpoint = false,
      endpoint = "",
      method = "GET",
      body,
    } = params;

    // Get token.
    const access_token = await retreiveToken();
    if (!access_token)
      throw new Error("No access token provided by retrieveToken().");

    // Create headers.
    const headers = {
      Authorization: `Bearer ${access_token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    };

    // Create request url.
    const integration = `integrations/${SSO_INTEGRATION_ID}/`;
    const url = `${CSS_API_URL}/${
      integrationEndpoint && integration
    }${SSO_ENVIRONMENT}/${endpoint}`;

    // Fetch request.
    const response = await fetch(
      url,
      body
        ? {
            method,
            headers,
            body: JSON.stringify(body),
          }
        : {
            method,
            headers,
          }
    );

    // Log debug info.
    if (DEBUG && !response.ok) {
      const formattedResponse = {
        ok: response.ok,
        status: response.status,
        statusText: response.statusText,
        url: response.url,
        headers: JSON.stringify(response.headers),
      };
      console.log(
        `DEBUG: Request to ${endpoint} in 'citz-imb-kc-css-api': `,
        formattedResponse
      );
    }

    return await response.json();
  } catch (error) {
    // Something went wrong.
    console.error(
      `Error in 'citz-imb-kc-css-api' request. Endpoint: ${params.endpoint}.`,
      error
    );
  }
};
