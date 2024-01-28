import {
    IPreContractCallJP,
    PreContractCallInput,
    allocate,
    entryPoint,
    ethereum,
    execute,
    hexToUint8Array,
    sys,
    uint8ArrayToHex,
} from "@artela/aspect-libs";
import { ChaCha20 } from "./ChaCha20";

class EncryptionAspect implements IPreContractCallJP {
    encryptMethodSig: string = "451c067f";
    decryptMethodSig: string = "3f53ef0f";

    isOwner(_sender: Uint8Array): boolean {
        return true;
    }

    preContractCall(input: PreContractCallInput): void {
        sys.log("preContractCall");
        const parentCallMethod = ethereum.parseMethodSig(input.call!.data);
        const inputData = uint8ArrayToHex(input.call!.data);
        const args = inputData.slice(8); // Assuming the first argument is a string

        sys.log("parentCallMethod: " + parentCallMethod);
        sys.log("inputData: " + inputData);

        const obj = this.parseStringArgs(args);
        const message = hexToUint8Array(obj[0]); // arbitrary length
        const keyNNonce = obj[1]; // must be a 44 bytes or 88 hex digits
        const key = hexToUint8Array(keyNNonce.slice(0, 32 * 2)); // 32 bytes or 64 hex digits
        const nonce = hexToUint8Array(keyNNonce.slice(32 * 2, (32 + 12) * 2)); // 12 bytes or 24 hex digits

        sys.log("message: " + uint8ArrayToHex(message));
        sys.log("key: " + uint8ArrayToHex(key));
        sys.log("nonce: " + uint8ArrayToHex(nonce));

        if (parentCallMethod === this.encryptMethodSig) {
            const encryptor = new ChaCha20(key, nonce, 0);
            const encrypted = uint8ArrayToHex(encryptor.encrypt(message));

            sys.aspect.transientStorage
                .get<string>("ToContract")
                .set<string>(encrypted);
        } else if (parentCallMethod === this.decryptMethodSig) {
            const decryptor = new ChaCha20(key, nonce, 0);
            const decrypted = uint8ArrayToHex(decryptor.decrypt(message));

            sys.aspect.transientStorage
                .get<string>("ToContract")
                .set<string>(decrypted);
        } else {
            sys.aspect.transientStorage
                .get<string>("ToContract")
                .set<string>("Invalid method signature");
        }
    }

    parseStringArgs(args: string): string[] {
        let result: string[] = [];
        for (let i = 0; i < 2; i++) {
            let pos = (parseInt(args.slice(i * 64, (i + 1) * 64), 16) *
                2) as i32;
            let size = parseInt(args.slice(pos, pos + 64)) as i32;
            let str = "";

            let raw = args.slice(
                pos + 64,
                pos + 64 + (Math.ceil(size / 32) as i32) * 64
            );
            for (let j = 0; j < raw.length; j += 2) {
                let tmp = String.fromCharCode(
                    parseInt(raw.slice(j, j + 2), 16) as i32
                );
                if (tmp === "\0") break;
                str += tmp;
            }
            result.push(str);
        }
        return result;
    }
}

// 2.register aspect Instance
const aspect = new EncryptionAspect();
entryPoint.setAspect(aspect);

// 3.must export it
export { allocate, execute };
