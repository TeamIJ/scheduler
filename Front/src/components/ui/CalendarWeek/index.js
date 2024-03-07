import styles from "./styles.module.css";
import { useState, useEffect } from "react";

const days = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb']
const months = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']

let date = new Date()
const calendar =[] 

function getDayOfWeek(){
  let dayOfWeek = date.getDay()
  let dayCurrent = date.getDate()
  let month = date.getMonth()
  let year = date.getFullYear()

  while(dayOfWeek > 0){
    dayCurrent--
    dayOfWeek--
    if(dayCurrent === 0){
      month--
      let lastDay = new Date(year, month + 1, 0).getDate()
      dayCurrent = lastDay
    }
    if(month === -1){
      month = 11
      year--
    }
  }
  date.setDate(dayCurrent)
  
  while(dayOfWeek < 7){
    calendar.push({
      day: dayCurrent,
      week: dayOfWeek,
      month: month,
      year: year,
    })
    dayCurrent++
    dayOfWeek++
    
    let lastDay = new Date(year, month + 1, 0).getDate()
    if(lastDay === dayCurrent-1){
      month++
      dayCurrent=1
    }
    
    if(month >= 11){
      month = 0
      year++
    }

    date.setDate(dayCurrent)
  }
}
getDayOfWeek()

export function CalendarWeek({ ...rest }) {
  
  const [hourSelected, setHourSelected] = useState()
  function handleTimeSelect(e) {
    setHourSelected(e.target.id)
  }
  console.log(hourSelected)
  
  return (
    <div className={styles.container}>
      <div className={styles.calendar}>
        <div className={styles.month}>
          <h1>{ months[date.getMonth()] }</h1>
        </div>
        <div className={styles.weekdays}>
            {
              calendar.map((day) => {
                return(
                  <div className={styles.dayContainer}>
                    <div className={styles.day}>
                      <p className={styles.nameWeek}>{days[day.week]}</p>
                      <p>{day.day} <span>{months[day.month].substring(0,3)}</span></p>
                    </div>
                    <div className={styles.hourContainer}>
                      <div id={`${day.day}-${day.month+1}-${day.year}-H08`} onClick={(e) => handleTimeSelect(e)} 
                              className={hourSelected === `${day.day}-${day.month+1}-${day.year}-H08` ? styles.hourSelected : styles.hour}>08:00</div>

                      <div id={`${day.day}-${day.month+1}-${day.year}-H09`} onClick={(e) => handleTimeSelect(e)} 
                              className={hourSelected === `${day.day}-${day.month+1}-${day.year}-H09` ? styles.hourSelected : styles.hour}>09:00</div>

                      <div id={`${day.day}-${day.month+1}-${day.year}-H10`} onClick={(e) => handleTimeSelect(e)} 
                              className={hourSelected === `${day.day}-${day.month+1}-${day.year}-H10` ? styles.hourSelected : styles.hour}>10:00</div>

                      <div id={`${day.day}-${day.month+1}-${day.year}-H11`} onClick={(e) => handleTimeSelect(e)} 
                              className={hourSelected === `${day.day}-${day.month+1}-${day.year}-H11` ? styles.hourSelected : styles.hour}>11:00</div>

                      <div id={`${day.day}-${day.month+1}-${day.year}-H12`} onClick={(e) => handleTimeSelect(e)} 
                              className={hourSelected === `${day.day}-${day.month+1}-${day.year}-H12` ? styles.hourSelected : styles.hour}>12:00</div>

                      <div id={`${day.day}-${day.month+1}-${day.year}-H13`} onClick={(e) => handleTimeSelect(e)} 
                              className={hourSelected === `${day.day}-${day.month+1}-${day.year}-H13` ? styles.hourSelected : styles.hour}>13:00</div>

                      <div id={`${day.day}-${day.month+1}-${day.year}-H14`} onClick={(e) => handleTimeSelect(e)} 
                              className={hourSelected === `${day.day}-${day.month+1}-${day.year}-H14` ? styles.hourSelected : styles.hour}>14:00</div>

                      <div id={`${day.day}-${day.month+1}-${day.year}-H15`} onClick={(e) => handleTimeSelect(e)} 
                              className={hourSelected === `${day.day}-${day.month+1}-${day.year}-H15` ? styles.hourSelected : styles.hour}>15:00</div>

                      <div id={`${day.day}-${day.month+1}-${day.year}-H16`} onClick={(e) => handleTimeSelect(e)} 
                              className={hourSelected === `${day.day}-${day.month+1}-${day.year}-H16` ? styles.hourSelected : styles.hour}>16:00</div>

                      <div id={`${day.day}-${day.month+1}-${day.year}-H17`} onClick={(e) => handleTimeSelect(e)} 
                              className={hourSelected === `${day.day}-${day.month+1}-${day.year}-H17` ? styles.hourSelected : styles.hour}>17:00</div>

                      <div id={`${day.day}-${day.month+1}-${day.year}-H18`} onClick={(e) => handleTimeSelect(e)} 
                              className={hourSelected === `${day.day}-${day.month+1}-${day.year}-H18` ? styles.hourSelected : styles.hour}>18:00</div>
                    </div>
                  </div>
                )
              })
            }
        </div>
      </div>
    </div>
  );
}
