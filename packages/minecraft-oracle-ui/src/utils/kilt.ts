export async function getKiltExtension(): Promise<InjectedWindowProvider> {
  if (!window.hasOwnProperty("kilt")) {
    throw new Error("kilt is not exposed on window object")
  }
  const kiltExtensions = Object.values(window.kilt)
  if (kiltExtensions.length === 0) {
    throw new Error("No kilt wallet")
  }

  return kiltExtensions[0]
}

export async function walletLogin(extension: InjectedWindowProvider) {
  //get wallet session from server
  console.log("fetching wallet session from server...")
  const values = await fetch(`http://localhost:3030/api/v1/auth/kilt/wallet_session`);
  const parsedValues = await values.json()

  console.log(JSON.stringify(parsedValues))
  const {
    sessionId,
    walletSessionChallenge,
    dappName,
    dAppEncryptionKeyUri,
  } = parsedValues;

  //extension signs challenge and sends back to server
  console.log(`dappName: ${dappName} dAppEncryptionKeyUri: ${dAppEncryptionKeyUri} walletSessionChallenge: ${walletSessionChallenge}`
  )
  //sporran expects to load didConfiguration.json from root directory of host localhost:3000/didConfiguration.json, it will error out if it's not there
  console.log("starting session with extension...")
  let session: PubSubSession
  try {
    session = await extension.startSession(dappName, dAppEncryptionKeyUri, walletSessionChallenge);

  } catch (e: any) {
    const errStr = e.toString()
    if (errStr.includes("Request failed with status code 404 Not Found")) {
      throw new Error("Sporran could likely not find didConfiguration.json")
    } else {
      console.log(e.stack)
      throw e
    }

  }

  const newSess: any = { ...session }
  newSess.encryptedWalletSessionChallenge = newSess.encryptedChallenge
  delete newSess.encryptedChallenge
  console.log("POSTing session")
  await fetch(`http://localhost:3030/api/v1/auth/kilt/wallet_session`, {
    method: 'POST',
    headers: { "Content-Type": 'application/json' },
    body: JSON.stringify({ ...newSess, sessionId }),
  });

  console.log("Starting wallet login...")
  const result = await fetch(`http://localhost:3030/api/v1/auth/kilt/wallet_login?sessionId=${sessionId}`);
  let message = await result.json();
  //backwards compatibility with old sporran extensions, newer extensions switch from senderKeyId > senderKeyUri etc.
  message = { ...message, senderKeyId: message.senderKeyUri, receiverKeyId: message.receiverKeyUri }
  console.log("sending wallet login to extension session...")
  console.log(message)
  try {
    await session.send(message);
  } catch (e) {
    console.log(e)
    throw e
  }


  return await new Promise((resolve, reject) => {
    session.listen(async sporranMessage => {
      console.log("extension session responded with message...")
      console.log(message)

      let sMessage = { ...sporranMessage, receiverKeyUri: sporranMessage.receiverKeyId, senderKeyUri: sporranMessage.senderKeyId }
      try {
        const loginResult = await fetch(`http://localhost:3030/api/v1/auth/kilt/wallet_login`, {
          method: 'POST',
          headers: { "Content-Type": 'application/json' },
          body: JSON.stringify({ sessionId, message: sMessage }),
        });
        const json = await loginResult.json()
        resolve(json)
      } catch (e) {
        reject(e)
      }
    });
  })
}