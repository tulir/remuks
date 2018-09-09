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

import { AsyncStorage } from "react-native"
import makeUUID from "uuid/v4"
import Matrix from "matrix-js-sdk"
import { type MatrixClient } from "matrix-js-sdk"
import { RemuksCacheStore, RemuksCryptoStore, RemuksStore } from "./store"

const KEY_EXISTS = "session_exists/"

export default class RemuksClient {
    sessionID: string
    client: MatrixClient
    store: RemuksStore
    cacheStore: RemuksCacheStore
    cryptoStore: RemuksCryptoStore

    constructor(sessionID: string) {
        this.sessionID = sessionID || makeUUID()
        this._keyExists = `${KEY_EXISTS}${this.sessionID}`
    }

    static async getAll(): RemuksClient[] {
        const ids: string[] = await this.listIDs()
        const clients: RemuksClient[] = []
        for (const id of ids) {
            const client = new RemuksClient(id)
            await client.init()
            if (!client.store.isAuthenticated()) {
                await client.delete()
            } else {
                clients.push(client)
            }
        }
        return clients
    }

    static async listIDs(): string[] {
        const list = []
        for (const id of await AsyncStorage.getAllKeys()) {
            if (id.startsWith(KEY_EXISTS)) {
                list.push(id.substr(KEY_EXISTS.length))
            }
        }
        return list
    }

    async init(): Promise<void> {
        await AsyncStorage.setItem(this._keyExists, "true")
        this.cacheStore = new RemuksCacheStore(this.sessionID)
        this.cryptoStore = new RemuksCryptoStore(this.sessionID)
        this.store = new RemuksStore(this.sessionID)
        await Promise.all([this.store.load(), this.cacheStore.load()])
    }

    async delete(): Promise<void> {
        await AsyncStorage.removeItem(this._keyExists)
        await this.cryptoStore.delete()
        await this.store.delete()
        await this.cacheStore.delete()
    }

    createTempClient(url: string): MatrixClient {
        return Matrix.createClient({
            baseUrl: url,
        })
    }

    createClient(): void {
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

    async startClient(): Promise<void> {
        try {
            await this.client.initCrypto()
        } catch (err) {
            console.log("Unable to initialize e2ee:", err)
        }
        this.client.startClient()
    }
}
