// Remuks - A React Native Matrix client
// Copyright (C) 2018 Tulir Asokan
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

// @flow

import Matrix from "matrix-js-sdk"
import { MatrixClient } from "matrix-js-sdk"
import { RemuksCacheStore, RemuksCryptoStore, RemuksStore } from "./store"

export default class RemuksClient {
    client: MatrixClient
    store: RemuksStore
    cacheStore: RemuksCacheStore
    cryptoStore: RemuksCryptoStore

    constructor() {
        this.cacheStore = new RemuksCacheStore()
        this.cryptoStore = new RemuksCryptoStore()
        this.store = new RemuksStore()
    }

    async loadStores() {
        await Promise.all([this.store.load(), this.cacheStore.load()])
    }

    createTempClient(url: string): MatrixClient {
        return Matrix.createClient({
            baseUrl: url,
        })
    }

    createClient() {
        this.client = Matrix.createClient({
            store: this.cacheStore,
            cryptoStore: this.cryptoStore,

            baseUrl: this.store.hsURL,
            idBaseUrl: this.store.isURL,
            accessToken: this.store.accessToken,
            userId: this.store.userID,
            deviceId: this.store.deviceID,
        })
    }

    async startClient() {
        try {
            await this.client.initCrypto()
        } catch (err) {
            console.log("Unable to initialize e2ee:", err)
        }
        this.client.startClient()
    }
}
