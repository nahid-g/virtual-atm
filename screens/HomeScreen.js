import React, { useEffect, useState } from 'react'
import { Button, StyleSheet, Text, TextInput, View } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import LeftSide from '../components/LeftSide';
import RightSide from '../components/RightSide';
import Keypad from '../components/Keypad';
import axios from 'axios';
import Loader from '../components/Loader';
import CountDown from 'react-native-countdown-component';


function HomeScreen({ navigation }) {

  const [text, setText] = useState("")
  const [option, setOption] = useState("")
  const [type, setType] = useState("")
  const [active, setActive] = useState(true)
  const [data, setData] = useState()
  const [status, setStatus] = useState("")
  const [wrong, setWrong] = useState(false)
  const [revoked, setRevoked] = useState(false)
  const [clicked, setCicked] = useState(false)

  const register = () => {
    console.log(`${process.env['BASE_URL']}`)
    axios.post(`${process.env['BASE_URL']}/atm/register`, {})  
      .then(async (rs) => {
        await AsyncStorage.setItem('atmData', JSON.stringify(rs.data))
      })
      .catch(e => {
        console.log("reg", e)
      })

  }

  useEffect(() => {
    register()
    // navigation.navigate("Transaction")

  }, [])

  useEffect(() => {

    if (type.length > 0) {
      setWrong(false)
    } else {
      // setStatus("")
    }
  }, [type])

  const checkConnection = async (data) => {
    const atm = JSON.parse(await AsyncStorage.getItem('atmData'))

    await  axios.post(`${process.env['BASE_URL']}/vc/proof-state/${data.presentation_exchange_id}`, {  
      "atm_number": atm.atm_number,
      "key": atm.key, "privateKey": atm.privateKey, "bankPublicKey": atm.bankPublicKey
    })
      .then((res) => {
        console.log(res.data)
        res.data.state && setStatus(res.data.state)
      }).catch(e => {
        console.log("con", e)
        setRevoked(true)
        setWrong(true)
        setType("")
      })
  }



  //submit handler

  const checkCred = async () => {

    const atm = JSON.parse(await AsyncStorage.getItem('atmData')) 

    if (type === "general") {
      text.length > 0 && setCicked(true)
      await axios.post(`${process.env['BASE_URL']}/verify/user`, {   
        "atm_uid": text, "atm_number": atm.atm_number,
        "key": atm.key, "privateKey": atm.privateKey, "bankPublicKey": atm.bankPublicKey
      })
        .then((rs) => {
          checkConnection(rs.data)
          setData(rs.data)
        })
        .catch(e => {
          console.log("cred", e)
          setCicked(false)
          setWrong(true)
          setType("")
        })

    } else if (type === "delegated") {
      text.length > 0 && setCicked(true)
      await axios.post(`${process.env['BASE_URL']}/verify/delegation`, {   
        "delegation_uid": text, "atm_number": atm.atm_number,
        "key": atm.key, "privateKey": atm.privateKey, "bankPublicKey": atm.bankPublicKey
      })
        .then((rs) => {
          if (rs.data.result) {
            checkConnection(rs.data)
            setData(rs.data)
          }
          else {
            setCicked(false)
            setRevoked(true)
            setWrong(true)
            setType("")
          }
          console.log(rs.data)
        })
        .catch(e => {
          console.log("cred", e)
          setCicked(false)
          setWrong(true)
          setType("")
        })
    }


  }

  useEffect(() => {

    if (option == 'submit') {
      //submission

      checkCred()
      setText("")
      setOption("")

      // setType("")

    } else if (option == 'exit') {
      setText("")
      setOption("")
      setType("")
      setStatus("")
      setCicked(false)
      setData(null)
      setWrong(false)


    }
  }, [option])

  const revoke = async () => {
    console.log("revoke")
    const atm = JSON.parse(await AsyncStorage.getItem('atmData'))
    axios.post(`${process.env.BASE_URL}/vc/revoke`, {  
      "connection_id": data.connection_id, "cred_ex_id": data.credential_exchange_id,
      "atm_number": atm.atm_number, "key": atm.key, "privateKey": atm.privateKey, "bankPublicKey": atm.bankPublicKey
    })
      .then((res) => {
        console.log("revoked")
        setOption("")
        setType("")
        setData(null)
        setCicked(false)
        setWrong(false)
        setStatus("")
      }).catch(e => console.log(e))
  }

  const setUser = async () => {
    await AsyncStorage.setItem('userData', JSON.stringify(data))
    setType("")
    setData(null)
    setCicked(false)
    setWrong(false)
    setStatus("")
    navigation.navigate("Options")
  }


  useEffect(() => {
    let timeruns = 0
    let interval = data && setInterval(() => {
      console.log(data)
      timeruns += 1
      if (timeruns < 30) {
        checkConnection(data)
      } else {
        setData(null)
        setStatus("")
        setText("")
        setOption("")
        setType("")
      }
    }, 2500)

    if (status === "verified") {

      type === "general" && setUser()

      type === "delegated" && revoke()
      setText("")
      // setStatus("")
      clearInterval(interval)
    }
    console.log("sta", status)

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
          <View style={{ marginTop: 30, flex: 2 }}>
            <Text style={{ textAlignVertical: "center", textAlign: "center", fontSize: 30, color: "#16026e", marginBottom: 10 }}>Welcome to ATM</Text>
            {!type && <Text style={{ textAlignVertical: "center", textAlign: "center", fontSize: 18, color: "#6122d6", width: 400 }}>At first, choose Transaction Type from left. Then type using keypad</Text>}
            {type && (status.length <= 0) && <Text style={{ textAlignVertical: "center", textAlign: "center", fontSize: 18, color: "#6122d6" }}>Type your atm user id</Text>}
          </View>
          {(status.length <= 0) &&
            <View style={{ flex: 2 }}>
              <TextInput
                style={{ color: 'black', fontWeight: '400', height: 40, borderBottomWidth: 1, borderBottomColor: 'grey', marginTop: 30, fontSize: 23, textAlign: 'center' }}
                maxLength={8}
                placeholder=" Enter your atm uid "
                onChangeText={newText => setText(newText)}
                defaultValue={text}
                editable={false}
              />
            </View>}

          {(clicked || status === "request_sent" || status === "presentation_received") &&
            <View style={{ flex: 2, paddingBottom: 100 }}>
              <Loader />
              {status === "presentation_received" && <Text style={{ textAlign: 'center', color: 'green', fontWeight: '700', fontSize: 18, paddingBottom: 20 }}>Please wait. Verifying...</Text>}

            </View>
          }
          {!wrong ?
            <View style={{ flex: 2 }}>
              {(status === "verified" && type === "delegated") && <Text style={{ textAlign: 'center', color: 'green', fontWeight: '700', fontSize: 20 }}>Money is being dispensed. Thank you</Text>}

              {status === "request_sent" && <Text style={{ textAlign: 'center', color: 'green', fontWeight: '700', fontSize: 15 }}>Please share proof request through your wallet within 5 min</Text>}
            </View> :
            <View style={{ flex: 2 }}>
              {revoked ?
                <Text style={{ textAlign: 'center', color: '#a62f03', fontWeight: '500', fontSize: 20 }}>This credential has been revoked</Text>
                :
                <Text style={{ textAlign: 'center', color: '#a62f03', fontWeight: '500', fontSize: 20 }}>Something went wrong. Please try again</Text>
              }
            </View>
          }

        </View>

        <View style={{ flex: 2, paddingLeft: 50 }} >
          <RightSide screen="homepage" setOption={setOption} />
        </View>
      </View>
      <View style={{ flex: 2, width: '100%', alignItems: 'center' }}>
        {/* <Button title='next' onPress={e => navigation.navigate("Options")} /> */}
        <Keypad active={active} type={type} text={text} setText={setText} option={option} />
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