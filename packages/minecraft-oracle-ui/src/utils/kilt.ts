export async function getKilExtension(): Promise<InjectedWindowProvider> {
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
  const values = await fetch(`http://localhost:3030/api/v1/auth/kilt/wallet_session`);
  const parsedValues = await values.json()

  console.log(JSON.stringify(parsedValues))
  const {
    sessionId,
    walletSessionChallenge,
    dappName,
    dAppEncryptionKeyId,
  } = parsedValues;

  //extension signs challenge and sends back to server
  console.log(`dappName: ${dappName} dAppEncryptionKeyId: ${dAppEncryptionKeyId} walletSessionChallenge: ${walletSessionChallenge}`
  )
  //sporran expects to load didConfiguration.json from root directory of host localhost:3000/didConfiguration.json, it will error out if it's not there
  let session: PubSubSession
  try {
    session = await extension.startSession(dappName, dAppEncryptionKeyId, walletSessionChallenge);

  } catch (e: any) {
    const errStr = e.toString()
    if (errStr.includes("Request failed with status code 404 Not Found")) {
      throw new Error("Sporran could likely not find didConfiguration.json")
    } else {
      throw e
    }

  }

  const newSess: any = { ...session }
  newSess.encryptedWalletSessionChallenge = newSess.encryptedChallenge
  delete newSess.encryptedChallenge
  await fetch(`http://localhost:3030/api/v1/auth/kilt/wallet_session`, {
    method: 'POST',
    headers: { "Content-Type": 'application/json' },
    body: JSON.stringify({ ...newSess, sessionId }),
  });

  const result = await fetch(`http://localhost:3030/api/v1/auth/kilt/wallet_login?sessionId=${sessionId}`);
  const message = await result.json();
  await session.send(message);


  await new Promise<void>((resolve, reject) => {
    session.listen(async message => {
      try {
        const loginResult = await fetch(`http://localhost:3030/api/v1/auth/kilt/wallet_login`, {
          method: 'POST',
          headers: { "Content-Type": 'application/json' },
          body: JSON.stringify({ sessionId, message }),
        });
        resolve()
      } catch (e) {
        reject(e)
      }
    });
  })
}