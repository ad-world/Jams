import { getAccount } from "@/lib/account";
import { GenericResponse, Status } from "@/types/generic";

// authFetch for GET and POST requests to the Spotify API
export const authFetch = async<T> (
  userId: string | undefined,
  url: URL | RequestInfo,
  method: "GET" | "POST",
  fetchBody?: object | any[],
  fetchOptions?: RequestInit
): Promise<GenericResponse<T>> => {
  try {
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

      if(response.status == 204) {
        return {
          status: Status.SUCCESS,
          message: "Operation complete."
        }
      }

      const data = await response.json();


      if (data.status == 400 || data.status === 401 || data.status == 403) {
        throw new Error(data);
      }

      return {
        status: Status.SUCCESS,
        data: data as T
      };

    } else {
      return {
        status: Status.FAIL,
        message: `Unable to find account with id: ${userId}`,
        data: null
      };
    }
  } catch (err) {
    return {
      status: Status.FAIL,
      message: err as string,
      data: null
    }
  }

};
