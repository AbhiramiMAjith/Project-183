import {React,Component} from 'react'
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    Platform,
    Image,
    ScrollView,
    TouchableOpacity
} from 'react-native'

import Camera from 'expo-camera'
import FaceDetector from 'expo-face-detector'
import StatusBar from 'expo-status-bar'
import * as Permissions from 'expo-permissions'

import Filter1 from '../components/Filter1'
import Filter2 from '../components/Filter2'
import Filter3 from '../components/Filter1'
import Filter4 from '../components/Filter1'

let data=[
    {
        id : 1,
        image : require("../assets/crown-pic1.png")
    },
    {
        id : 2,
        image : require("../assets/crown-pic2.png")
    },
    {
        id : 3,
        image : require("../assets/crown-pic3.png")
    },
    {
        id : 4,
        image : require("../assets/flower-pic1.png")
    }
]

export default class Main extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            hasCameraPermission : null,
            faces : [],
            currentFilter : "filter_1"
        }
        this.onCameraPermission = this.onCameraPermission.bind(this)
        this.onFaceDetection = this.onFaceDetection.bind(this)
        this.onFaceDetectionError = this.onFaceDetectionError.bind(this)
    }

    componentDidMount(){
        Permissions.askAsync(Permissions.CAMERA).then(this.onCameraPermission)
    }

    onCameraPermission=(status)=>{
        this.setState({hasCameraPermission : status.status === 'granted'})
    }

    onFaceDetection=(faces)=>{
        this.setState({faces : faces})
    }
    onFaceDetectionError =(error)=>{
        console.log(error)
    }

    render(){
        const {hasCameraPermission} = this.state
        if (hasCameraPermission === null){
            return <View/>
        }
        if (hasCameraPermission === false){
            return (
                <View style = {styles.container}>
                    <text>No access to camera</text>
                </View>
            )
        }
        console.log(this.state.faces)
        return(
            <View style={styles.container}>
                <SafeAreaView style={styles.droidSafeArea}/>
                <View style={styles.headingContainer}>
                    <Text style={styles.titleText}>
                        LOOK ME
                    </Text>
                </View>
                <View style={styles.cameraStyle}>
                    <Camera 
                        style={{flex : 1}}
                        type={Camera.Constants.Type.front}
                        faceDetectorSettings={{
                            mode : FaceDetector.FaceDetectorMode.fast,
                            detectLandmarks : FaceDetector.FaceDetectorLandmarks.all,
                            runClassifications : FaceDetector.FaceDetectorClassifications.all
                        }}
                        onFacesDetected = {this.onFaceDetection}
                        onFacesDetectionError = {this.onFaceDetectionError}
                    />
                    {this.state.faces.map((face)=>{
                        if (this.state.currentFilter === 'filter_1'){
                            return <Filter1 key={face.faceId} face={face}/>
                        }
                        if (this.state.currentFilter === 'filter_2'){
                            return <Filter2 key={face.faceId} face={face}/>
                        }
                        if (this.state.currentFilter === 'filter_3'){
                            return <Filter3 key={face.faceId} face={face}/>
                        }
                        if (this.state.currentFilter === 'filter_4'){
                            return <Filter4 key={face.faceId} face={face}/>
                        }
                    })}
                    <View>
                        <TouchableOpacity></TouchableOpacity>
                    </View>
                    <View style={styles.filterContainer}>
                        <ScrollView
                            style={{flexDirection : 'row'}} 
                            horizontal 
                            showsHorizontalScrollIndicator={false}>
                                {data.map((filterData)=>{
                                    return(
                                        <TouchableOpacity style={styles.filterImageContainer}
                                        onPress={this.setState({currentFilter : `filter_${filterData.id}`})}>
                                            <Image source={filterData.image} style={{height : 32, width:80}}/>
                                        </TouchableOpacity>
                                    )
                                })}
                        </ScrollView>
                    </View>
                    <View style={styles.actionContainer}></View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container : {
        flex:1
    },
    droidSafeArea :{
        marginTop : Platform.OS === 'android' ? StatusBar.currentHeight : 0
    },
    headingContainer : {
        flex :0.1,
        alignItems : 'center',
        justifyContent : 'center'
    },
    titleText : {
        fontSize : 30
    },
    cameraStyle : {
        flex : 0.65
    },
    filterContainer : {
        flex : 0.2,
        paddingLeft : RFValue(20),
        paddingRight : RFValue(20),
        paddingTop : RFValue(30)
    },
    filterImageContainer :{
        height : RFPercentage(8),
        width : RFPercentage(15),
        justifyContent : 'center',
        alignItems : 'center',
        
    },
    actionContainer : {}
})