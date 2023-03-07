import React, { useEffect, useState } from 'react'
import { Button, StyleSheet, Text, View } from 'react-native'
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable';
import LeftSide from '../components/LeftSide';
import RightSide from '../components/RightSide';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Loader from '../components/Loader';
import Keypad from '../components/Keypad';

function ATMOptions({ navigation }) {


  const [option, setOption] = useState("")

  const [balance, setBalance] = useState("")

  const [selected, setSelected] = useState("")
  const [show, setShow] = useState(false)

  const removeUser = async () => {
    await AsyncStorage.removeItem('userData')

  }

  const showBalance = async () => {
    const user = JSON.parse(await AsyncStorage.getItem('userData'))
    const atm = JSON.parse(await AsyncStorage.getItem('atmData'))
     console.log('balance')
     await axios.post(`${process.env['BASE_URL']}/user/check-balance`, { "atm_uid": user.atm_uid, "atm_number": atm.atm_number, 
    "key": atm.key, "privateKey":atm.privateKey, "bankPublicKey":atm.bankPublicKey })  
      .then((res) => {
        console.log(res.data)
        setBalance(res.data.balance.toString())
      }).catch(e => {
        console.log(e)
      })


  }


  useEffect(() => {
    show && setShow(false)
  }, [balance])

  useEffect(() => {
    
    if (option == 'submit') {
      // navigation.navigate("Transaction")
      if (selected == "up" && !balance) {
        showBalance()
        setShow(true)
      } else if (selected == "down") {
        setBalance(null)
        setShow(false)
        navigation.navigate("Transaction")
      }
    } else if (option == 'exit') {
      setBalance(null)
      removeUser()
      navigation.navigate("HomePage")

    }
    else {
      setSelected(option)
    }
  }, [option])

  return (
    <View style={{ flex: 1, marginTop: 30 }}>
      <View style={styles.container}>
        <View style={{ flex: 2.5, marginRight: 20 }} >
          <LeftSide active={false} />
        </View>


        <View style={{ flex: 6, alignItems: 'center', borderWidth: 1, borderColor: 'black', marginLeft: 20, height: 300 }}>


          <View style={{ flex: 1, alignItems: 'center', height: 100 }}>
            <View style={{ flex: 1,alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 30, color: "#048f2e" }}>Select Option</Text>
              <Text style={{ fontSize: 15, color: "#048f2e" }}>Press UP or DOWN to choose option and Submit</Text>
            </View>
            <View style={{ flex: 2, alignItems: 'center' }}>
              
              {balance ? <View style={{ flex: 1, alignItems: 'center' }} >
                <Text style={{ fontSize: 25, color: '#03a3a6', paddingTop: 15 }}> You have ${balance} in your account </Text>
              </View> : 
              <View style={{ width: 200, marginTop: 10, flex: 1 }}>
                <Button

                  title="Balance Check"
                  color={option == "up" ? "" : "#53768f"}
               
                />
              </View>}
              
              {show && <Loader/>}

              <View style={{ width: 200, marginTop: 10, flex: 1 }}>

                <Button

                  title="Transaction"
                  color={option == "down" ? "" : "#53768f"}
                
                />
              </View>

            </View>
          </View>

        </View>


        <View style={{ flex: 2, paddingLeft: 50 }} >
          <RightSide screen = "options" setOption={setOption} />
        </View>
      </View>
      <View style={{ flex: 2, width: '100%', alignItems: 'center' }}>
        
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 3,
    flexDirection: 'row',
    padding: 20,
    justifyContent: "space-around",
    alignItems: "center",
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


export default ATMOptions