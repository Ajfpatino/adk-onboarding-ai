export type GoogleUser = {
  name: string;
  email: string;
  picture?: string;
};

export type Message = {
  sender: "user" | "agent";
  text: string;
};

export type CodeClientConfig = {
  client_id: string;
  scope: string;
  ux_mode?: "popup" | "redirect";
  callback: (response: { code?: string; error?: string }) => void;
};

export type GoogleCodeClient = {
  requestCode: () => void;
};

export type GoogleAccountsOAuth2 = {
  initCodeClient: (config: CodeClientConfig) => GoogleCodeClient;
};

export type GoogleAccounts = {
  oauth2: GoogleAccountsOAuth2;
};

export type GoogleWindow = {
  accounts: GoogleAccounts;
};