import React, { useState } from 'react'
import { Button, View } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';

function LeftSide({type, setType, active}) {
  const [hide, setHide] = useState(false)

  return (
    <View style={{flex: 1, flexDirection: 'column', justifyContent:'space-around'}}>
      <Button
            disabled={!active}
            title="General Transaction"
            onPress={async () => {
              active && setType("general")
            }}
            color={type === 'general' ? "": "black" }
          />
          <Button
            disabled={!active}
            title="Delegated Transaction"
            onPress={async () => {
              active && setType("delegated")
            }}
            color={type === 'delegated' ? "": "black" }
          />
    </View>
  )
}

export default LeftSide