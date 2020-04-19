import axios from 'axios';

interface IPackagistSearchResponse {
  results: [IPackagistSearchResponseItem];
  total: number;
  next?: Function;
}

async function fetchPaginatedResult(url: string | URL): Promise<IPackagistSearchResponse> {
  const response = await axios.get(url.toString());

  if (!response.data.next) {
    return response.data;
  }

  return { ...response.data, next: async () => fetchPaginatedResult(response.data.next) };
}

interface IPackagistSearchResponseItem {
  name: string;
  description: string;
  url: string;
  repository: string;
  downloads: number;
  favers: number;
  abandoned?: string;
}

/**
 * Checkout {@link https://packagist.org/apidoc#search-packages} for more info.
 */
export async function search(
  {
    name,
    tags,
    type,
  }: {
    name: string;
    tags: string | Array<string>;
    type: string;
  },
  pageSize?: number
): Promise<IPackagistSearchResponse> {
  const url = new URL('https://packagist.org/search.json');

  url.searchParams.append('q', name);
  addTagQueries(url, tags);
  url.searchParams.append('type', type);

  if (pageSize) {
    url.searchParams.append('per_page', pageSize.toString());
  }

  return fetchPaginatedResult(url);
}

/**
 * Checkout {@link https://packagist.org/apidoc#search-packages-by-name} for more info.
 */
export async function searchByName(
  name: string,
  pageSize?: number
): Promise<IPackagistSearchResponse> {
  const url = new URL('https://packagist.org/search.json');

  url.searchParams.append('q', name);
  if (pageSize) {
    url.searchParams.append('per_page', pageSize.toString());
  }
  return fetchPaginatedResult(url);
}

/**
 * Checkout {@link https://packagist.org/apidoc#search-packages-by-tag} for more info.
 *
 * If you would like to search by multiple tags pass an array of strings to the first parameter.
 * FYI: multiple tags are currently tread as "OR" statements by the Packagist API.
 *
 * If you figure out how to do an 'AND' tag search please open an issue to let me know.
 */
export async function searchByTag(
  tags: string | Array<string>,
  pageSize?: number
): Promise<IPackagistSearchResponse> {
  const url = new URL('https://packagist.org/search.json');

  addTagQueries(url, tags);

  if (pageSize) {
    url.searchParams.append('per_page', pageSize.toString());
  }

  return fetchPaginatedResult(url);
}

/**
 * Checkout {@link https://packagist.org/apidoc#search-packages-by-type} for more info.
 */
export async function searchByType(
  type: string,
  pageSize?: number
): Promise<IPackagistSearchResponse> {
  const url = new URL('https://packagist.org/search.json');

  url.searchParams.append('type', type);
  if (pageSize) {
    url.searchParams.append('per_page', pageSize.toString());
  }
  return fetchPaginatedResult(url);
}

function addTagQueries(url: URL, tags: string | Array<string>) {
  if (typeof tags === 'string') {
    url.searchParams.append('tags', tags);
  } else if (Array.isArray(tags)) {
    tags.forEach((tag, i) => {
      url.searchParams.append(`tags[${i}]`, tag);
    });
  } else {
    throw Error('tags input must be a string or an Array of strings');
  }

  return url;
}
