import styles from "./styles.module.css";
import { api } from "@/services/apiClient";
import { useState, useEffect } from "react";

const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

let date = new Date()
const calendar = []

function replicateZeros(num, size) {
  num = num.toString()
  while (num.length < size) num = "0" + num
  return num
}

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

  const response = await api.get('/api/scheduler/days')

  let days = response.data


  while (dayOfWeek < 7) {
    let dayAvailable = days[dayOfWeek].DISPONIVEL === "S"
    calendar.push({
      day: dayCurrent,
      week: dayOfWeek,
      month: month,
      year: year,
      available: dayAvailable,
      hours: []
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

async function getHours() {
  const response = await api.get('/api/scheduler/timetables')

  let timetables = response.data

  calendar.forEach(day => {
    timetables.forEach(hour => {
      day.hours.push(hour.HORARIO.substring(0, 5))
    })
  })
}

getDayOfWeek()
getHours()

export function CalendarWeek({ setDateHourSelected, ...rest }) {

  const [hourSelected, setHourSelected] = useState()
  const [domLoaded, setDomLoaded] = useState(false)
  function handleTimeSelect(e) {
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
                        let dayHourId = `${replicateZeros(day.day, 2)}-${replicateZeros(day.month + 1, 2)}-${day.year}-H${hour.substring(0, 2)}`
                        return (
                            <div key={dayHourId}  id={dayHourId} onClick={(e) => handleTimeSelect(e)} className={!day.available ? styles.hourDisabled : 
                              hourSelected === dayHourId ? styles.hourSelected : styles.hour}
                            >
                              {hour}
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
