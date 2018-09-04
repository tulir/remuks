import Expo from 'expo'
import Remuks from './Remuks'
import React from 'react'

if (process.env.NODE_ENV === 'development') {
	Expo.KeepAwake.activate();
}

Expo.registerRootComponent(Remuks);