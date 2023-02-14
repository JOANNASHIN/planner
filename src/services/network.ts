import axios, { AxiosError } from 'axios';

interface NetworkPayload {
  [key: string]: any;
}

interface NetworkOptions {
  method: 'get' | 'post';
  url: string;
  data?: NetworkPayload;
  headers?: any;
}

export class Network {
  private static instance: Network;
  private baseUrl = 'https://dapi.kakao.com/';
  private AppKey = `KakaoAK ${import.meta.env.VITE_APP_KEY}`;

  constructor() {
    Network.instance = this;
  }

  /**
   * network 인스턴스 생성
   *
   * @returns instance
   */
  public static getInstance(): Network {
    if (!Network.instance) Network.instance = new Network();

    return Network.instance;
  }

  /**
   * api 요청 request 함수
   *
   * @param payload 보낼 데이터
   * @returns api response
   */
  public async request(options: NetworkOptions) {
    try {
      const { method, data, url, headers } = options;

      const config = {
        method,
        headers: {
          ...headers,
          Authorization: this.AppKey,
        },
        url: `${this.baseUrl}${url}`,
        params: 'get' === method && data ? data : null,
        data: data ?? null,
      };

      const response = await axios(config);
      return response;
    } catch (ex) {
      throw new Error('AxiosError', ex as AxiosError);
    }
  }
}

/**
 * network 공통 함수
 */
export default function networkService() {
  const network = Network.getInstance();

  const request = async (options: NetworkOptions) => {
    try {
      const result = await network.request(options);
      return result?.data ?? null;
    } catch (ex) {
      throw ex;
    }
  };

  return {
    request,
  };
}
