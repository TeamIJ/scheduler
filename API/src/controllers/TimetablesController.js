const timetables = require('../models/Timetables.js')

const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

async function getTimetables(){
    let timetable = {
        0: { content: [] },
        1: { content: {} },
        2: { content: {} },
        3: { content: {} },
        4: { content: {} },
        5: { content: {} },
        6: { content: [] },
    }

    let dayInfo = await timetables.getByDay(days[1])
    timetable[1].content = JSON.parse(JSON.stringify(dayInfo))

    dayInfo = await timetables.getByDay(days[2])
    timetable[2].content = JSON.parse(JSON.stringify(dayInfo))

    dayInfo = await timetables.getByDay(days[3])
    timetable[3].content = JSON.parse(JSON.stringify(dayInfo))

    dayInfo = await timetables.getByDay(days[4])
    timetable[4].content = JSON.parse(JSON.stringify(dayInfo))

    dayInfo = await timetables.getByDay(days[5])
    timetable[5].content = JSON.parse(JSON.stringify(dayInfo))

    return timetable
}

async function getCalendar() {
    let date = new Date()
    let calendario = []
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
        let timetables = await getTimetables()

        let dayInfo = timetables[dayOfWeek].content

        let hours = []
        dayInfo.forEach(time => {
            hours.push({
                "hour": time.HORARIO.substring(0, 5),
                "available": time.STATUS_HORARIO === "D"
            })
        })
        let dayAvailable
        if (timetables[dayOfWeek].content.length > 0) {
            dayAvailable = timetables[dayOfWeek].content[0].STATUS_DIA === "D"
        } else {
            dayAvailable = false
        }
        calendario.push({
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

    return calendario
}

module.exports = {

    findAll(req, res, next) {
        timetables.findAll(req, res)
    },

    findByDayAndTime(req, res, next) {
        const timetable = req.body
        timetables.findByDayAndTime(req, res, timetable)
    },

    findByDay(req, res, next) {
        const { day } = req.params
        timetables.findByDay(req, res, day)
    },

    updateHour(req, res, next) {
        const timetable = req.body

        timetables.disableAllHours(timetable)
        
        timetables.updateHour(timetable)

        res.status(200)
    },

    updateDays(req, res, next) {
        const timetable = req.body

        timetables.disableAllDays()

        timetables.updateDays(timetable)

        res.status(200)
    },

    async getCalendarInfo(req, res, next){
        let calendar = await getCalendar()
        res.json(calendar)
    }

}