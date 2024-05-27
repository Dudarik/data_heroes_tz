import { API_URL_EPISODE } from '@/const';
import { useFetch } from './useFetch';
import { Episode, Info } from '@/interfaces';

export * from './useFetch';

export const getEpisodeIdFromURL = (url: string) => {
  const tArr = url.split('/');
  return tArr[tArr.length - 1];
};

export const getEpisodes = async () => {
  let e_page = 1;
  const episodes = [];

  try {
    while (true) {
      const { data: episodes_p, error: error_l } = await useFetch<
        void,
        Info<Episode[]>
      >({ url: `${API_URL_EPISODE}?page=${e_page++}` });

      if (error_l.value) throw new Error(error_l.value.message);
      if (!episodes_p.value) throw new Error("Can't load episodes");

      const { results } = episodes_p.value;

      if (results) episodes.push(...results);

      if (!episodes_p.value.info?.next) break;
    }
    return Object.fromEntries(episodes.map((item) => [item.id, item.name]));
  } catch (error) {
    console.error(error);
    return {};
  }
};

export const createUrl = (
  url: URL,
  params?: {
    page?: number;
    filter?: { name?: string; status?: string };
  }
) => {
  if (!params) return url.toString();

  const { page, filter } = params;
  if (page) url.searchParams.set('page', page.toString());
  if (filter) {
    const { name, status } = filter;

    if (name) url.searchParams.set('name', name);
    if (status) url.searchParams.set('status', status);
  }
  return url.toString();
};
