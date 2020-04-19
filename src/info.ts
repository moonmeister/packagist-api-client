import axios from 'axios';

interface IPackagistPackageSource {
  type: string;
  url: string;
  reference: string;
  shasum?: string;
}

interface IPackagistPackageVersionDetails {
  name: string;
  description: string;
  time: string;
  keywords: [string];
  homepage: string;
  version: string;
  version_normalzed: string;
  licese: [string];
  authors: [
    {
      name: string;
      email: string;
      homepage?: string;
      role?: string;
    }
  ];
  source: IPackagistPackageSource;
  dist: IPackagistPackageSource;
  type: string;
  uid: number;
  autoload?: {
    [key: string]: { [key: string]: string };
  };
  require?: {
    [key: string]: string;
  };
  'require-dev'?: {
    [key: string]: string;
  };
  suggest?: {
    [key: string]: string;
  };
  extra?: {
    [key: string]: string;
  };
  provide?: {
    [key: string]: string;
  };
  [key: string]: any;
}

interface IPackagistMetadataResponse {
  packages?: {
    [packageName: string]: {
      [version: string]: IPackagistPackageVersionDetails;
    };
  };
}

type VendorPackageInput = string | { vendor: string; package: string };

/**
 * Checkout "Using the Composer metadata" @ {@link https://packagist.org/apidoc#get-package-data} for more info.
 *
 * @param ifModifiedSince If included the endpoint only returns data
 * if it has changed since this date stamp in time.
 *
 */
export async function getPackageMetadata(
  vp: VendorPackageInput,
  ifModifiedSince: string = ''
): Promise<{ data: IPackagistMetadataResponse; lastModified: string }> {
  try {
    const response = await axios.get(`https://repo.packagist.org/p/${constructVPString(vp)}.json`, {
      headers: { 'if-modified-since': ifModifiedSince },
    });

    return { data: response.data, lastModified: response.headers['last-modified'] };
  } catch (e) {
    if (e && e.response && e.response.status === 304) {
      return { data: {}, lastModified: e.response.headers['last-modified'] };
    }

    throw e;
  }
}

interface IPackagistPackageDetails {
  name: string;
  description: string;
  time: string;
  maintainers: {
    name: string;
    avatar_url: string;
  };
  versions: {
    [version: string]: IPackagistPackageVersionDetails;
  };
  type: string;
  repository: string;
  github_starts?: number;
  github_watchers?: number;
  github_forks?: number;
  github_open_issues?: number;
  language?: string;
  dependents: number;
  suggesters: number;
  downloads: {
    total: number;
    monthly: number;
    daily: number;
  };
  favers: number;
}

interface IPackagistPackageDetailResponse {
  package: IPackagistPackageDetails;
}

/**
 * Checkout "Using the API" @ {@link https://packagist.org/apidoc#get-package-data} for more info.
 */
export async function getPackageDetails(
  vp: VendorPackageInput
): Promise<IPackagistPackageDetailResponse> {
  try {
    const response = await axios.get(
      `https://packagist.org/packages/${constructVPString(vp)}.json`
    );

    return response.data;
  } catch (e) {
    throw e;
  }
}

function constructVPString(vp: VendorPackageInput): string {
  if (typeof vp === 'string') {
    return vp;
  } else if (typeof vp === 'object') {
    return `${vp.vendor}/${vp.package}`;
  } else {
    throw Error(
      `Requires string ("[vendor]/[package]") or object({vendor: [vendor], package: [package]})`
    );
  }
}

interface IPackagistStatistics {
  totals: {
    downloads: number;
    packages: number;
    version: number;
  };
}

/**
 * Checkout {@link https://packagist.org/apidoc#get-statistics} for more info.
 */
export async function getPackagistStats(): Promise<IPackagistStatistics> {
  const response = await axios.get('https://packagist.org/statistics.json');

  return response.data;
}
