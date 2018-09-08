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

/**
 * Base Matrix info store backed by React Native AsyncStorage.
 */
export default class RemuksStore {
    hsURL: string
    isURL: string
    userID: string
    accessToken: string
    deviceID: string

    constructor() {
        this._load().then(() => console.log("Base store loaded"))
    }

    async _load(): Promise<void> {
        const data = await AsyncStorage.multiGet(["hs_url", "is_url", "user_id",
                                                  "access_token","device_id"])
        const map: Map = new Map(data)
        this.hsURL = map.get("hs_url")
        this.isURL = map.get("is_url")
        this.userID = map.get("user_id")
        this.accessToken = map.get("access_token")
        this.deviceID = map.get("device_id")
    }

    async _save(): Promise<void> {
        await AsyncStorage.multiSet(Object.entries(this))
    }
}

