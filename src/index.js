import Expo from "expo"
import Remuks from "./Remuks"

if (process.env.NODE_ENV === "development") {
    Expo.KeepAwake.activate()
}

Expo.registerRootComponent(Remuks)