import { API_ROUTES } from "../../constants/apiRoutes";
import apiClient from "../apiClient";

export const getMyWallet = () => apiClient.get(API_ROUTES.WALLET.GET_MY_WALLET);

export const getWalletTransactions = (page: number = 1, limit: number = 5) =>
  apiClient.get(`${API_ROUTES.WALLET.GET_WALLET_TRANSACTIONS}?page=${page}&limit=${limit}`);
