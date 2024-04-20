// secureStorage.ts
import * as SecureStorage from "expo-secure-store";

export async function secureTokens(accessToken: string, refreshToken: string) {
  try {
    await SecureStorage.setItemAsync(
      "userTokens",
      JSON.stringify({ accessToken, refreshToken })
    );
  } catch (error) {
    console.log("Error storing the auth tokens", error);
  }
}

export async function getAccessToken() {
  try {
    const tokens = await SecureStorage.getItemAsync("userTokens");
    return JSON.parse(tokens as string).accessToken;
  } catch (error) {
    console.log("Error getting the auth tokens", error);
  }
}

export async function getRefreshToken() {
  try {
    const tokens = await SecureStorage.getItemAsync("userTokens");
    return JSON.parse(tokens as string).refreshToken;
  } catch (error) {
    console.log("Error getting the auth tokens", error);
  }
}

export async function RemoveTokens() {
  try {
    await SecureStorage.deleteItemAsync("userTokens");
  } catch (error) {
    console.log("Error removing the auth tokens", error);
  }
}

export  async function clearSecureStorage() {
  try {
    await SecureStorage.deleteItemAsync("userTokens");
  } catch (error) {
    console.log("Error clearing the secure storage", error);
  }
};
