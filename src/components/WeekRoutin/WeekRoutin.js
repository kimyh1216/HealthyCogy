import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { dbService } from '../../fbase'
import GetData from '../GetData/GetData'
import GetWeekRoutinList from './GetWeekRoutinList/GetWeekRoutinList'
import './WeekRoutin.css'
import Dropdown from '../Dropdown/Dropdown'

const WeekRoutin = ({ dayValue, userObj, setPage, shutDownHandler }) => {
  const dayCalculationArray = [] //클릭한 날짜 일주일간 배열 생성
  const CalculationNum = dayValue.getDay() //클릭한 날짜 인덱스 배열로 변환코드
  let startdayValue = dayjs(dayValue)
  startdayValue = startdayValue.add(-CalculationNum, 'day')

  for (let i = 0; i < 7; i++) {
    const inputDay = dayjs(startdayValue)
    const resultDay = inputDay.add(i, 'day')
    dayCalculationArray.push(resultDay)
  }
  return (
    <div className="WeekRoutin">
      {dayCalculationArray.map((date) => (
        <div key={Math.random()}>
          <GetWeekRoutinList
            userObj={userObj}
            date={date}
            setPage={setPage}
            shutDownHandler={shutDownHandler}
          />
          <button className="routinBtn">기본루틴</button>
          {/* <Dropdown  userObj={userObj}
            date={date}
            setPage={setPage}
            shutDownHandler={shutDownHandler}/> */}
        </div>
        //내가 뽑고 싶은 것을 컴퍼넌트로.
      ))}
    </div>
  )
}
export default WeekRoutin
