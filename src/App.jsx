import { useEffect, useRef, useState } from 'react';
import {db, getCities, updateDoc} from '../firebase';
import {doc, deleteDoc} from 'firebase/firestore/lite';
import Card from './components/Card';

function App() {
  const [notes, setNote] = useState([])
  const dragItem = useRef()
  const dragOverItem = useRef()

  useEffect(() => {
    getCities(db).then(setNote);  // Resolve promise and set the result to state
  }, [notes]);

  async function handleUpdate(item){
    window.location.href = '/update/' + item.id
  }

  async function handleDelete(id){
    if(confirm('you sure?')){      
      await deleteDoc(doc(db, 'MyProjects', id))
      alert('success')
      window.location.href = '/'
    }
  }

  async function handleOrderChangeDB(){
    const currentID = notes[dragItem.current].id;
    const targetID = notes[dragOverItem.current].id;
    
    console.log("curr:" + dragItem.current + "-" + currentID)
    console.log("target:" + dragOverItem.current + "-" + targetID)
    
    const currRef = doc(db, 'MyProjects', currentID)
    await updateDoc(currRef, { order: dragOverItem.current })
    const targetRef = doc(db, 'MyProjects', targetID)
    await updateDoc(targetRef, { order: dragItem.current })
  }

  const dragStart = (e) => {
    dragItem.current = e;
  }
  const dragEnter = (e) => {
    dragOverItem.current = e;
  }
  const drop = async () => {
    const copyArray = [...notes]
    const dragItemContent = copyArray[dragItem.current]
    
    copyArray.splice(dragItem.current, 1)
    copyArray.splice(dragOverItem.current, 0, dragItemContent)
    
    await handleOrderChangeDB()
    dragItem.current = null
    dragOverItem.current = null
    setNote(copyArray)
  }

  return (
    <div style={{fontFamily: 'arial'}}>

      <div id='section-01' style={{padding: 60, paddingLeft: 80}}>
        {/* <img src='wp4054327.jpg' /> */}
        <h1 className='font-bold' style={{fontSize: 60}}>The <br/>Control Room</h1>
        <a href='/insert' style={{backgroundColor: 'lightblue', padding: 20, borderRadius: 100, textDecoration: 'none', fontSize: 30}}>+</a>
      </div>

      <hr />
      
      <table>
      <tbody>
      {notes ? <></> : <h1>loading...</h1>}
        {notes
        .map( (item, i) => {
          return(
            <tr 
              key={i}
              onDragStart={() => dragStart(i)}
              onDragEnter={() => dragEnter(i)}
              onDragEnd={drop}
              draggable 
              >
              <td>

              <div style={{display: 'flex', backgroundColor: item.color, padding: 30, height: 'auto'}}>
                <div id='left' style={{width: '50%', paddingLeft: 140}}>
                <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="none" viewBox="0 0 25 25"><path fill="#121923" d="M9.5 8a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm0 6a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm1.5 4.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0ZM15.5 8a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm1.5 4.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0ZM15.5 20a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"/></svg>
                  <img className="w-96" style={{height: 200, outlineStyle: 'solid', borderRadius: 20, outlineColor: 'whitesmoke', outlineWidth: 20}} src={item.image} alt='empty...' />
                </div>
                <div id='right' style={{width: '50%', paddingRight: 130}}>
                  <h1 className='text-3xl font-bold'>{item.title}</h1>
                  <span style={{ whiteSpace: 'pre-wrap' }}>{item.desc.slice(0, 200)}...</span>
                  <div className="flex gap-5 pt-5">
                    {item.technologies ? 
                      item.technologies.map((tech) => (
                        <>
                        <img src={`/SVGs/${tech}.svg`} className="w-10"/>
                        </>
                      ))
                      :
                      <></>
                    }
                  </div>
                    <span>{item.order}</span>
                  <br />
                  <br />
                  <br />
                  <button onClick={() => handleUpdate(item)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 64 64"><path d="M22 51c-1-1-4-1-4-1l-.425-1.274a3.64 3.64 0 0 0-2.301-2.301L14 46s.5-2.5-1-4l25-25 8 10-24 24zm30-30-9-9 4.68-4.68s3.5-1.5 7 2 2 7 2 7L52 21zM9 50l-1.843 4.476c-.614 1.49.877 2.981 2.367 2.367L14 55l-5-5z"/></svg>
                    </button>
                  <button onClick={() => handleDelete(item.id)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 30 30"><path d="M14.984 2.486A1 1 0 0 0 14 3.5V4H8.5a1 1 0 0 0-1.014 1H6a1 1 0 1 0 0 2h18a1 1 0 1 0 0-2h-1.486A1 1 0 0 0 21.5 4H16v-.5a1 1 0 0 0-1.016-1.014zM6 9l1.793 15.234A1.997 1.997 0 0 0 9.777 26h10.446a1.998 1.998 0 0 0 1.984-1.766L24 9H6z"/></svg>
                  </button>
                </div>
              </div>
              <hr/>

              </td>
            </tr>
            // <Card item={item}/>
          );
        }
        )}
      </tbody>
    </table>

    </div>
  );
}

export default App;