import React, { useRef, useEffect, useState, Component } from 'react';
import './App.css';

class main extends Component{

    constructor(){
        super()
        this.state = {

        }
    }
    

    render(){
        const [nodes,setNodes] = useState({})
        const [qtd, setQtd] = useState(0)
        const ctxRef = useRef(null)
      
        const [x,setX] = useState(0)
        const [y,setY] = useState(0)

        
  

  useEffect(()=>{
    const canvasObj = canvasRef.current
    //canvasObj.width = window.innerWidth - 302
    console.log(window.innerWidth)
    console.log(window.innerHeight)
    //canvasObj.heigth = (window.innerHeight - 72)/2
    //canvasObj.style.width =`${window.innerWidth - 302}px`
    //canvasObj.style.heigth =`${(window.innerHeight - 72)/2}px`

    const ctx = canvasObj.getContext("2d")
    let escala = (window.innerWidth - 300)/1000
    ctx.scale(escala,escala)
    ctxRef.current = ctx
    
    draw()

    //ctx.fillStyle = 'red'
    //ctx.fillRect(50,20,20,20)
  },[])

  function draw(){
    //limpando
    ctxRef.current.fillStyle = "#181c22";
    ctxRef.current.fillRect(0,0,1000, 500);
    //console.log(nodes)
    for(var c in nodes){
      var circle = new Path2D();
      //circle.moveTo(20, 20);
      ctxRef.current.fillStyle = nodes[c].color
      circle.arc(nodes[c].x, nodes[c].y, 20, 0, 2 * Math.PI);
      ctxRef.current.fill(circle);
    }

  }


  function nextCircle(){
    console.log("oi")
    let x,y
    if(nodes.x< 800){
      x = nodes.x + 200
      y = nodes.y
    }else{
      x = 100
      y = nodes.y + 200
    }
    
    setNodes({x:x,y:y})
    draw(x,y)

  }

  function showQtd(){
    //setQtd(Object.keys(nodes).length)
    return
  }


  //ADD CIRCLE---------------------------------
  function clickOnCanvas(event){
    var rect = canvasRef.current.getBoundingClientRect();
    var xRel = Math.round((event.clientX - rect.left  )/((window.innerWidth- 300)/1000))
    var yRel = Math.round((event.clientY - rect.top)/((window.innerWidth- 300)/1000))
    //console.log("relativo X: "+ xRel)
    //console.log(`X: ${event.clientX - rect.left}`)
    //console.log(`Y: ${event.clientY - rect.top}`)
    //console.log(`Y: ${offSetY}`)

    let r = Math.floor(Math.random()*256)
    let g = Math.floor(Math.random()*256)
    let b = Math.floor(Math.random()*256)

    let name = Object.keys(nodes).length+1
    addCircle(name,xRel,yRel,`rgb(${r},${g},${b})`)
    draw()
  }

  function addCircle(name,x,y,color){
  
    setNodes(p =>{
      let novo = p
      novo[name] = {x:x,y:y,color:color}
      return novo
    })
    console.log(nodes)
  }

  function addCount(){
    setQtd(qtd+1)
  }
        return(
            <div className="App">
      <header>
        <h1>PATHS</h1>
      </header>
      <main>
        <canvas
          onClick = {clickOnCanvas}
          //onMouseDown={addCount}
          width = {(window.innerWidth - 300)}
          height = {(window.innerWidth - 300)/2}
          ref={canvasRef}
        />
        <div className="menu">
          <h3>Nodes: {qtd}</h3>
          <form>
            <input
              placeholder="x"
              onChange = {e=>setX(e.target.value)}
            />
            <input
              placeholder="y"
              onChange = {e=>setY(e.target.value)}
            />
          </form>
          <button className="button" onClick={showQtd} >Próximo circle</button>
        </div>
    
      </main>
    </div>
        )
    }

}