import type { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import axios, { AxiosError, AxiosHeaders } from "axios";

const api = axios.create({
  baseURL: process.env.API_URL,
});

const getJwt = async (req: NextApiRequest) => {
  return await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Get the JWT
  const jwt = await getJwt(req);

  // Get needed objects from client-side request
  const { path } = req.query;
  const method = req.method;
  const contentType = req.headers["content-type"] as string;
  const headers = new AxiosHeaders({
    "Content-Type": contentType,
  });
  const body = req.body;
  const forwardPath = Array.isArray(path) ? path.join("/") : `/${path}`;

  try {
    // Set request specific items
    let forwardedBody = body;

    if (method !== "GET" && method !== "DELETE") {
      const contentType = headers.get("Content-Type") as string;
      if (contentType?.includes("application/json") && body) {
        forwardedBody = JSON.stringify(body);
      }
    }

    if (method === "GET") {
      forwardedBody = undefined;
    }

    if (jwt?.access_token) {
      headers.set("Authorization", `Bearer ${jwt.access_token}`);
    }

    let response;

    try {
      response = await api.request({
        method: method,
        url: forwardPath,
        headers: headers,
        data: forwardedBody,
      });
    } catch (error: unknown) {
      console.log(
        `An unexpected error occurred at ${forwardPath} with data: ${forwardedBody}`,
        error
      );

      if (error instanceof AxiosError) {
        // Check if the request is unauthorized and the JWT is expired
        if (
          error.response?.status === 401 &&
          jwt &&
          error.response?.headers["expired"]
        ) {
          res.status(307).json({ url: "/auth/signout" });
          return;
        }

        // Any other error that may occur
        if (error.response?.status && error.response?.status >= 400) {
          console.error(error.response?.data.detail);
          res
            .status(error.response?.status)
            .send({ error: `Error: ${error.response?.data.detail}` });
          return;
        }
      }
    }

    // If the response is not found, return an internal server error
    if (!response) {
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    // Respond to the client
    res.setHeader(
      "Content-Type",
      response.headers["content-type"] || "application/json"
    );
    res.status(response.status).send(response.data);
  } catch (error) {
    console.error("Error forwarding request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
