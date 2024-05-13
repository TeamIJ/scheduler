import styles from "./styles.module.css";
import { api } from "@/services/apiClient";
import { useState, useEffect } from "react";
import { replicateZeros } from "@/services/utils";

const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

let date = new Date()
const calendar = []


async function getDayOfWeek() {
  let dayOfWeek = date.getDay()
  let dayCurrent = date.getDate()
  let month = date.getMonth()
  let year = date.getFullYear()

  while (dayOfWeek > 0) {
    dayCurrent--
    dayOfWeek--
    if (dayCurrent === 0) {
      month--
      let lastDay = new Date(year, month + 1, 0).getDate()
      dayCurrent = lastDay
    }
    if (month === -1) {
      month = 11
      year--
    }
  }
  date.setDate(dayCurrent)

  while (dayOfWeek < 7) {

    const response = await api.get(`/api/scheduler/timetables/${days[dayOfWeek]}`)

    let timetables = response.data

    let hours = []
    timetables.forEach(time => {
      hours.push({
        "hour":time.HORARIO.substring(0, 5),
        "available":time.STATUS_HORARIO === "D"
      })
    })
    let dayAvailable
    if(timetables[0]){
      dayAvailable = timetables[0].STATUS_DIA === "D"
    }else{
      dayAvailable = false
    }
    calendar.push({
      day: dayCurrent,
      week: dayOfWeek,
      month: month,
      year: year,
      available: dayAvailable,
      hours: hours
    })

    dayCurrent++
    dayOfWeek++

    let lastDay = new Date(year, month + 1, 0).getDate()
    if (lastDay === dayCurrent - 1) {
      month++
      dayCurrent = 1
    }

    if (month >= 11) {
      month = 0
      year++
    }

    date.setDate(dayCurrent)
  }

}

getDayOfWeek()

export function CalendarWeek({ setDateHourSelected, setDiaSemanaSelecionado, ...rest }) {

  const [hourSelected, setHourSelected] = useState()
  const [domLoaded, setDomLoaded] = useState(false)
  function handleTimeSelect(e) {
    setDiaSemanaSelecionado(days[e.target.id.split('-')[0]].toUpperCase())
    setDateHourSelected(e.target.id)
    setHourSelected(e.target.id)
  }

  useEffect(() => {
    setDomLoaded(true)
  }, [])

  return (
    <div className={styles.container}>
      <div className={styles.calendar}>
        <div className={styles.month}>
          <h1>{months[date.getMonth()]}</h1>
        </div>
        <div className={styles.weekdays}>
        {domLoaded &&
            calendar.map((day) => {
              return (
                <div key={day.day} className={styles.dayContainer}>
                  <div className={styles.day}>
                    <p className={styles.nameWeek}>{days[day.week]}</p>
                    <p>{day.day} <span>{months[day.month].substring(0, 3)}</span></p>
                  </div>
                  <div className={styles.hourContainer}>
                    {(day.week !== 0 && day.week !== 6) &&
                      day.hours.map((hour) => {
                        let dayHourId = `${day.week}-${replicateZeros(day.day, 2)}-${replicateZeros(day.month + 1, 2)}-${day.year}-H${hour.hour.substring(0, 2)}`
                        let defineStyle = styles.hour
                        
                        if(!day.available){
                          defineStyle = styles.hourDisabled
                        } else if (!hour.available) {
                          defineStyle = styles.hourDisabled
                        } else if (hourSelected === dayHourId) {
                          defineStyle = styles.hourSelected
                        }
                        return (
                            <div key={dayHourId}  id={dayHourId} onClick={(e) => handleTimeSelect(e)} className={defineStyle}
                            >
                              {hour.hour}
                            </div>)
                      })
                    } 
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
