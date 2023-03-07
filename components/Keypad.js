import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { Button, Card } from 'react-native-paper';



export default function Keypad({ type, text, setText, option, active }) {

    const regexNumber = /^\d+\.?\d*$/
    const [inputStack, setInputStack] = useState([])
    // button creator
    // const findChar = (val) => {
    //     let character = 'a'.charCodeAt(0);
    //     return String.fromCharCode(character + val)
    // }
    // const findNum = (val) => {
    //     let character = '0'.charCodeAt(0);
    //     return String.fromCharCode(character + val)
    // }
    const buttonChar = []
    const buttonNum = []
    var char = {};
    char[1] = "q"; char[2] = "w"; char[3] = "e"; char[4] = "r"; char[5] = "t"; char[6] = "y"; char[7] = "u"; char[8] = "i"; char[9] = "o"; char[10] = "p"; char[11] = "a"; char[12] = "s"; char[13] ="d";
    char[14] = "f"; char[15] = "g"; char[16] = "h"; char[17] = "j"; char[18] = "k"; char[19] = "l"; char[20] = "z"; char[21] = "x"; char[22] = "c"; char[23] = "v"; char[24] = "b"; char[25] = "n"; char[26] = "m";
    
    var num = {}
    num[1] = '1', num[2] = '2', num[3] = '3', num[4] = '4', num[5] = '5', num[6] = '6',num[7] = '7',num[8] = '8',num[9] = '9',num[10] = '0'
    
    for (let i = 1; i <= 26; i++) {
        // const x = findChar(i)
        const x = char[i]
        buttonChar.push(<Button key={x} mode="outlined" buttonColor="" textColor='black' style={{ height: 45, width: 60, margin: 2 }} compact={true} title={x} onPress={() => inChar(x)}> {x} </Button>)
    }
    for (let i = 1; i <= 10; i++) {
        // const x = findNum(i)
        const x = num[i]
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
        if ( type.length > 0 && active) {
            console.log("test",regexNumber.test(val))
            if (type === "transaction") {
                if (regexNumber.test(val)) {
                    inputStack.push(val)
                    setText(inputStack.join(''))
                }

            } else if(text.length < 8) {
                inputStack.push(val)
                setText(inputStack.join(''))
            }
        }

    }
    // input handle

    useEffect(() => {
        console.log("key", inputStack)
        if (option == 'exit' || option == 'submit')
            setInputStack([])
    }, [option])

    return (
        <View style={{
            backgroundColor: '', flex: 1, flexDirection: 'column', justifyContent: 'center',
            alignItems: "center", flexShrink: 1, flexWrap: 'wrap', width: '65 %', marginTop: 5, marginLeft: 25,
        }}>

            <View style={{ flex: 1, flexDirection: 'row', flexShrink: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
                {buttonNum}
                {buttonChar}

                <Button mode="outlined" textColor='black' style={{ height: 45, margin: 2 }} onPress={() => delChar()} >Del </Button>

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