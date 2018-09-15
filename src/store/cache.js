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

import { MatrixInMemoryStore } from "matrix-js-sdk"
import { AsyncStorage } from "react-native"

const KEY_FILTER_IDS = "filter_ids"

/**
 * Matrix cache store backed by React Native AsyncStorage.
 */
export default class RemuksCacheStore extends MatrixInMemoryStore {
    sessionID: string
    filterIDs: { [name: string]: string }

    _keyFilterIDs: string

    constructor(sessionID: string) {
        super(undefined)
        this.sessionID = sessionID
        this.filterIDs = {}
        this._keyFilterIDs = `${this.sessionID}/${KEY_FILTER_IDS}`
    }
    
    getFilterIdByName(name: string): ?string {
        return this.filters[name] || null
    }

    setFilterIdByName(name: string, id: string): void {
        this.filters[name] = id
        this.save().then(() => console.log("Filter IDs saved"))
    }

    async load(): Promise<void> {
        this.filterIDs = JSON.parse((await AsyncStorage.getItem(this._keyFilterIDs)) || "{}")
    }

    async save(): Promise<void> {
        await AsyncStorage.setItem(this._keyFilterIDs, JSON.stringify(this.filterIDs))
    }

    async delete(): Promise<void> {
        await AsyncStorage.removeItem(this._keyFilterIDs)
    }
}

