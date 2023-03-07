import React, { useEffect, useState } from 'react'
import { Button, StyleSheet, Text, TextInput, View } from 'react-native'
import Keypad from '../components/Keypad';
import LeftSide from '../components/LeftSide';
import RightSide from '../components/RightSide';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Loader from '../components/Loader';
import CountDown from 'react-native-countdown-component';


function Transaction({ navigation }) {
  const [text, setText] = useState("")
  const [show, setShow] = useState(false)
  const [option, setOption] = useState("")
  const [loading, setLoading] = useState(false)
  const [active, setActive] = useState(true)
  const [money, setMoney] = useState('true')


  const removeUser = async () => {
    await AsyncStorage.removeItem('userData')

  }

  const withdraw = async () => {
    let user = JSON.parse(await AsyncStorage.getItem('userData'))
    let atm = JSON.parse(await AsyncStorage.getItem('atmData'))
     
 
     await axios.post(`${process.env['BASE_URL']}/user/withdrawal`, {    
      "atm_uid": user.atm_uid, "atm_number": atm.atm_number,
      "key": atm.key, "privateKey": atm.privateKey, "bankPublicKey": atm.bankPublicKey, "amount": text
    })
      .then((res) => {
        console.log(res.data)
        if (res.data["39"] === "00") {
          setShow(true)
          setLoading(false)
          setText('')
        }else{
          setMoney(false)
          setLoading(false)
          setText('')
          setActive(true)
        }
      })
  }

  useEffect(() => {
    console.log(option)
    if (option == 'submit') {
      //submission
      console.log("yoo")

      if (text.length > 0) {
        console.log("yoo")
        withdraw()
        setActive(false)
        setLoading(true)
      }else{
        setOption("")
      }

    } else if (option == 'exit') {
      setText("")
      setOption("")
      setActive(true)
      // removeUser()
      navigation.navigate("Options")
    }
  }, [option])

  useEffect(() => {
    if (show) {
      let interval = setInterval(() => {
        setShow(false)
        setOption("")
        setActive(true)
      }, 10000)
      return () => {
        clearInterval(interval)
      }
    }
  }, [show])

  useEffect(()=>{
    if(text.length > 0){
     setMoney(true)
     setOption("")
    }
    },[text])



  return (
    <View style={{ flex: 1, marginTop: 30 }}>
      <View elevation={5} style={styles.container}>
        <View style={{ flex: 2.5, marginRight: 20 }} >
          <LeftSide />
        </View>

        <View style={{ flex: 6, alignItems: 'center', borderWidth: 1, borderColor: 'black', marginLeft: 20, height: 300 }} >
          <View style={{ flex: 2, marginTop:10 }}>
          <Text style={{textAlign:'center', color: 'green', fontWeight: '700', fontSize: 30 }}>Enter your desired amount</Text>
            <TextInput
              style={{textAlign: 'center',color: 'black', fontWeight: '400' , height: 40, borderBottomWidth: 1, borderBottomColor: 'grey', marginTop: 30, fontSize: 23 }}
              placeholder=" Type here "
              keyboardType='numeric'
              defaultValue={text}
              editable={false}
            />

          </View>
          {show ?
            <View style={{ flex: 2, alignItems: 'center' }}>
              <Text style={{ color: 'green', fontWeight: '700', fontSize: 20 }}>Money is being dispensed. Thank you</Text>
              <Text style={{ color: 'green', fontWeight: '700', fontSize: 10 }}>Please wait 15 seconds to make trasaction again</Text>
              {/* <CountDown
                until={10}
                size={30}
                onFinish={() => console.log("finished")}
                digitStyle={{ backgroundColor: '#FFF', height: 40 }}
                digitTxtStyle={{ color: '#1CC625' }}
                timeToShow={['S']}
                timeLabels={{ s: 'seconds left' }}
              /> */}
            </View>
            :
            loading &&
            <View style={{ flex: 4 }}>
              <Loader />
            </View> 
          }
          
          {!money && <View style={{ flex: 2, alignItems: 'center' }}>
              <Text style={{ color: 'red', fontWeight: '700', fontSize: 20 }}>Insufficient balance</Text>
             
             </View>}
        </View>

        <View style={{ flex: 2, paddingLeft: 50 }} >
          <RightSide screen="transaction" setOption={setOption} />
        </View>
      </View>
      <View style={{ flex: 2, width: '100%', alignItems: 'center' }}>

        <Keypad active={active} type={"transaction"} text={text} setText={setText} option={option} />

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