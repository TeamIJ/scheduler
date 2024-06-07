import styles from "./styles.module.css";
import { useState, useEffect } from "react";
import { replicateZeros } from "@/services/utils";

const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

let date = new Date()

let daysHours = {
  1: {
    hoursIds: []
  },
  2: {
    hoursIds: []
  },
  3: {
    hoursIds: []
  },
  4: {
    hoursIds: []
  },
  5: {
    hoursIds: []
  }
}

export function CalendarWeek({ calendar, tela, setDateHourSelected, setDiaSemanaSelecionado, setDiasHabilitados, setHorariosHabilitados, ...rest }) {

  const [hourSelected, setHourSelected] = useState()
  const [domLoaded, setDomLoaded] = useState(false)
  const [daysEnabled, setDaysEnabled] = useState([])
  const [hoursEnabled, setHoursEnabled] = useState([])
  const [dayHoursCount, setDayHoursCount] = useState({
    1: {
      count: 0
    },
    2: {
      count: 0
    },
    3: {
      count: 0
    },
    4: {
      count: 0
    },
    5: {
      count: 0
    }
  })

  function handleTimeSelect(e) {
    setDiaSemanaSelecionado(days[e.target.id.split('-')[0]].toUpperCase())
    setDateHourSelected(e.target.id)
    setHourSelected(e.target.id)
  }

  function handleDayClick(e) {
    let day = parseInt(e.target.id)
    let dayFiltered = daysEnabled.find(d => {
      return d === day
    })
    if (dayFiltered) {
      setDaysEnabled(prevDaysEnabled => prevDaysEnabled.filter((d) => {
        return d !== dayFiltered
      }))

      setHoursEnabled(prevHoursEnabled => prevHoursEnabled.filter((h) => {
        return h.split('-')[0] !== e.target.id
      }))
      let dayHoursCountAux = dayHoursCount
      dayHoursCountAux[day].count = 0
      setDayHoursCount(prevDayHoursCount => dayHoursCountAux)

    } else {
      setDaysEnabled(prevDaysEnabled => [...prevDaysEnabled, day])
      let hoursEnabledAux = hoursEnabled
      daysHours[day].hoursIds.forEach(id => {
        let dayHoursCountAux = dayHoursCount
        dayHoursCountAux[day].count++
        setDayHoursCount(prevDayHoursCount => dayHoursCountAux)
        hoursEnabledAux.push(id)
      })
      setHoursEnabled(prevHoursEnabled => hoursEnabledAux)
    }

  }

  function handleTimeClick(e) {
    let day = parseInt(e.target.id.split('-')[0])
    let hourId = e.target.id


    let hourFiltered = hoursEnabled.find(h => {
      return h === hourId
    })

    if (hourFiltered) {
      setHoursEnabled(prevHoursEnabled => prevHoursEnabled.filter((h) => {
        return h !== hourId
      }))
      let dayHoursCountAux = dayHoursCount
      dayHoursCountAux[day].count--
      setDayHoursCount(prevDayHoursCount => dayHoursCountAux)

    } else {
      setHoursEnabled(prevHoursEnabled => [...prevHoursEnabled, hourId])
      let dayHoursCountAux = dayHoursCount
      dayHoursCountAux[day].count++
      setDayHoursCount(prevDayHoursCount => dayHoursCountAux)

    }

    let dayFiltered = daysEnabled.find(d => {
      return d === day
    })

    if (dayFiltered) {
      if (dayHoursCount[day].count === 0) {
        setDaysEnabled(prevDaysEnabled => prevDaysEnabled.filter((d) => {
          return d !== dayFiltered
        }))
      }
    } else {
      setDaysEnabled(prevDaysEnabled => [...prevDaysEnabled, day])
    }
  }

  useEffect(() => {
    setDomLoaded(true)

    let daysAvailable = []
    let hoursAvailable = []
    calendar.forEach(day => {
      if (day.available) {
        daysAvailable.push(day.week)
      }
      day.hours.forEach(hour => {
        daysHours[day.week].hoursIds.push(`${day.week}-${replicateZeros(day.day, 2)}-${replicateZeros(day.month + 1, 2)}-${day.year}-H${hour.hour.substring(0, 2)}`)
        if (day.available && hour.available) {
          hoursAvailable.push(`${day.week}-${replicateZeros(day.day, 2)}-${replicateZeros(day.month + 1, 2)}-${day.year}-H${hour.hour.substring(0, 2)}`)
          let dayHoursCountAux = dayHoursCount
          dayHoursCountAux[day.week].count++
          setDayHoursCount(prevDayHoursCount => dayHoursCountAux)
        }
      })
    })
    setDaysEnabled(prevDaysEnabled => daysAvailable)
    setHoursEnabled(prevHoursEnabled => hoursAvailable)
  }, [])

  useEffect(() => {
    if (tela === 'HORARIOS') {
      setDiasHabilitados(prevDiasHabilitados => daysEnabled)
      setHorariosHabilitados(prevHoursEnabled => hoursEnabled)
    }
  }, [daysEnabled, hoursEnabled])

  return (
    <div className={styles.container}>
      <div className={styles.calendar}>
        <div className={styles.month}>
          <h1>{months[date.getMonth()]}</h1>
        </div>
        <div className={styles.weekdays}>
          {domLoaded &&
            calendar.map((day) => {
              let defineStyleDay = styles.day
              if (tela === 'HORARIOS') {
                if (day.week === 0 || day.week === 6) {
                  defineStyleDay = styles.dayDisabled
                } else {
                  if (daysEnabled.includes(day.week)) {
                    defineStyleDay = styles.dayClickableEnabled
                  } else {
                    defineStyleDay = styles.dayClickableDisabled
                  }
                }
              } else {
                defineStyleDay = styles.day
              }
              return (
                <div key={day.day} className={styles.dayContainer}>
                  <div id={day.week} className={defineStyleDay} onClick={(e) => tela === 'HORARIOS' ? handleDayClick(e) : () => { return }}>
                    {tela !== 'HORARIOS' ?
                      <>
                        <p className={styles.nameWeek}>{days[day.week]}</p>
                        <p>{day.day} <span>{months[day.month].substring(0, 3)}</span></p>
                      </>
                      : <p id={day.week} className={styles.nameWeek}>{days[day.week]}</p>
                    }
                  </div>
                  <div className={styles.hourContainer}>
                    {(day.week !== 0 && day.week !== 6) &&
                      day.hours.map((hour) => {
                        let dayHourId = `${day.week}-${replicateZeros(day.day, 2)}-${replicateZeros(day.month + 1, 2)}-${day.year}-H${hour.hour.substring(0, 2)}`
                        let defineStyle = styles.hour

                        if (tela === 'HORARIOS') {
                          defineStyle = styles.hourEnabled
                        }

                        if (tela !== 'HORARIOS') {
                          if (!day.available) {
                            defineStyle = styles.hourDisabled
                          } else if (!hour.available || dayHourId.includes(hoursEnabled)) {
                            defineStyle = styles.hourDisabled
                          } else if (hourSelected === dayHourId) {
                            defineStyle = styles.hourSelected
                          }
                        } else {
                          if (daysEnabled.includes(day.week)) {
                            if (hoursEnabled.includes(dayHourId)) {
                              defineStyle = styles.hourEnabled
                            } else {
                              defineStyle = styles.hourDisabledClickavel
                            }
                          } else {
                            defineStyle = styles.hourDisabledClickavel
                          }
                        }
                        return (
                          <div key={dayHourId} id={dayHourId} onClick={(e) => tela !== 'HORARIOS' ? handleTimeSelect(e) : handleTimeClick(e)} className={defineStyle}>
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

