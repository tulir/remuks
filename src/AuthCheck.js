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
import Spinner from "react-native-loading-spinner-overlay"
import { type NavigationScreenProp } from "react-navigation"

type Props = {
    navigation: NavigationScreenProp<*>,
}

export default class AuthCheck extends Component<Props> {
    async componentDidMount() {

        setTimeout(() => {
            this.props.navigation.navigate("AuthStack")
        }, 2000)
    }

    render() {
        return <Spinner visible={true} overlayColor="transparent" color="#2196F3" animation="fade"/>
    }
}
