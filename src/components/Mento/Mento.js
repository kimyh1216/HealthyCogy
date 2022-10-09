import { async } from '@firebase/util'
import React, { useEffect, useState } from 'react'
import { authService, dbService } from '../../fbase'
import './Mento.css'

const Mento = () => {
  const [dataArray, setDataArray] = useState([])
  const [mentoDataArray, setMentoDataArray] = useState([])
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userObj, setUserObj] = useState('')
  const [mentoSet, setMentoSet] = useState(false)
  const [mentoApearSet, setMentoApearSet] = useState(false)
  const [mentoId, setMentoId] = useState('')
  const [mentoringText, setMentoringText] = useState('')

  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true)
        setUserObj(user)
      } else {
        setIsLoggedIn(false)
      }
    })
    dbService.collection('comunity').onSnapshot((snapshot) => {
      const dataArray = snapshot.docs.map((doc) => ({
        ...doc.data(),
      }))
      const selectedUserArray = dataArray.filter((data) => {
        return data.user === userObj.uid
      })
      setDataArray(selectedUserArray)
    })
    dbService.collection('comunity').onSnapshot((snapshot) => {
      const dataArray = snapshot.docs.map((doc) => ({
        ...doc.data(),
      }))
      const selectedUserArray = dataArray.filter((data) => {
        return data.user === mentoId
      })
      const resultArray = selectedUserArray.filter((data) => {
        return data.touser === userObj.uid
      })
      setMentoDataArray(resultArray)
    })
  }, [userObj, mentoId])

  const mentoApearHandler = (e) => {
    e.preventDefault()
    mentoSet ? setMentoSet(false) : setMentoApearSet(true)
  }
  const onSubmitHandler = (e) => {
    e.preventDefault()
    setMentoSet(true)
    setMentoId(e.target.value)
    setMentoApearSet(false)
  }
  const onChangementoringTextHandler = (e) => {
    setMentoringText(e.target.value)
  }
  const enterkey = async () => {
    const createdAt = new Date.now()
    if (window.event.keyCode == 13) {
      await dbService
        .collection('comunity')
        .doc(userObj.uid + createdAt)
        .set({
          createdAt,
          user: userObj.uid,
          mento: mentoId,
          text: mentoringText,
          name: userObj.displayName,
          touser: '',
        })
        .then(
          await dbService.collection('mentomatch').doc(userObj.uid).set({
            user: userObj.uid,
            mento: mentoId,
          }),
        )
      setMentoringText('')
    }
  }
  // console.log(mentoDataArray)
  return (
    <div className="mentoComunityMain">
      {mentoApearSet ? (
        <form>
          <select onChange={onSubmitHandler}>
            <option>상담을 원하는 멘토를 선택해주세요.</option>
            <option value="R1ln1cgK3AcMmG1HbjQVEPKl28d2">호영</option>
            <option value="kBfiEAr4KmhQ82PxCcL42C2JDdB2">서연</option>
          </select>
        </form>
      ) : (
        <></>
      )}
      {mentoSet ? (
        <div className="mentoComunityMainContents">
          <div className="mentComunityDiv">
            {dataArray.map((data, index) => (
              <div className="talkBox" key={index}>
                <div className="mentoringUserBox">
                  <img
                    className="userMentoringProfile"
                    src={userObj.photoURL}
                  ></img>
                  {/* <h2>{userObj.displayName}</h2> */}
                </div>
                <span className="mentoringTextBox">{data.text}</span>
              </div>
            ))}
          </div>
          <div className="mentoComunityChatContainer">
            <input
              type="text"
              className="mentoCoumunityChat"
              value={mentoringText}
              onChange={onChangementoringTextHandler}
              onKeyUp={enterkey}
            ></input>
            <button onClick={enterkey}>Enter</button>
          </div>
        </div>
      ) : (
        <></>
      )}
      {isLoggedIn ? (
        <button onClick={mentoApearHandler}>멘토에게 물어보기(이미지)</button>
      ) : (
        <></>
      )}
    </div>
  )
}
export default Mento