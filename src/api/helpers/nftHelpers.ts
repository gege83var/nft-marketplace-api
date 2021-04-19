import { ICompleteNFT, INFT } from "src/interfaces/graphQL";
import UserService from "../services/user";
import L from "../../common/logger";
import fetch from "node-fetch";

/**
 * Adds information to NFT object from external sources
 * @param NFT - NFT object
 * @returns - NFT object with new fields
 */
export async function populateNFT(NFT: INFT): Promise<ICompleteNFT | INFT> {
  let retNFT: INFT = NFT;
  retNFT = await this.populateNFTCreator(retNFT);
  retNFT = await this.populateNFTOwner(retNFT);
  retNFT = await this.populateNFTUri(retNFT);
  return retNFT;
}

/**
 * Pulls owner from database and adds creator's info to NFT object
 * @param NFT - NFT object with creator field
 * @returns NFT object with new creactorData field, if creator's id was valid, object stays untouched otherwise
 */
export async function populateNFTCreator(
  NFT: INFT
): Promise<ICompleteNFT | INFT> {
  try {
    const { creator } = NFT;
    const creatorData = await UserService.findUser(creator);
    return { ...NFT, creatorData };
  } catch (err) {
    L.error({ err }, "NFT creator id not in database");
    return NFT;
  }
}

/**
 * Pulls owner from database and adds owner's info to NFT object
 * @param NFT - NFT object with owner field
 * @returns NFT object with new ownerData field, if owner's id was valid, object stays untouched otherwise
 */
export async function populateNFTOwner(
  NFT: INFT
): Promise<ICompleteNFT | INFT> {
  try {
    const { owner } = NFT;
    const ownerData = await UserService.findUser(owner);
    return { ...NFT, ownerData };
  } catch (err) {
    L.error({ err }, "NFT owner id not in database");
    return NFT;
  }
}

/**
 * Populates an NFT object with data from its URI JSON
 * @param NFT - NFT object with uri field
 * @returns NFT object with new fields, if uri was valid, object stays untouched otherwise
 */
export async function populateNFTUri(NFT: INFT): Promise<ICompleteNFT | INFT> {
  try {
    const info = await (await fetch(NFT.uri)).json();
    return { ...NFT, ...info };
  } catch (err) {
    L.error({ err }, "invalid NFT uri");
    return NFT;
  }
}