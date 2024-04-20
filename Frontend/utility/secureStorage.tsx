// secureStorage.ts
import * as EncryptedStorage from "expo-secure-store";

export async function secureTokens(accessToken: string, refreshToken: string) {
  try {
    await EncryptedStorage.setItemAsync(
      "userTokens",
      JSON.stringify({ accessToken, refreshToken })
    );
  } catch (error) {
    console.error("Error storing the auth tokens", error);
  }
}

export async function getTokens() {
  try {
    const tokens = await EncryptedStorage.getItemAsync("userTokens");
    return JSON.parse(tokens as string);
  } catch (error) {
    console.error("Error getting the auth tokens", error);
  }
}

export async function getRereshToken() {
  try {
    const tokens = await EncryptedStorage.getItemAsync("userTokens");
    return JSON.parse(tokens as string).refreshToken;
  } catch (error) {
    console.error("Error getting the auth tokens", error);
  }
}

export async function RemoveTokens() {
  try {
    await EncryptedStorage.deleteItemAsync("userTokens");
  } catch (error) {
    console.error("Error removing the auth tokens", error);
  }
}
