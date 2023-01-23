import React, { useState } from 'react'
import { Button, View } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';

function RightSide({setOption}) {
    const [hide, setHide] = useState(false)
  return (
    <View style={{flex: 1, flexDirection: 'column',justifyContent:'space-around',  width: 130, marginTop: 25, marginBottom:25}}>
        <Button
            disabled={hide}

            title="Up"
            onPress={() => {
              setOption("up")
            }}
            color="black"
          />
          <Button
            disabled={hide}
            
            title="Down"
            onPress={() => {
              setOption("down")
            }}
            color="black"
          />
          <Button
            disabled={hide}

            title="Submit"
            onPress={() => {
              setOption("submit")
            }}
            color="black"
          />
          <Button
            disabled={hide}

            title="Exit"
            onPress={() => {
              setOption("exit")
            }}
            color="black"
          />
    </View>
  )
}

export default RightSide