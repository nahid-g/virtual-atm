import React, { useEffect, useState } from 'react'
import { Button, StyleSheet, Text, View } from 'react-native'
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable';
import LeftSide from '../components/LeftSide';
import RightSide from '../components/RightSide';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from "@env"
import axios from 'axios';
import Loader from '../components/Loader';
import Keypad from '../components/Keypad';

function ATMOptions({ navigation }) {


  const [option, setOption] = useState("")
  const [loading, setLoading] = useState(false)
  const [balance, setBalance] = useState()

  const [selected, setSelected] = useState()


  const removeUser = async () => {
    await AsyncStorage.removeItem('userData')

  }

  const showBalance = async () => {

    let user = JSON.parse(await AsyncStorage.getItem('userData'))
    setLoading(true)
    await axios.post(`${BASE_URL}/check-balance`, { "atm_uid": user.atm_uid })
      .then((res) => {
        console.log(res.data)
        setBalance(res.data.balance)
      }).catch(e => {
        console.log(e)
      })


  }

  useEffect(() => {
    // loading && setLoading(false)
  }, [loading])

  useEffect(() => {
    loading && setLoading(false)
  }, [balance])

  useEffect(() => {
    console.log(option)
    if (option == 'submit') {
      console.log(selected)
      if (selected == "up") {
        !balance && showBalance()
      } else if (selected == "down") {
        navigation.navigate("Transaction")
      }
    } else if (option == 'exit') {
      setBalance(null)
      // removeUser()
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
            <View style={{ flex: 1, justifyContent: 'center' }}>
              <Text style={{ fontSize: 30 }}>Choose an option</Text>
            </View>
            <View style={{ flex: 2, alignItems: 'center' }}>
              {!balance && loading && <View style={{ flex: 1, alignItems: 'center' }} > <Loader /> </View>}
              {balance && <View style={{ flex: 1, alignItems: 'center' }} >
                <Text style={{ fontSize: 20, color: 'green' }}> You have ${balance} in your account </Text>
              </View>}

              {!balance && <View style={{ width: 200, marginTop: 10, flex: 1 }}>
                <Button

                  title="Balance Check"
                  color={option == "up" ? "" : "#53768f"}
                // onPress={showBalance}
                />
              </View>}


              <View style={{ width: 200, marginTop: 10, flex: 1 }}>

                <Button

                  title="Transaction"
                  color={option == "down" ? "" : "#53768f"}
                // onPress={() => navigation.navigate('Transaction')}
                />
              </View>

            </View>
          </View>

        </View>


        <View style={{ flex: 2, paddingLeft: 50 }} >
          <RightSide setOption={setOption} />
        </View>
      </View>
      <View style={{ flex: 2, width: '100%', alignItems: 'center' }}>
        {/* <Keypad type={0} text={"absc"} setText={setText} option={option} /> */}
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