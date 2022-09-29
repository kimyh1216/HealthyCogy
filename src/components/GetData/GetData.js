import React, { useEffect, useState } from 'react'
import { dbService } from '../../fbase'

const GetData = (props) => {
  const userId = props.userObj
  const [data, setData] = useState([])

  useEffect(() => {
    //실시간으로 DB에서 받아오기.
    dbService.collection('userId').onSnapshot((snapshot) => {
      const dataArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      setData(dataArray)
    })
  }, [])

  const deleteHandler = async (docId) => {
    const ok = window.confirm('진짜로 지우게?')
    if (ok) {
      await dbService.collection('userId').doc(`${docId.id}`).delete()
    }
  }

  const editHandler = async (docId) => {
    await dbService.collection('userId').doc(`${docId.id}`).set({
      //바꾸려는 값
      aaa: 'aaa',
    })
  }

  return (
    <div>
      {data.map((data) => (
        <div key={Math.random()}>
          <div onClick={deleteHandler.bind(null, data)}>얻고자 하는 데이터</div>
          <button onClick={editHandler.bind(null, data)}>수정</button>
        </div>
      ))}
    </div>
  ) //값은 data에 있음(console로 부르고 ) 캘린더 날짜를 받아와 그 날짜에 맞는 값을 찍어라
}
export default GetData
