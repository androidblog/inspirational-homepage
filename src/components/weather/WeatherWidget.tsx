import React from 'react'
import { WeatherData } from '../../features/weather/Weather'

export default function WeatherWidget({ temperature, description, icon, unit, location }: WeatherData) {
    return (
        <>
            <div className='temp'>
                {icon ? <img src={`http://openweathermap.org/img/w/${icon}.png`} alt='weather-pic'></img> : <></> }
                <p>{temperature} {unit}</p>
            </div>
            <p className='temp-description'>{location}</p>
            <p className='temp-description'>{description}</p>
        </>
    )
}