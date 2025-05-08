"use server"

import axios, { AxiosRequestConfig } from "axios"

export const doRequest = async (config: AxiosRequestConfig) =>
  axios({
    ...config,
    validateStatus: (status) => status >= 200 && status < 300,
  })
