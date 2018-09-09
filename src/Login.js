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
import { StyleSheet, Text, View, TextInput, TouchableHighlight, Image, Alert,
         Button } from "react-native"
import { type StackNavigator } from "react-navigation"
import RemuksClient from "./mxclient"

type State = {
    user: string,
    password: string,
    homeserver: string
}

type Props = {
    navigation: StackNavigator
}

export default class LoginView extends Component<Props, State> {
    static navigationOptions = {
        title: "Sign in to Remuks",
    }

    constructor(props: Props) {
        super(props)
        this.state = {
            user: "",
            password: "",
            homeserver: "",
        }
    }

    onClickListener = (viewId: string) => {
        Alert.alert("Alert", "Button pressed "+viewId)
    }

    login = async () => {
        const client = new RemuksClient()
        const mxclient = client.createTempClient(this.state.homeserver)
        let resp
        try {
            resp = await mxclient.loginWithPassword(this.state.user, this.state.password)
        } catch (err) {
            console.error(err)
            return
        }
        client.store.hsURL = this.state.homeserver
        client.store.isURL = "https://matrix.org"
        client.store.copyFrom(resp)
        await client.store.save()
        await client.init()
        this.props.navigation.navigate("Home")
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.inputContainer}>
                    <Image style={styles.inputIcon} source={{
                        uri: "https://png.icons8.com/ultraviolet/50/3498db/server.png",
                    }}/>
                    <TextInput style={styles.inputs}
                               placeholder="Homeserver"
                               keyboardType="url"
                               underlineColorAndroid="transparent"
                               onChangeText={(homeserver) => this.setState({ homeserver })}/>
                </View>

                <View style={styles.inputContainer}>
                    <Image style={styles.inputIcon} source={{
                        uri: "https://png.icons8.com/ultraviolet/50/3498db/message.png",
                    }}/>
                    <TextInput style={styles.inputs}
                               placeholder="User identifier"
                               keyboardType="email-address"
                               underlineColorAndroid="transparent"
                               onChangeText={(user) => this.setState({ user })}/>
                </View>

                <View style={styles.inputContainer}>
                    <Image style={styles.inputIcon}
                           source={{
                               uri: "https://png.icons8.com/ultraviolet/50/3498db/key-2.png",
                           }}/>
                    <TextInput style={styles.inputs}
                               placeholder="Password"
                               secureTextEntry={true}
                               underlineColorAndroid="transparent"
                               onChangeText={(password) => this.setState({ password })}/>
                </View>

                <Button style={[styles.buttonContainer, styles.loginButton]}
                        onPress={this.login} title="Login"/>

                <TouchableHighlight style={styles.buttonContainer}
                                    onPress={() => this.onClickListener("restore_password")}>
                    <Text>Forgot your password?</Text>
                </TouchableHighlight>

                <TouchableHighlight style={styles.buttonContainer}
                                    onPress={() => this.onClickListener("register")}>
                    <Text>Register</Text>
                </TouchableHighlight>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        backgroundColor: "#EFEFEF",
    },
    inputContainer: {
        borderBottomColor: "#F5FCFF",
        backgroundColor: "#FFFFFF",
        borderRadius: 30,
        borderBottomWidth: 1,
        width: 250,
        height: 45,
        marginBottom: 20,
        flexDirection: "row",
        alignItems:"center",
    },
    inputs:{
        height: 45,
        marginLeft: 16,
        borderBottomColor: "#FFFFFF",
        flex: 1,
    },
    inputIcon:{
        width: 30,
        height: 30,
        marginLeft: 15,
        justifyContent: "center",
    },
    buttonContainer: {
        height: 45,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
        width: 250,
        borderRadius: 30,
    },
    loginButton: {
        backgroundColor: "#00b5ec",
    },
})
