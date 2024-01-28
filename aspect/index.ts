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

        const obj = this.parseStringArgs(args);
        // sys.aspect.transientStorage
        //     .get<string>("ToContract")
        //     .set<string>(obj.toString());
        const message = hexToUint8Array(obj[0]); // arbitrary length
        const keyNNonce = obj[1]; // must be a 44 bytes or 88 hex digits
        const key = hexToUint8Array(keyNNonce.slice(0, 32 * 2)); // 32 bytes or 64 hex digits
        const nonce = hexToUint8Array(keyNNonce.slice(32 * 2, (32 + 12) * 2)); // 12 bytes or 24 hex digits

        // sys.log("message: " + uint8ArrayToHex(message));
        // sys.log("key: " + uint8ArrayToHex(key));
        // sys.log("nonce: " + uint8ArrayToHex(nonce));

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
            sys.revert("Invalid method signature");
        }
    }

    parseStringArgs(args: string): string[] {
        let result: string[] = [];
        args = args.slice(64); // remove the aspectId from args

        // 2 times for 2 string args
        for (let i = 0; i < 2; i++) {
            // slice the offset then convert to int form hex, then take into account the no. of hex digits i.e. bytes * 2. Last adjust for 1st arg of aspectId
            let offset = (parseInt(args.slice(i * 64, (i + 1) * 64), 16) * 2 -
                64) as i32;
            // take in the size -> convert to int from hex
            let size = parseInt(args.slice(offset, offset + 64), 16) as i32;

            let words = (Math.floor(size / 32) + 1) as i32; // no. of words to scan
            let raw = args.slice(offset + 64, offset + 64 + words * 64); // scan the whole string
            // console.log(offset, size, words, hexToString(raw));

            result.push(this.hexToString(raw)); // push to array while converting to ascii from hex
        }

        return result;
    }

    hexToString(hex: string): string {
        let str = "";
        for (let i = 0; i < hex.length; i += 2) {
            let tmp = String.fromCharCode(
                parseInt(hex.slice(i, i + 2), 16) as i32
            );
            if (tmp === "\0") break;
            str += tmp;
        }
        return str;
    }
}

// 2.register aspect Instance
const aspect = new EncryptionAspect();
entryPoint.setAspect(aspect);

// 3.must export it
export { allocate, execute };
