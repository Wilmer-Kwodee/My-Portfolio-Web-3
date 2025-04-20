export default function Card({item}){
    return(
      <a href={'/detail/' + item.id} className='card transition hover:bg-gray-300 m-24 p-10 rounded-3xl' style={{display: 'flex', height: 'auto'}}>
        <div id='left' style={{width: '50%', paddingLeft: 140}}>
          <img className='animate-bounce w-96' style={{height: 200, outlineStyle: 'solid', borderRadius: 20, outlineColor: 'whitesmoke', outlineWidth: 20}} src={item.image} alt='empty...' />
        </div>
        <div id='right' style={{width: '50%', paddingRight: 140}}>
          <h1 className='animate-bounce text-3xl font-bold'>{item.title}</h1>
          <span style={{ color: 'gray', whiteSpace: 'pre-wrap', maxWidth: 10}}>{item.desc.slice(0, 150)}...</span>
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
            {/* <img src="/SVGs/react.svg" className="w-10"/>
            <img src="/SVGs/firebase.svg" className="w-10"/>
            <img src="/SVGs/tailwind.svg" className="w-10"/>
            <img src="/SVGs/vercel.svg" className="w-10"/>
            <img src="/SVGs/laravel.svg" className="w-10"/>
            <img src="/SVGs/mysql.svg" className="w-10"/> */}
          </div>
          <br />
          <br />
          <br />
        </div>
      </a>
    )
}