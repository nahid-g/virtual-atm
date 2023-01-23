import React, { useEffect, useState } from 'react'
import { Button, StyleSheet, Text, TextInput, View } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import LeftSide from '../components/LeftSide';
import RightSide from '../components/RightSide';
import Keypad from '../components/Keypad';
import { BASE_URL } from "@env"
import axios from 'axios';
import Loader from '../components/Loader';

function HomeScreen({ navigation }) {

  const [text, setText] = useState("")
  const [option, setOption] = useState("")
  const [type, setType] = useState("")
  // const [edit, setEdit] = useState(false)
  const [data, setData] = useState()
  const [status, setStatus] = useState("")



  const register = () => {
    console.log(AsyncStorage.getAllKeys())
    axios.post(`${BASE_URL}/register-atm`, {})
      .then(async (rs) => {
        console.log(rs.data)
        await AsyncStorage.setItem('atmData', JSON.stringify(rs.data))

      })
      .catch(e => {
        console.log("reg", e)
      })

  }

  useEffect(() => {
    register()
  }, [])

  useEffect(() => {

    console.log(type)
    if (type == 'general') {

    } else if (type == 'delegated') {

    }
  }, [type])

  const checkConnection = async (data) => {
    console.log(data)
    await axios.post(`${BASE_URL}/proof-state/${data.presentation_exchange_id}`, {})
      .then((res) => {
        // console.log(res.data)
        res.data.state && setStatus(res.data.state)
      }).catch(e => console.log("con", e))
  }


  //submit handler
  const checkCred = async () => {

    let atm = JSON.parse(await AsyncStorage.getItem('atmData'))
    console.log("he he", atm.atm_number, text)

    if (type === "general") {

      await axios.post(`${BASE_URL}/verify-user`, { "atm_uid": text, "atm_number": atm.atm_number })
        .then((rs) => {
          checkConnection(rs.data)
          setData(rs.data)
        })
        .catch(e => console.log("cred", e))

    } else if (type === "delegated") {
      await axios.post(`${BASE_URL}/verify-delegation`, { "delegation_uid": text, "atm_number": atm.atm_number })
        .then((rs) => {
          checkConnection(rs.data)
          setData(rs.data)

        })
        .catch(e => console.log("cred", e))
    }


  }

  useEffect(() => {
    console.log(option)
    if (option == 'submit') {
      //submission
      // navigation.navigate('Options')
      checkCred()
      setText("")
      setOption("")
      // setType("")

    } else if (option == 'exit') {
      setText("")
      setOption("")
      setType("")
      setStatus("")
      setData(null)
      navigation.navigate("HomePage")

    }
  }, [option])

  const revoke = async () => {
    console.log("rev", data)
    axios.post(`${BASE_URL}/revoke`, { "connection_id": data.connection_id, "cred_ex_id": data.credential_exchange_id })
      .then((res) => {
        console.log(res)
        setType("")
      }).catch(e => console.log(e))
  }

  const setUser = async () => {
    await AsyncStorage.setItem('userData', JSON.stringify(data))
    setType("")
    setStatus("")
    setText("")
    setData(null)
    navigation.navigate("Options")
  }

  useEffect(() => {
    let timeruns = 0
    let interval = data && setInterval(() => {
      checkConnection(data)

      timeruns += 1
      if (timeruns >= 20) {
        setText("")
        setData(null)
        setStatus("")
        setType("")
        clearInterval(interval)
      }
      console.log(status)

    }, 2500)
    if (status === "verified") {
      setText("")
      console.log(type)

      type === "general" && setUser()

      type === "delegated" && revoke()
      clearInterval(interval)
    }
    return () => {
      clearInterval(interval)
    }
  }, [status])

  return (
    <View style={{ flex: 1, marginTop: 27 }}>
      <View elevation={1} style={styles.container}>
        <View style={{ flex: 2.5, marginRight: 20 }} >
          <LeftSide active={true} setType={setType} type={type} />
        </View>

        <View elevation={5} style={{
          flex: 6, alignItems: 'center', marginLeft: 20, height: 300, backgroundColor: 'white',
          shadowColor: "black",
          shadowOpacity: 0.8,
          shadowRadius: 1,
          shadowOffset: {
            height: 1,
            width: 1
          }
        }} >
          <View style={{ marginTop: 30, flex: 1 }}>
            <Text style={{ textAlignVertical: "center", textAlign: "center", fontSize: 30, color: "#4702f5" }}>Welcome to ATM</Text>
            <Text style={{ textAlignVertical: "center", textAlign: "center", fontSize: 15, color:"#6122d6" }}>Please establish connection first to continue transaction</Text>

          </View>
          {status.length <= 0 &&
            <View style={{ flex: 2 }}>
              <TextInput
                style={{ height: 40, borderBottomWidth: 1, borderBottomColor: 'grey', marginTop: 30, fontSize: 23 }}
                maxLength={8}
                placeholder=" Type the connection id "
                onChangeText={newText => setText(newText)}
                defaultValue={text}
                editable={type.length > 0 ? true : false}
                selectTextOnFocus={type.length > 0 ? true : false}
              // onFocus = {type.length >0 ? 'true': 'false'}
              />
            </View>}

          <View style={{ flex: 2 }}>
            {status === "verified" && type === "delegated" ? <Text style={{ color: 'green', fontWeight: '700', fontSize: 20 }}>Money is being dispensed. Thank you</Text> :
              <Text style={{ fontWeight: '700', fontSize: 20, paddingTop: 40 }}>Connection status : <Text style={{ color: 'green' }}>{status}</Text> </Text>}
          </View>
          {status === "request_sent" &&
            <View style={{ flex: 2, paddingBottom: 100 }}>
              <Loader />
              {/* <Text style={{ color: '#fa9837', fontWeight: '700', fontSize: 20 }}>Please response to proof request in your wallet...</Text> */}

            </View>
          }
        </View>

        <View style={{ flex: 2, paddingLeft: 50 }} >
          <RightSide setOption={setOption} />
        </View>
      </View>
      <View style={{ flex: 2, width: '100%', alignItems: 'center' }}>
        {/* <Button title='next' onPress={e => navigation.navigate("Options")} /> */}
        <Keypad type={type.length} text={text} setText={setText} option={option} />
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
    backgroundColor: '',
    shadowColor: "black",
    shadowOpacity: 0.8,
    shadowRadius: 1,
    shadowOffset: {
      height: 1,
      width: 1
    }
  },
});

export default HomeScreen 