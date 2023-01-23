import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { Button, Card } from 'react-native-paper';



export default function Keypad({ type, text, setText, option }) {
    
    const [inputStack, setInputStack] = useState([])
    // button creator
    const findChar = (val) => {
        let character = 'a'.charCodeAt(0);
        return String.fromCharCode(character + val)
    }
    const findNum = (val) => {
        let character = '0'.charCodeAt(0);
        return String.fromCharCode(character + val)
    }
    const buttonChar = []
    const buttonNum = []
    for (let i = 0; i < 26; i++) {
        const x = findChar(i)
        buttonChar.push(<Button key={x} mode="outlined" buttonColor=""  textColor='black' style={{ height: 45, width: 60 , margin: 2 }} compact={true} title={x} onPress={() => inChar(x)}> {x} </Button>)
    }
    for (let i = 0; i < 10; i++) {
        const x = findNum(i)
        buttonNum.push(<Button key={x} mode="outlined" buttonColor="" textColor='black' style={{ height: 45, width: 60, margin: 2 }} compact={true} onPress={() => inChar(x)}> {x} </Button>)
    }
    // button creator

    // input handle
    const delChar = () => {
        if (inputStack.length) {
            inputStack.pop()
            //   setMessage(inputStack.join(''))
            setText(inputStack.join(''))
        }
    }
    const inChar = (val) => {
        if (text.length < 8 && type>0) {
            inputStack.push(val)
            setText(inputStack.join(''))
        }

    }
    // input handle

    useEffect(()=>{
        console.log("key",inputStack)
        if(option == 'exit' || option == 'submit')
            setInputStack([])
    },[option])

    return (
        <View style={{
            backgroundColor: '', flex: 1, flexDirection: 'column', justifyContent: 'center',
            alignItems: "center", flexShrink: 1, flexWrap: 'wrap', width: '65 %', marginTop: 5,marginLeft: 25, 
        }}>

            <View style={{ flex: 1, flexDirection: 'row', flexShrink: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
                {buttonNum}
                {buttonChar}

                <Button mode="outlined" textColor='black'   style={{ height: 45,  margin: 2 }}  onPress={() => delChar()} >Del </Button>

            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'dodgerblue',
        alignItems: 'center',
        justifyContent: 'center',
    },
});