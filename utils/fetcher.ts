import { getAccount } from "@/lib/account";
import { Status } from "@/types/generic";

// authFetch for GET and POST requests to the Spotify API
export const authFetch = async (
  userId: string | undefined,
  url: URL | RequestInfo,
  method: "GET" | "POST",
  fetchBody?: object | any[],
  fetchOptions?: RequestInit
) => {
  const account = await getAccount(userId);
  if (account) {
    const { access_token, token_type } = account;
    let options = {
      ...fetchOptions,
      method,
      headers: {
        ...fetchOptions?.headers,
        Authorization: `${token_type} ${access_token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };

    if (method === "POST" && fetchBody) {
      options = {
        ...options,
        body: JSON.stringify(fetchBody),
      };
    }

    const response = await fetch(url, options);
    const data = await response.json();

    if (data.status === 401 || data.status == 403) {
      throw new Error(data);
    }

    return data;
  } else {
    return {
      status: Status.FAIL,
      message: `Unable to find account with id: ${userId}`,
    };
  }
};
