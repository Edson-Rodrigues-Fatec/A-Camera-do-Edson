import React, { useState, useEffect, useRef } from 'react'
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
  Modal,
  Image
} from 'react-native'

import { Camera } from 'expo-camera'
import * as Permissions from 'expo-permissions'
import * as MediaLibrary from 'expo-media-library'
import { Ionicons } from '@expo/vector-icons'
import Cabecalho from './conponents/Cabecalho'

export default function App() {
  //referencia da camera
  const cameraRef = useRef(null)
  //status do acesso a camera
  const [temPermissao, setTemPermissao] = useState(null)
  //status do acesso a galeria
  const [temPermissaoGaleria, setTemPermissaoGaleria] = useState(null)
  const [iconePadrao, setIconePadrao] = useState('md')
  //tipo inicial da camera
  const [tipoCamera, setTipoCamera] = useState(Camera.Constants.Type.back)
  //status inicial do flash
  const [tipoFlash, setTipoFlash] = useState(Camera.Constants.FlashMode.off)
  //Controle de exibição do Modal da foto
  const [exibeModalFoto, setExibeModalFoto] = useState(false)
  //Referencia a foto capturada
  const [fotoCapturada, setFotoCapturada] = useState(null)

  useEffect(() => {
    (async () => {
      const { status } = await Permissions.askAsync(Permissions.CAMERA)
      setTemPermissao(status === 'granted')
    })

      (async () => {
        //solicita a permissao para acesso a galeria de imagens
        const { status } = await Permissions.askAsync.apply(Permissions.CAMERA_ROLL)
        setTemPermissaoGaleria(status === 'granted')
      })

  }, [])

  useEffect(() => {
    //dependendo do SO , exibiremos diferentes icones
    switch (Platform.OS) {
      case 'android':
        setIconePadrao('md')
        break
      case 'ios':
        setIconePadrao('ios')
        break
    }
  }, [])

  useEffect(() => {
    (async () => {
      if (Platform.OS === 'web') {
        const cameraDisponivel = await Camera.isAvailableAsync()
        setTemPermissao(!cameraDisponivel)
      } else {
        const { status } = await Camera.requestPermissionsAsync()
        setTemPermissao(status === 'granted')
      }
    })
  }, [])


  async function obterResolucoes() {
    let resolucoes = await cameraRef.current.getAvailablePictureSizesAsync("16:9")
    console.log("Resoluções suportadas : " + JSON.stringify(resolucoes))
    if (resolucoes && resolucoes.length >= 0) {
      console.log('Maior qualidade : ${resolucoes[resolucoes.length -1]}')
      console.log('Menor qualidade : ${resolucoes[0]}')
    }
  }

  if (temPermissao === false) {
    return <Text>Acesso negado à camera ou o dispositivo não dispõe de uma.</Text>
  }
  async function salvaFoto() {
    if (temPermissaoGaleria) {
      setExibeModalFoto(false)
      const asset = await MediaLibrary.createAssetAsync(fotoCapturada)
      await MediaLibrary.createAlbumAsync('AdsCameraDoEdson', asset, false)
    } else {
      Alert.alert('Sem permissão ', 'App não possui acesso a galeria!')
    }
  }
  async function salvaFoto() {
    if (temPermissaoGaleria) {
      setExibeModalFoto(false)
      const asset = await MediaLibrary.createAssetAsync(fotoCapturada)
      await MediaLibrary.createAlbumAsync('Camera', asset, false)
    } else {
      Alert.alert('Sem permissão', 'App não possui acesso a galeria!')
    }
  }

  async function tirarFoto() {
    if (cameraRef) {
      await obterResolucoes()
      const options = {
        quality: 0.5,
        skipProcessing: true,
        base64: true
      }
      const foto = await cameraRef.current.takePictureAsync(options)
      setFotoCapturada(foto.uri)
      setExibeModalFoto(true)

      let msg = "Foto tirada com sucesso!"

      switch (Platform.OS) {
        case 'android':
          Alert.alert('Imagem Capturada', msg)
          break
        case 'ios':
          Alert.alert('Imagem Capturada', msg)
          break
        case 'web':
          alert(msg)
      }
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Cabecalho titulo="Camera do Edson" />
      <Camera
        style={{ flex: 1 }} 
        type={tipoCamera}
        flashMode={tipoFlash}
        ratio={"16:9"}
        ref={cameraRef}>
        <View style={styles.camera}>
          <TouchableOpacity style={styles.touch} onPress={tirarFoto}>
            <Ionicons name='md-camera' size={40} color="#9E9E9E" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.touch}
            onPress={() => {
              setTipoCamera(tipoCamera === Camera.Constants.Type.back
                ? Camera.Constants.Type.front
                : Camera.Constants.Type.back)
            }}
          >
            <Ionicons name='md-camera-reverse' size={40} color="#9E9E9E" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.touch}
            onPress={() => {
              setTipoFlash(
                tipoFlash === Camera.Constants.FlashMode.on
                  ? Camera.Constants.FlashMode.off
                  : Camera.Constants.FlashMode.on
              )
            }}>
            <Ionicons name={
              tipoFlash === Camera.Constants.FlashMode.on
                ? `${iconePadrao}-flash`
                : `${iconePadrao}-flash-off`
            }

              size={40} color="#9E9E9E" />
          </TouchableOpacity>
        </View>
      </Camera>

      <Modal animationType="slide" transparent={true} visible={exibeModalFoto}>
        <View style={styles.modalView}>
          <View style={{ flexDirection: 'row-reverse' }}>
            <TouchableOpacity style={{ margin: 2 }}
              onPress={() => {
                setExibeModalFoto(false)
              }}
              accessible={true}
              accessibilityLabel="Fechar"
              accessibilityHint="Fecha a janela atual">
              <Ionicons name='md-close-circle' size={40} color="#D9534F" />
            </TouchableOpacity>

            <TouchableOpacity style={{ margin: 2 }} onPress={salvaFoto}>
              <Ionicons name='md-cloud-upload' size={40} color="#121212" />
            </TouchableOpacity>

          </View>
          <Image source={{ uri: fotoCapturada }} style={{ width: '90%', height: '70%', borderRadius: 20 }} />
        </View>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  modalView: {
    margin: 10,
    borderBottomColor: "white",
    borderRadius: 20,
    padding: 15,
    alignItems: 'center'
  },
  container: {
    flex: 1,
    justifyContent: 'center'
  },
  camera: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end'
  }
})

