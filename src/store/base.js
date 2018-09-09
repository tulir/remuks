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

const KEY_HS_URL = "hs_url"
const KEY_IS_URL = "is_url"
const KEY_USER_ID = "user_id"
const KEY_DEVICE_ID = "device_id"
const KEY_ACCESS_TOKEN = "access_token"

interface LoginResponse {
    user_id: string,
    device_id: string,
    access_token: string,
}

/**
 * Base Matrix info store backed by React Native AsyncStorage.
 */
export default class RemuksStore {
    sessionID: string
    hsURL: string
    isURL: string
    userID: string
    deviceID: string
    accessToken: string

    _keyHSURL: string
    _keyISURL: string
    _keyUserID: string
    _keyAccessToken: string
    _keyDeviceID: string

    constructor(sessionID: string) {
        this.sessionID = sessionID

        this._keyHSURL = `${this.sessionID}/${KEY_HS_URL}`
        this._keyISURL = `${this.sessionID}/${KEY_IS_URL}`
        this._keyUserID = `${this.sessionID}/${KEY_USER_ID}`
        this._keyDeviceID = `${this.sessionID}/${KEY_DEVICE_ID}`
        this._keyAccessToken = `${this.sessionID}/${KEY_ACCESS_TOKEN}`
    }

    copyFrom(creds: LoginResponse) {
        this.userID = creds.user_id
        this.deviceID = creds.device_id
        this.accessToken = creds.access_token
    }

    isAuthenticated(): boolean {
        return this.hsURL.length > 0 && this.userID.length > 0 && this.accessToken.length > 0
    }

    async load(): Promise<void> {
        const data = await AsyncStorage.multiGet([this._keyHSURL, this._keyISURL, this._keyUserID,
                                                  this._keyDeviceID, this._keyAccessToken])
        const map: Map = new Map(data)
        this.hsURL = map.get(this._keyHSURL)
        this.isURL = map.get(this._keyISURL)
        this.userID = map.get(this._keyUserID)
        this.deviceID = map.get(this._keyDeviceID)
        this.accessToken = map.get(this._keyAccessToken)
    }

    async save(): Promise<void> {
        await AsyncStorage.multiSet([
            [this._keyHSURL, this.hsURL],
            [this._keyISURL, this.isURL],
            [this._keyUserID, this.userID],
            [this._keyDeviceID, this.deviceID],
            [this._keyAccessToken, this.accessToken],
        ])
    }

    async delete(): Promise<void> {
        await AsyncStorage.multiRemove([this._keyHSURL, this._keyISURL, this._keyUserID,
                                        this._keyDeviceID, this._keyAccessToken])
    }
}

