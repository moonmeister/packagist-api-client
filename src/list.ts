import axios from 'axios';

interface IPackagistGetReponse {
  packageNames: [string];
}

/**
 * Checkout {@link https://packagist.org/apidoc#list-packages} for more info.
 */
export async function listAll(): Promise<IPackagistGetReponse> {
  const response = await axios.get('https://packagist.org/packages/list.json');

  return response.data;
}

/**
 * Checkout {@link https://packagist.org/apidoc#list-packages-by-organization} for more info.
 */
export async function listByOrg(vendor: string): Promise<IPackagistGetReponse> {
  const response = await axios.get(`https://packagist.org/packages/list.json?vendor=${vendor}`);

  return response.data;
}

/**
 * Checkout {@link https://packagist.org/apidoc#list-packages-by-type} for more info.
 */
export async function listByType(type: string): Promise<IPackagistGetReponse> {
  const response = await axios.get(`https://packagist.org/packages/list.json?type=${type}`);

  return response.data;
}
