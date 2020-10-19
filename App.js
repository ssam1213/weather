import { StatusBar } from 'expo-status-bar';
import React from 'react';
import Loading from './Loading'
import * as Location from 'expo-location';
import { Alert } from 'react-native';
import axios from 'axios'
import Weather from './Weather';

const API_KEY = "4fa4f7c5b7d45a1cb42c4218f6df78e8";

export default class extends React.Component {
  state = {
    isLoading: true,

  }

  getWeather = async(latitude, longitude) => {
    const {data:{main:{temp},weather}} = await axios.get(`http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`)
   
    this.setState({
      isLoading: false,
      temp,
      conditions: weather[0].main
    })
  }

  getLocation = async() =>{
    try{
      const response = await Location.requestPermissionsAsync();
      console.log(response);
      const {coords:{latitude, longitude}} = await Location.getCurrentPositionAsync(); 
      this.getWeather(latitude, longitude)
    } catch (error){
      Alert.alert("어디있는지 몰라서 날씨 정보를 가져 올 수 없어요")
    }

  }
  componentDidMount(){
    this.getLocation()
  }
  render(){
    const { isLoading, temp, conditions } = this.state
    return isLoading ?  <Loading /> : <Weather temp={Math.round(temp)} condition={conditions}/>
  }
}
