export class ChaCha20 {
    private _rounds: u8;
    private _sigma: u8[];
    private _param: u8[] = [];
    private _keystream: u8[] = [];
    private _byteCounter: u8;

    constructor(key: Uint8Array, nonce: Uint8Array, counter: u8) {
        if (key.length !== 32) {
            throw new Error("Key should be 32 byte array!");
        }

        if (nonce.length !== 12) {
            throw new Error("Nonce should be 12 byte array!");
        }

        this._rounds = 20;
        // Constants
        this._sigma = [
            0x61707865 as u8,
            0x3320646e as u8,
            0x79622d32 as u8,
            0x6b206574 as u8,
        ];

        // param construction
        this._param = [
            this._sigma[0],
            this._sigma[1],
            this._sigma[2],
            this._sigma[3],
            // key
            this._get32(key, 0),
            this._get32(key, 4),
            this._get32(key, 8),
            this._get32(key, 12),
            this._get32(key, 16),
            this._get32(key, 20),
            this._get32(key, 24),
            this._get32(key, 28),
            // counter
            counter,
            // nonce
            this._get32(nonce, 0),
            this._get32(nonce, 4),
            this._get32(nonce, 8),
        ];

        // init 64 byte keystream block //
        this._keystream = [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        ];

        // internal byte counter //
        this._byteCounter = 0;
    }

    _chacha(): void {
        let mix: u8[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        let i: u8 = 0;
        let b: u8 = 0;

        // copy param array to mix //
        for (let i: u8 = 0; i < 16; i++) {
            mix[i] = this._param[i];
        }

        // mix rounds //
        for (let i: u8 = 0; i < this._rounds; i += 2) {
            this._quarterround(mix, 0, 4, 8, 12);
            this._quarterround(mix, 1, 5, 9, 13);
            this._quarterround(mix, 2, 6, 10, 14);
            this._quarterround(mix, 3, 7, 11, 15);

            this._quarterround(mix, 0, 5, 10, 15);
            this._quarterround(mix, 1, 6, 11, 12);
            this._quarterround(mix, 2, 7, 8, 13);
            this._quarterround(mix, 3, 4, 9, 14);
        }

        for (i = 0; i < 16; i++) {
            // add
            mix[i] += this._param[i];

            // store keystream
            this._keystream[b++] = mix[i] & 0xff;
            this._keystream[b++] = (mix[i] >>> 8) & 0xff;
            this._keystream[b++] = (mix[i] >>> 16) & 0xff;
            this._keystream[b++] = (mix[i] >>> 24) & 0xff;
        }
    }

    /**
     * The basic operation of the ChaCha algorithm is the quarter round.
     * It operates on four 32-bit unsigned integers, denoted a, b, c, and d.
     *
     * @param {Array} output
     * @param {number} a
     * @param {number} b
     * @param {number} c
     * @param {number} d
     * @private
     */
    _quarterround(output: u8[], a: u8, b: u8, c: u8, d: u8): void {
        output[d] = this._rotl(output[d] ^ (output[a] += output[b]), 16);
        output[b] = this._rotl(output[b] ^ (output[c] += output[d]), 12);
        output[d] = this._rotl(output[d] ^ (output[a] += output[b]), 8);
        output[b] = this._rotl(output[b] ^ (output[c] += output[d]), 7);

        // JavaScript hack to make UINT32 :) //
        output[a] >>>= 0;
        output[b] >>>= 0;
        output[c] >>>= 0;
        output[d] >>>= 0;
    }

    /**
     * Little-endian to uint 32 bytes
     *
     * @param {Uint8Array|[number]} data
     * @param {number} index
     * @return {number}
     * @private
     */
    _get32(data: Uint8Array, index: u8): u8 {
        return (
            data[index++] ^
            (data[index++] << 8) ^
            (data[index++] << 16) ^
            (data[index] << 24)
        );
    }

    /**
     * Cyclic left rotation
     *
     * @param {number} data
     * @param {number} shift
     * @return {number}
     * @private
     */
    _rotl(data: u8, shift: u8): u8 {
        return (data << shift) | (data >>> (32 - shift));
    }

    /**
     *  Encrypt data with key and nonce
     *
     * @param {Uint8Array} data
     * @return {Uint8Array}
     */
    encrypt(data: Uint8Array): Uint8Array {
        return this._update(data);
    }

    /**
     *  Decrypt data with key and nonce
     *
     * @param {Uint8Array} data
     * @return {Uint8Array}
     */
    decrypt(data: Uint8Array): Uint8Array {
        return this._update(data);
    }

    /**
     *  Encrypt or Decrypt data with key and nonce
     *
     * @param {Uint8Array} data
     * @return {Uint8Array}
     * @private
     */
    _update(data: Uint8Array): Uint8Array {
        if (!(data instanceof Uint8Array) || data.length === 0) {
            throw new Error(
                "Data should be type of bytes (Uint8Array) and not empty!"
            );
        }

        var output = new Uint8Array(data.length);

        // core function, build block and xor with input data //
        for (var i = 0; i < data.length; i++) {
            if (this._byteCounter === 0 || this._byteCounter === 64) {
                // generate new block //

                this._chacha();
                // counter increment //
                this._param[12]++;

                // reset internal counter //
                this._byteCounter = 0;
            }

            output[i] = data[i] ^ this._keystream[this._byteCounter++];
        }

        return output;
    }
}
