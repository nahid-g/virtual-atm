import React, { useEffect, useState } from 'react'
import { Button, StyleSheet, Text, TextInput, View } from 'react-native'
import Keypad from '../components/Keypad';
import LeftSide from '../components/LeftSide';
import RightSide from '../components/RightSide';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from "@env"
import axios from 'axios';
import Loader from '../components/Loader';

function Transaction({ navigation }) {
  const [text, setText] = useState("")
  const [hide, setHide] = useState(false)
  const [show, setShow] = useState(false)
  const [option, setOption] = useState("")
  const [loading, setLoading] = useState(false)

  const removeUser = async () => {
    await AsyncStorage.removeItem('userData')

  }

  const withdraw = async () => {
    let user = JSON.parse(await AsyncStorage.getItem('userData'))
    let atm = JSON.parse(await AsyncStorage.getItem('atmData'))
    // console.log(atm, user)
    setHide(true)
    await axios.post(`${BASE_URL}/withdrawal`, { "atm_uid": user.atm_uid, "atm_number": atm.atm_number, "amount": text })
      .then((res) => {
        console.log(res.data)
        if (res.data["39"] === "00") {
          setShow(true)
          setText('')
        }
      })
  }

  useEffect(() => {
    console.log(option)
    if (option == 'submit') {
      //submission
      !hide && withdraw()
      setLoading(true)

    } else if (option == 'exit') {
      setText("")
      setOption("")
      removeUser()
      navigation.navigate("HomePage")
    }
  }, [option])

  useEffect(() => {

  }, [show])

  return (
    <View style={{ flex: 1, marginTop: 30 }}>
      <View elevation={5} style={styles.container}>
        <View style={{ flex: 2.5, marginRight: 20 }} >
          <LeftSide />
        </View>

        <View style={{ flex: 6, alignItems: 'center', borderWidth: 1, borderColor: 'black', marginLeft: 20, height: 300 }} >
          <View style={{ flex: 1 }}>
            <TextInput
              style={{ height: 40, borderBottomWidth: 1, borderBottomColor: 'grey', marginTop: 30, fontSize: 23 }}
              maxLength={8}
              placeholder=" Enter desired amount "
              onChangeText={newText => setText(newText)}
              defaultValue={text}
            />

          </View>
          {show &&
            <View style={{ flex: 1 }}>
              <Text style={{ color: 'green', fontWeight: '700', fontSize: 20 }}>Money is being dispensed. Thank you</Text>
            </View>
          }
          {loading &&
            <View style={{ flex: 1 }}>
              <Loader />
            </View>
          }
        </View>

        <View style={{ flex: 2, paddingLeft: 50 }} >
          <RightSide setOption={setOption} />
        </View>
      </View>
      <View style={{ flex: 2, width: '100%', alignItems: 'center' }}>

        <Keypad type={2} text={text} setText={setText} option={option} />

      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 3,
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    shadowColor: "black",
    shadowOpacity: 0.8,
    shadowRadius: 1,
    shadowOffset: {
      height: 1,
      width: 1
    }
  },
});


export default Transaction