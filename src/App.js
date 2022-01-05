import React, { useState, useEffect } from "react"
import "./App.css"

var mqtt = require("mqtt")

function App() {
  function pm25_sceen (message_json){
    setValue_pm25  (message_json['data']['pm25'])
  }

  function social_sceen (message_json){
    setValue_social_text  (message_json['data']['text'])
  }
  
  function temporhumScreen_show(message_json){
    //จะให้ station ไหน ขึ้นจอบ้างใส่ใน list ได้เลย
    var screen_01 = ["station001"]
    var screen_02 = ["station002"]
     
    var name = message_json['name']
    var temp = message_json['data']['temp']
    var hum = message_json['data']['humid']
    var temp_feel_1 = 0.0
    var temp_feel_2 = 0.0
    if(screen_01.includes(name)){
      setValue_name_scrren_01(name)
      setValue_temp_scrren_01(temp)
      setValue_hum_scrren_01(hum)
      temp_feel_1 = cal_realfeel(temp,hum)
      setValue_temp_feel_scrren_01(temp_feel_1)
      
    }
    if(screen_02.includes(name)){
      setValue_name_scrren_02(name)
      setValue_temp_scrren_02(temp)
      setValue_hum_scrren_02(hum)
      temp_feel_2 = cal_realfeel(temp,hum)
      setValue_temp_feel_scrren_02(temp_feel_2)
    }
    
  }

  function check_temporhum(temp_feel_1,temp_feel_2){
    temp_calfeel = 0
    // temporhumScreen_show(message_json)
  //  console.log(temp_feel_1)
    // if (temp_feel_1 != "" && temp_feel_2 != ""){
    //   var temp_calfeel = ((temp_feel_1 + temp_feel_2)/2)
      var temp_calfeel = temp_feel_1
      
      if (temp_calfeel < 0) {
        setColor("#7900FF")
        setStatus("เเข็งไปทั้งตัว ทั้งหัวใจ")
        setEmoji("🥶")
        
      } if (temp_calfeel >= 0) {
        setColor("#516BEB")
        setStatus("อย่างกับอยู่ขั้วโลกเหนือ บึ๋ยยยย")
        setEmoji("🥶")
        
      } if (temp_calfeel >= 20) {
        setColor("#84DFFF")
        setStatus("หนาวเป็นน้ำเเข็งเเล้ว")
        setEmoji("😆")
      
      } if (temp_calfeel >= 25) {
        setColor("#F8D45D")
        setStatus("เย็นกำลังดี")
        setEmoji("😊")
      
      } if (temp_calfeel >= 30) {
        setColor("#FB9A51")
        setStatus("ร้อนมากเลย")
        setEmoji("😕")
        
      } if (temp_calfeel >= 35) {
        setColor("#F76669")
        setStatus("ขอร่มที ร้อนไม่ไหว")
        setEmoji("😖")
        
      }
    // }   
    return true
  }

  //คำนวนค่าความรู้สึกต่ออุณภูมินั้นจริงๆ
  function cal_realfeel(t,h) {
    var h = 0
    var tf = (t*9/5) + 32;
    var realfeel = 0
    var realfeel = (-42.379) + (2.04901523 * tf) + (10.14333127 * h) - (0.22475541 * tf * h) - (6.83783 * Math.pow(10, -3) * Math.pow(tf, 2)) - (5.481717 * Math.pow(10, -2) * Math.pow(h, 2)) + (1.22874 * Math.pow(10, -3) * Math.pow(tf, 2) * h) + (8.5282 * Math.pow(10, -4) * tf * Math.pow(h, 2)) - (1.99 * Math.pow(10, -6) * Math.pow(tf, 2) * Math.pow(h, 2));
    var realfeel = parseFloat((realfeel - 32) / 1.80).toFixed( 1 );
    // setValue_temp_cal(t)
    // setValue_temp_calfeel(realfeel)
    return realfeel
  }

  function check_type_message(topic,message){
    var message_json = {}
    //เช็คว่ามีข้อมูลอะไรเข้ามาจริงไหม
    if (topic != " " && message != " " ){

      //เช็คว่านี่ไม่ใช่ string ใช่ใหม เพราะต่อให้พยายามทำให้เป็น string ก็มาในรูปเเบบ ofject อยู่ดี ยังไงก็ต้องดักไว้ก่อนเพื่อความชัว
      if(typeof(message) == "object"){
        message = message.toString()

        //ส่วนนี้จะเป็นตัวเช็คว่าเป็น json หรือไม่ ถ้าไม่่ผ่านจุดนี้ถือว่าเป็น false ทันที
        try{
          
            message_json = message.trim()
            message_json = message_json.replace(/'/g,'"')
            message_json =  JSON.parse(message_json)
            setPayload({ topic, message: message_json })
            // setValue_temp (parseFloat(message_json['t']))
            // setValue_Hum (parseFloat(message_json['h']))
            if (message_json['type'] == "weather"){
              // check_temporhum(message_json)
              temporhumScreen_show(message_json)
              
            }
            if (message_json['type'] == "pm25"){
              pm25_sceen (message_json)
            }
            if (message_json['type'] == "social"){
              social_sceen(message_json)
            }
            
        }
        catch{
          setmessage_string(message)
        }
        // setPayload({ topic, message: message_json })
        // setValue_temp (parseFloat(message_json['t']))
        // setValue_Hum (parseFloat(message_json['h']))
        }

    }
  }
  
  //โค็ดสำหรับเซ็ตค่าออกจอ 1
  const [Value_name_scrren_01, setValue_name_scrren_01] = useState("กำลังเชื่อมต่อสถานี")
  const [Value_temp_scrren_01, setValue_temp_scrren_01] = useState(-1)
  const [Value_hum_scrren_01, setValue_hum_scrren_01] = useState(-1)
  const [Value_temp_feel_scrren_01, setValue_temp_feel_scrren_01] = useState(-1)

  //โค็ดสำหรับเซ็ตค่าออกจอ 2
  const [Value_name_scrren_02, setValue_name_scrren_02] = useState("กำลังเชื่อมต่อสถานี")
  const [Value_temp_scrren_02, setValue_temp_scrren_02] = useState(-1)
  const [Value_hum_scrren_02, setValue_hum_scrren_02] = useState(-1)
  const [Value_temp_feel_scrren_02, setValue_temp_feel_scrren_02] = useState(-1)

  const [message_string, setmessage_string] = useState("")
  const [Value_social_text, setValue_social_text] = useState("")
  const [Value_pm25, setValue_pm25] = useState(-1)
  const [Value_temp, setValue_temp] = useState(-1)
  const [Value_Hum, setValue_Hum] = useState(-1)
  const [Value_temp_cal, setValue_temp_cal] = useState(-1)
  const [Value_temp_calfeel, setValue_temp_calfeel] = useState(-1)
  const [payload, setPayload] = useState({})
  const [color, setColor] = useState("#A3DA8D")
  const [status, setStatus] = useState("กำลังวิเคราะห์ข้อมูล")
  const [emoji, setEmoji] = useState("")
  const [ms, setms] = useState("")
  const subTopic = "e775b1245d94ea4a79be6ce40cf96929"
  const broker = "hivemq"
  var client = mqtt.connect("ws://broker.hivemq.com:8000/mqtt",options)
  var options={
      retain:true,
      qos:1,
      clientId:"mqttjs01",
      clean:true};

  client.subscribe(subTopic)
  client.on("message", function (topic, message) {
    //รับค่ามาปกติเเปลงเป็น string 
    // message = message.toString()
    // console.log(message)
    // console.log(typeof(message))
    check_type_message(topic,message)
    // if (message != " " ){
    //   if(typeof(message) == "object"){
    //   message = message.toString()
    //   message = message.trim()
    //   message = message.replace(/'/g,'"')
    //   // setValue(parseFloat(message))
    //   message =  JSON.parse(message)
    //   setPayload({ topic, message: message })
    //   setValue_temp (parseFloat(message['t']))
    //   setValue_Hum (parseFloat(message['h']))
    //   }
    // }
    // setValue(parseFloat(ms['t']))
  })
  
  //เมื่อค่าที่อยู่ใน [xxx] มีการเปลี่ยนเเปลงให้ทำอะไรต่อไปนี้...
  useEffect(() => {
    check_temporhum(Value_temp_scrren_01,Value_temp_scrren_02)
  }, [Value_temp_scrren_01])

  // useEffect(() => {
  //   check_temporhum(Value_temp_feel_scrren_01,Value_temp_feel_scrren_02)
  // }, [Value_temp_feel_scrren_02])
  // useEffect(() => {
  //   check_temporhum(Value_temp,Value_Hum)
  // }, [Value_Hum])


  //ส่วนของการเเสดงผลหน้าเว็บ
  return (
    <div className="App">
      <header className="App-header">
        <h2>Subscribe Topic: {`${subTopic}`}</h2>
        <h3>Broker: {`${broker}`} </h3>
        <p>ข้อความธรรมดา: {message_string}</p>
        
        <div className="show" >
          <div className="temp_box" >
            <h5 style={{ margin: 0 }}>สถานี: {Value_name_scrren_01}</h5>
            <br></br>
            <h5 style={{ margin: 0 }}>อุณหภูมิ: {Value_temp_scrren_01} °C </h5>
            <br></br>
            <h5 style={{ margin: 0 }}>ความชื้น: {Value_hum_scrren_01} %</h5>
            <br></br>
            <h5 style={{ margin: 0 }}>ความรู้สึกจริง: {Value_temp_feel_scrren_01} °C</h5>
          </div>
          <div className="temp_box" >
            <h5 style={{ margin: 0 }}>สถานี: {Value_name_scrren_02}</h5>
            <br></br>
            <h5 style={{ margin: 0 }}>อุณหภูมิ: {Value_temp_scrren_02} °C </h5>
            <br></br>
            <h5 style={{ margin: 0 }}>ความชื้น: {Value_hum_scrren_02} %</h5>
            <br></br>
            <h5 style={{ margin: 0 }}>ความรู้สึกจริง: {Value_temp_feel_scrren_02} °C</h5>
          </div>
          <div className="hum_box" >
            
            <br></br>
            <h5 style={{ margin: 0 }}>PM2.5: {Value_pm25} AQI</h5>
          </div>
          <div className="rcorners" style={{ background: color }}>
            <h4 style={{ margin: 0 }}>{status}</h4>
            {/* <h5 style={{ margin: 0 }}>อุณหภูมิ: {Value_temp_cal} °C ความรู้สึกจริง: {Value_Hum_cal} °C</h5> */}
            <br></br>
            <div className="emoji_layout" >{emoji}</div>
          </div>
          
          
        </div>
        <div className="Text_box" >
            <div className="social_layout" style={{ margin: 0 }}>{Value_social_text}</div>
        </div>
        <p>json Payload: {JSON.stringify(payload)}</p>
      </header>
    </div>
  )
}

export default App;
