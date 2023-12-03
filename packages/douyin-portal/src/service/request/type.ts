import type { AxiosRequestConfig, AxiosResponse } from 'axios'

export interface ApiRequestInterceptors<T = AxiosResponse> {
  requestInterceptor?: (config: AxiosRequestConfig) => AxiosRequestConfig
  requestInterceptorCatch?: (error: any) => any
  responseInterceptor?: (res: T) => T
  responseInterceptorCatch?: (error: any) => any
}

export interface ApiRequestConfig<T = AxiosResponse>
  extends AxiosRequestConfig {
  interceptors?: ApiRequestInterceptors<T>
}
