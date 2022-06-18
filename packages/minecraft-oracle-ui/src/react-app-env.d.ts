/// <reference types="react-scripts" />

declare module 'jazzicon' {
  export default function (diameter: number, seed: number): HTMLElement;
}

declare module 'toformat';

interface RequestArguments {
  method: string;
  params?: unknown[] | object;
}
interface Window {
  ethereum?: {
    isMetaMask?: true;
    on?: (...args: any[]) => void;
    removeListener?: (...args: any[]) => void;
    autoRefreshOnNetworkChange?: boolean;
    request: (args: RequestArguments) => Promise<unknown>
  };
  web3?: {};
  kilt: GlobalKilt; //window.kilt = {} is in index.html, which to be declared early to show extensions (sporran) website supports kilt
  grecaptcha: ReCaptchaV2.ReCaptcha & { enterprise: ReCaptchaV2.ReCaptcha; };
}

//KILT
//from: https://github.com/KILTprotocol/credential-api
interface GlobalKilt {
  /** `extensionId` references the extension on the `GlobalKilt` object but is not used by the dApp */
  [extensionId: string]: InjectedWindowProvider
}

interface InjectedWindowProvider {
  startSession: (
    /** human-readable name of the dApp */
    dAppName: string,

    /** ID of the key agreement key of the dApp DID to be used to encrypt the session messages */
    dAppEncryptionKeyId: string,

    /** 24 random bytes as hexadecimal */
    challenge: string
  ) => Promise<PubSubSession>

  /** human-readable name of the extension */
  name: string

  /** version of the extension */
  version: string

  /** MUST equal the version of this specification the extension adheres to */
  specVersion: '1.0'
}

interface PubSubSession {
  /** Configure the callback the extension must use to send messages to the dApp. Overrides previous values. */
  listen: (callback: EncryptedMessageCallback) => Promise<void>

  /** send the encrypted message to the extension */
  send: EncryptedMessageCallback

  /** close the session and stop receiving further messages */
  close: () => Promise<void>

  /** ID of the key agreement key of the temporary DID the extension will use to encrypt the session messages */
  encryptionKeyId: string

  /** bytes as hexadecimal */
  encryptedChallenge: string

  /** 24 bytes nonce as hexadecimal */
  nonce: string
}

interface EncryptedMessageCallback {
  (message: EncryptedMessage): Promise<void>
}

interface EncryptedMessage {
  /** DID key ID of the receiver */
  receiverKeyId: string

  /** DID key ID of the sender */
  senderKeyId: string

  /** ciphertext as hexadecimal */
  ciphertext: string

  /** 24 bytes nonce as hexadecimal */
  nonce: string
}


