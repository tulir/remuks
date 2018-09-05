import React, { Component } from "react"
import { StyleSheet, Text, View } from "react-native"
import Login from "./Login"

export default class Remuks extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Login/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
})
