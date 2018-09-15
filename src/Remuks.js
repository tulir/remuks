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

import React, { Component } from "react"

import Login from "./Login"
import Home from "./Home"
import { View } from "react-native"
import { SkypeIndicator } from "react-native-indicators"
import RemuksClient from "./mxclient"

type Props = {

}

type State = {
    authChecked: boolean,
    clients: RemuksClient[],
}

export default class Remuks extends Component<Props, State> {
    constructor(props) {
        super(props)

        this.state = {
            authChecked: false,
            clients: [],
        }
    }

    async componentDidMount() {
        this.setState({
            clients: await RemuksClient.getAll(),
            authChecked: true,
        })
    }

    login(client: RemuksClient) {
        if (!client.hasAccessToken()) {
            throw new Error("Client does not have access token.")
        }
        this.setState({
            clients: this.state.clients.concat(client),
        })
    }
    
    render() {
        if (!this.state.authChecked) {
            return <View style={{ flex: 1 }}>
                <SkypeIndicator color="#2196F3" size={64}/>
            </View>
        }
        if (this.state.clients.length === 0) {
            return <Login remuks={this}/>
        }

        return <Home remuks={this}/>
    }
}
