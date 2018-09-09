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

const E2E_PREFIX = "crypto"
const KEY_ACCOUNT = `${E2E_PREFIX}.account`
const KEY_DEVICE_DATA = `${E2E_PREFIX}.device_data`
const KEY_SESSION_PREFIX = `${E2E_PREFIX}.sessions`
const KEY_INBOUND_SESSION_PREFIX = `${E2E_PREFIX}.inbound_group_sessions`
const KEY_ROOMS_PREFIX = `${E2E_PREFIX}.rooms`

/**
 * Matrix crypto store backed by React Native AsyncStorage.
 */
export default class RemuksCryptoStore {
    sessionID: string
    _keySessionPrefix: string
    _keyAccount: string
    _keyInboundSessionPrefix: string
    _keyRoomsPrefix: string
    _keyDeviceData: string

    constructor(sessionID: string) {
        this.sessionID = sessionID

        this._keyAccount = `${this.sessionID}/${KEY_ACCOUNT}`
        this._keyDeviceData = `${this.sessionID}/${KEY_DEVICE_DATA}`
        this._keyRoomsPrefix = `${this.sessionID}/${KEY_ROOMS_PREFIX}/`
        this._keySessionPrefix = `${this.sessionID}/${KEY_SESSION_PREFIX}/`
        this._keyInboundSessionPrefix = `${this.sessionID}/${KEY_INBOUND_SESSION_PREFIX}/`
    }

    _keyEndToEndSessions(deviceKey: string): string {
        return `${this._keySessionPrefix}${deviceKey}`
    }

    _keyEndToEndInboundGroupSession(senderKey: string, sessionID: string): string {
        return `${this._keyInboundSessionPrefix}${senderKey}/${sessionID}`
    }

    _keyEndToEndRoomsPrefix(roomID: string): string {
        return `${this._keyRoomsPrefix}${roomID}`
    }

    async delete(): Promise<void> {
        const keysToDelete = [this._keyDeviceData, this._keyAccount]
        for (const key of await AsyncStorage.getAllKeys()) {
            if (key.startsWith(this._keyRoomsPrefix)
                || key.startsWith(this._keyInboundSessionPrefix)
                || key.startsWith(this._keySessionPrefix)) {
                keysToDelete.push(key)
            }
        }
        await AsyncStorage.multiRemove(keysToDelete)
    }

    // region Sessions

    async countEndToEndSessions(txn: any, func: (count: number) => void): void {
        let count = 0
        for (const key of await AsyncStorage.getAllKeys()) {
            if (key.startsWith(this._keySessionPrefix)) {
                count++
            }
        }
        func(count)
    }

    _getEndToEndSessions(deviceKey: string): Promise<{}> {
        return getJSONItem(this._keyEndToEndSessions(deviceKey))
    }

    async getEndToEndSession(deviceKey: string, sessionID: string, txn: any,
                             func: (session: any) => void): Promise<void> {
        const sessions = await this._getEndToEndSessions(deviceKey)
        func(sessions[sessionID] || {})
    }

    async getEndToEndSessions(deviceKey: string, txn: string,
                              func: (sessions: {}) => void): Promise<void> {
        func((await this._getEndToEndSessions(deviceKey)) || {})
    }

    async storeEndToEndSession(deviceKey: string, sessionID: string, session: {}): Promise<void> {
        const sessions = (await this._getEndToEndSessions(deviceKey)) || {}
        sessions[sessionID] = session
        await setJSONItem(this._keyEndToEndSessions(deviceKey), sessions)
    }

    // endregion
    // region Inbound Group Sessions

    async getEndToEndInboundGroupSession(senderCurve25519Key: string, sessionID: string, txn: any,
                                         func: (session: {}) => void): Promise<void> {
        func(await getJSONItem(this._keyEndToEndInboundGroupSession(senderCurve25519Key,
                                                                    sessionID)))
    }

    async getAllEndToEndInboundGroupSessions(txn: any,
                                             func: (session: ?{}) => void): Promise<void> {
        for (const key of await AsyncStorage.getAllKeys()) {
            if (key.startsWith(this._keyInboundSessionPrefix)) {
                // we can't use split, as the components we are trying to split out
                // might themselves contain '/' characters. We rely on the
                // senderKey being a (32-byte) curve25519 key, base64-encoded
                // (hence 43 characters long).

                func({
                    senderKey: key.substr(this._keyInboundSessionPrefix.length, 43),
                    sessionID: key.substr(this._keyInboundSessionPrefix.length + 44),
                    sessionData: await getJSONItem(key),
                })
            }
        }
        func(null)
    }

    async addEndToEndInboundGroupSession(senderCurve25519Key: string, sessionID: string,
                                         sessionData: {}): Promise<void> {
        const existing = await getJSONItem(this._keyEndToEndInboundGroupSession(senderCurve25519Key,
                                                                                sessionID))
        if (!existing) {
            await this.storeEndToEndInboundGroupSession(senderCurve25519Key, sessionID, sessionData)
        }
    }

    storeEndToEndInboundGroupSession(senderCurve25519Key: string, sessionID: string,
                                     sessionData: {}): Promise<void> {
        return setJSONItem(this._keyEndToEndInboundGroupSession(senderCurve25519Key, sessionID),
                           sessionData)
    }

    // endregion
    // region Device data

    async getEndToEndDeviceData(txn: any, func: (data: any) => void): Promise<void> {
        func(await getJSONItem(this._keyDeviceData))
    }

    storeEndToEndDeviceData(deviceData: any): Promise<void> {
        return setJSONItem(this._keyDeviceData, deviceData)
    }

    // endregion
    // region Room data

    storeEndToEndRoom(roomID: string, roomInfo: {}): Promise<void> {
        return setJSONItem(this._keyEndToEndRoomsPrefix(roomID), roomInfo)
    }

    async getEndToEndRooms(txn: any, func: (result: {}) => void): Promise<void> {
        const result = {}
        const prefix = this._keyEndToEndRoomsPrefix("")

        for (const key of await AsyncStorage.getAllKeys()) {
            if (key.startsWith(prefix)) {
                const roomID = key.substr(prefix.length)
                result[roomID] = await getJSONItem(key)
            }
        }
        func(result)
    }

    // endregion
    // region Olm account

    async getAccount(txn: any, func: (account: any) => void): Promise<void> {
        func(await getJSONItem(this._keyAccount))
    }

    storeAccount(txn: any, newData: any): Promise<void> {
        return setJSONItem(this._keyAccount, newData)
    }

    // endregion
    // region Other stuff

    deleteAllData(): Promise<void> {
        return AsyncStorage.removeItem(this._keyAccount)
    }

    async doTxn<T>(mode: any, stores: any, func: (param: any) => T): Promise<T> {
        return func(null)
    }

    // endregion
}

// region JSON storage access

async function getJSONItem(key: string, defaultValue: any = null): Promise<any> {
    try {
        return JSON.parse(await AsyncStorage.getItem(key))
    } catch (_) {
        return defaultValue
    }
}

function setJSONItem(key: string, value: any): Promise<void> {
    return AsyncStorage.setItem(key, JSON.stringify(value))
}

// endregion
