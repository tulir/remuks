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

/**
 * Matrix cache store backed by React Native AsyncStorage.
 */
export default class RemuksCacheStore extends MatrixInMemoryStore {
    filterIDs: { [name: string]: string }

    constructor() {
        super(undefined)
        this.filterIDs = {}
    }

    getFilterIdByName(name: string): ?string {
        return this.filters[name] || null
    }

    setFilterIdByName(name: string, id: string) {
        this.filters[name] = id
        this._saveFilterIDs().then(() => console.log("Filter IDs saved"))
    }

    async load() {
        await this._loadFilterIDs()
    }

    async save() {
        await this._saveFilterIDs()
    }

    async _saveFilterIDs() {
        await AsyncStorage.setItem("filters_ids", JSON.stringify(this.filterIDs))
    }

    async _loadFilterIDs() {
        this.filterIDs = JSON.parse((await AsyncStorage.getItem("filter_ids")) || "{}")
    }
}

