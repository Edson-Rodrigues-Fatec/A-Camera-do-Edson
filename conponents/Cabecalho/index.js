import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

const Cabecalho = ({ titulo }) => {
    return (
        <View>
            <Text style={styles.tituloCabecalho}>{titulo}</Text>
        </View>
    )
}
const styles = StyleSheet.create({
    tituloCabecalho: {
        fontSize: 40,
        fontWeight: 'bold',
        paddingTop: 10,
        paddingBottom: 10,
        textAlign: 'center',
        borderColor: '#000000',
        backgroundColor: '#1A237E',
        color: '#FF0000'
    }, toucableHand: {
        margin: 50
    }
})
export default Cabecalho