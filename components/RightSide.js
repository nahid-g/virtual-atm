import React, { useEffect, useState } from 'react'
import { Button, View } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';

function RightSide({screen,setOption}) {
    const [click, setClick] = useState(false)

    useEffect(() => {
      
    }, [click])
    
    
  return (
    <View style={{flex: 1, flexDirection: 'column',justifyContent:'space-around',  width: 130, marginTop: 25, marginBottom:25}}>
        <Button
            title="Up"
            onPress={() => {
              setOption("up")
              setClick(!click)
            }}
            color="#06a7c7"
          />
          <Button
            title="Down"
            onPress={() => {
              setOption("down")
              setClick(!click)
            }}
            color="#06a7c7"
          />
          <Button
            title="Submit"
            onPress={() => {
              setOption("submit")
              console.log('clicked')
              setClick(!click)
            }}
            color="#036b1f"
          />
          <Button
            title={screen === "transaction" ? "Back" : "Exit"}
            onPress={() => {
              setOption("exit")
              setClick(!click)
            }}
            color="#bd471c"
          />
    </View>
  )
}

export default RightSide