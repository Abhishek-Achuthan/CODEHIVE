import { API_ROUTES } from "../../constants/apiRoutes";
import apiClient from "../apiClient";

export const previewInvite = (code: string) =>
  apiClient.get(API_ROUTES.INVITE.PREVIEW(code));

export const joinViaInvite = (code: string) =>
  apiClient.post(API_ROUTES.INVITE.JOIN(code));
