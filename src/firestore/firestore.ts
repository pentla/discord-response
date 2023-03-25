import { CustomResponse } from '../type';
import { RESPONSE_COLLECTION } from './config';
import { Firestore } from "@google-cloud/firestore"

export const createResponse = (client: Firestore, serverID: string, response: CustomResponse) => {
  return client.doc(`${RESPONSE_COLLECTION}/${serverID}/keywords/${response.keyword}`).set(response)
}

export const deleteResponse = async (client: Firestore, serverID: string, keyword: string) => {
  const docSnap = await client.doc(`${RESPONSE_COLLECTION}/${serverID}/keywords/${keyword}`).get()
  if (docSnap.exists) {
    return docSnap.ref.delete()
  } else {
    return new Promise((resolve, reject) => {
      reject('NOTFOUND')
    })
  }
}

export const listResponse = async (client: Firestore, serverID: string): Promise<string[]> => {
  const collection = await client.collection(`${RESPONSE_COLLECTION}/${serverID}/keywords`).get()
  return collection.docs.map(doc => doc.data().keyword)
}

export const getResponse = async (client: Firestore, serverID: string, keyword: string): Promise<CustomResponse> => {
  const docSnap = await client.doc(`${RESPONSE_COLLECTION}/${serverID}/keywords/${keyword}`).get()
  if (docSnap.exists) {
    const doc = await docSnap.ref.get()
    return {
      keyword: doc.data()?.keyword,
      response: doc.data()?.response,
    }
  } else {
    return new Promise((resolve, reject) => {
      reject('NOTFOUND')
    })
  }
}