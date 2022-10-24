import React, { useState, useEffect } from 'react';
import './Home.css';
import lampImg from './lampImg.png'
import lampImgOff from './lampImgOff.png'
import {BsToggleOff, BsToggleOn, BsPower} from 'react-icons/bs'
import {TbSend} from 'react-icons/tb'
import {AiOutlineReload, AiOutlineCheck} from 'react-icons/ai'

function Home() {
    const [lampStatus, setLampStatus] = useState(false);
    const [voiceSensor, setVoiceSensor] = useState(false);
    const [ldrSensor, setLdrSensor] = useState(false);
    const [pirSensor, setPirSensor] = useState(false);
    const [saved, setSaved] = useState(false);

    const reloadValues = () => {
        fetch('http://192.168.1.1/', {method: 'GET', mode: 'cors'})
            .then((response) => response.text()
                .then(data => { 
                    const respArray = data.split('-')
                    setLampStatus(Number(respArray[0]) > 0)
                    setPirSensor(Number(respArray[1]) > 0)
                    setLdrSensor(Number(respArray[2]) > 0)
                    setVoiceSensor(Number(respArray[3]) > 0)
                })
            )
    }

    const sendValues = () => {
        const bodyStr = `${Number(pirSensor)}-${Number(ldrSensor)}-${Number(voiceSensor)}`
        fetch('http://192.168.1.1/setSensor', {method: 'POST', mode: 'cors', body: bodyStr})
            .then((response) => response.text()
                .then(data => { 
                    setSaved(true)
                    console.log(data, saved)
                })
            )
    }

    const turnOn = () => {
        setLampStatus(true)
        fetch('http://192.168.1.1/on', {method: 'GET', mode: 'cors'})
            .then((response) => response.text()
                .then(data => { 
                    console.log(data)
                })
            )
    }

    const turnOff = () => {
        setLampStatus(false)
        fetch('http://192.168.1.1/off', {method: 'GET', mode: 'cors'})
            .then((response) => response.text()
                .then(data => { 
                    console.log(data)
                })
            )  
    }

    useEffect(() => {
        reloadValues();
    }, []);
    
    return (
        <div className="Home">
            <div className="Header">
                <img src={lampStatus ? lampImg : lampImgOff} className="LampImg"></img>
                <h1 className="HeaderText">GUNA Smart Lamp</h1>
            </div>
            
            <div className="LampContainer">
                <div className="LampStatus">
                    <p className="LampStatusText">Ligar/Desligar</p>
                    { lampStatus ? <BsToggleOn size={33} color={'#50B3FA'} onClick={() => turnOff()} className="LampStatusButton"/> 
                        : <BsToggleOff size={33} color={'#B6B6B6'} onClick={() => turnOn()} className="LampStatusButton"/> }
                </div>
                <AiOutlineReload size={33} color={'#50B3FA'} className="LampReload" onClick={() => reloadValues()}/>
            </div>

            <div className="ButtonsContainer">
                <div className={`ButtonContainer ${voiceSensor}`} onClick={() => setVoiceSensor(!voiceSensor) & setSaved(false)}>
                    <p className='ButtonText'>Sensor de som</p>
                    <BsPower size={33} />
                </div>
                <div className={`ButtonContainer ${ldrSensor}`} onClick={() => setLdrSensor(!ldrSensor) & setSaved(false)}>
                    <p className='ButtonText'>Sensor de luz</p>
                    <BsPower size={33}/>
                </div>
                <div className={`ButtonContainer ${pirSensor}`} onClick={() => setPirSensor(!pirSensor) & setSaved(false)}>
                    <p className='ButtonText'>Sensor de presença</p>
                    <BsPower size={33}/>
                </div>
                <div className={`ButtonContainerSend ${saved}`} onClick={() => sendValues()}>
                    {saved ? <AiOutlineCheck size={33} color={'white'}/> : <TbSend size={33} color={'#50B3FA'}/>}
                    <p className='ButtonText'>{!saved ? 'Salvar alterações' : 'Salvo com sucesso!' }</p>

                </div>
            </div>

            <div className='Footer'>
                <p className='FooterText'>Desenvolvido por Gustavo e Nathália</p>
            </div>
        </div>
  );
}

export default Home;