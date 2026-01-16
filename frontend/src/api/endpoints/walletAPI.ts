import { API_ROUTES } from "../../constants/apiRoutes";
import apiClient from "../apiClient";

export const getMyWallet = () => apiClient.get(API_ROUTES.WALLET.GET_MY_WALLET);
