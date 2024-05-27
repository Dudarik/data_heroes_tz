import { Ref, ref } from 'vue';
import { API_URL_CHARACTER, OK } from '@/const';

export enum EMethods {
  get = 'GET',
  post = 'POST',
  put = 'PUT',
  patch = 'PATCH',
  delete = 'DELETE',
}

export interface IFetchOptions<T> {
  req_type?: string;
  url?: string;
  params?: T[];
  body?: string;
  method?: EMethods;
  headers?: HeadersInit;
  mode?: RequestMode;
  credentials?: RequestCredentials;
}

export interface IFetch<D> {
  data: Ref<D | null>;
  error: Ref<Error | null>;
}

// Часть useFetch - с одного из проектов.

export const useFetch = async <T, R>(
  options: IFetchOptions<T>
): Promise<IFetch<R>> => {
  const data = ref<Ref<R> | null>(null);
  const error = ref<Ref<Error> | null>(null);

  const defalutHeaders = {
    'Content-Type': 'application/json',
  };

  const {
    params = [],
    url = API_URL_CHARACTER,
    method = EMethods.get,
    headers = defalutHeaders,
    mode = 'cors',
    credentials = 'include',
    body = undefined,
  } = options;

  let configBody = undefined;

  switch (method) {
    case EMethods.post: {
      configBody = JSON.stringify({ params });
      break;
    }
    case EMethods.patch: {
      configBody = body ? body : '';
      break;
    }

    default:
      configBody = '';
      break;
  }

  const config = {
    method,
    headers,
    mode,
    credentials,
    body: method === EMethods.get ? undefined : configBody,
  };

  try {
    const response = await fetch(url, config);

    if (response.status !== OK) {
      const error = await response.json();

      throw new Error(
        `${response.status}: ${response.statusText} (${error.error})`
      );
    }
    data.value = await response.json();
  } catch (err) {
    const e = err as Error;
    error.value = e;
  }
  return { data, error };
};
