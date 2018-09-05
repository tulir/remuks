// @flow

import { Room, Group, User, Filter } from "matrix-js-sdk"

/**
 * Matrix data store backed by React Native AsyncStorage.
 */
export default class MatrixRNAsyncStore {
    rooms: { [roomID: string]: Room }
    groups: { [groupID: string]: Group }
    users: { [userID: string]: User }
    syncToken: string
    filters: {
        [userID: string]: {
            [filterID: string]: Filter
        }
    }
    accountData: {
        [type: string]: any
    }

    constructor() {
        this.rooms = {}
        this.groups = {}
        this.users = {}
        this.syncToken = ""
        this.filters = {}
        this.accountData = {}
    }

    initLoadAsync() {

    }
}